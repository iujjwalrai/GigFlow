import express from 'express';
import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Submit a bid for a gig
router.post('/', authenticate, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is no longer open for bidding' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() === req.userId.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({ gigId, freelancerId: req.userId });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this gig' });
    }

    const bid = new Bid({
      gigId,
      freelancerId: req.userId,
      message,
      price: parseFloat(price),
      status: 'pending'
    });

    await bid.save();
    await bid.populate('freelancerId', 'name email');
    await bid.populate('gigId', 'title');

    res.status(201).json(bid);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already bid on this gig' });
    }
    console.error('Create bid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bids by the authenticated user (for freelancers)
router.get('/my-bids', authenticate, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.userId })
      .populate('freelancerId', 'name email')
      .populate({
        path: 'gigId',
        populate: { path: 'ownerId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bids for a specific gig (Owner only)
router.get('/:gigId', authenticate, async (req, res) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Only the gig owner can view bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Hire a freelancer (Atomic update with transaction)
router.patch('/:bidId/hire', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // Find the bid
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Find the gig
    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.userId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Only the gig owner can hire' });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Gig is no longer open' });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Bid is no longer pending' });
    }

    // Atomic update: Update gig status, hire the selected bid, reject all others
    await Gig.findByIdAndUpdate(
      gig._id,
      { status: 'assigned' },
      { session }
    );

    await Bid.findByIdAndUpdate(
      bidId,
      { status: 'hired' },
      { session }
    );

    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();

    // Get all updated bids for this gig with populated fields
    const allBids = await Bid.find({ gigId: gig._id })
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title')
      .sort({ createdAt: -1 });

    // Get the hired bid
    const hiredBid = allBids.find(b => b._id.toString() === bidId.toString());

    // Emit real-time notification via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${bid.freelancerId.toString()}`).emit('hired', {
        message: `You have been hired for ${gig.title}!`,
        gig: {
          id: gig._id,
          title: gig.title
        },
        bid: {
          id: bid._id
        }
      });
    }

    res.json({
      message: 'Freelancer hired successfully',
      bid: hiredBid,
      allBids: allBids
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Hire error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
});

export default router;

