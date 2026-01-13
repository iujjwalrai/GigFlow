import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig, clearCurrentGig } from '../store/slices/gigSlice';
import { submitBid, fetchBids, hireFreelancer } from '../store/slices/bidSlice';

import BidForm from '../components/BidForm';
import BidList from '../components/BidList';

import {
  ArrowLeft,
  BadgeCheck,
  DollarSign,
  User2,
  FileText,
  Gavel
} from 'lucide-react';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, loading: bidsLoading } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    dispatch(fetchGig(id));
    return () => dispatch(clearCurrentGig());
  }, [id, dispatch]);

  useEffect(() => {
    if (currentGig && isAuthenticated && currentGig.ownerId._id === user?.id) {
      dispatch(fetchBids(id));
    }
  }, [currentGig, isAuthenticated, user, id, dispatch]);

  const isOwner = currentGig && isAuthenticated && currentGig.ownerId._id === user?.id;
  const canBid = isAuthenticated && !isOwner && currentGig?.status === 'open';

  const handleHire = async (bidId) => {
    const result = await dispatch(hireFreelancer(bidId));
    if (!result.error) {
      await dispatch(fetchBids(id));
      await dispatch(fetchGig(id));
    }
  };

  if (gigLoading) {
    return (
      <div className="max-w-4xl mx-auto py-14 text-center text-gray-500 animate-fadeIn">
        Loading gig details...
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="max-w-4xl mx-auto py-14 text-center text-gray-600 animate-fadeIn">
        Gig not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/browse')}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Gigs
      </button>

      {/* Gig Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-8 mb-8 hover:shadow-2xl transition">
        
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {currentGig.title}
          </h1>

          <span
            className={`px-4 py-1 text-sm rounded-full font-medium ${
              currentGig.status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {currentGig.status.toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <div className="flex items-start gap-3 mb-6">
          <FileText className="w-6 h-6 text-indigo-600" />
          <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
            {currentGig.description}
          </p>
        </div>

        {/* Owner & Budget */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center gap-3">
            <User2 className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-sm text-gray-500">Posted by</p>
              <p className="font-semibold text-gray-800">{currentGig.ownerId?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            <div className="text-right">
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-3xl font-bold text-indigo-600">{currentGig.budget}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner View: Bids */}
      {isOwner && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-8 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Gavel className="w-7 h-7 text-indigo-600" />
              Bids for this Gig
            </h2>

            {currentGig.status === 'assigned' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" />
                Assigned
              </span>
            )}
          </div>

          {bidsLoading ? (
            <p className="text-gray-500">Loading bids...</p>
          ) : bids.length === 0 ? (
            <p className="text-gray-600">No bids yet — check back later!</p>
          ) : (
            <>
              {currentGig.status === 'assigned' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  This gig has been assigned. All bids below show final status.
                </div>
              )}

              <BidList bids={bids} onHire={handleHire} gigStatus={currentGig.status} />
            </>
          )}
        </div>
      )}

      {/* Bid Form (if not owner) */}
      {canBid && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-8 mb-8">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition"
            >
              Submit a Bid
            </button>
          ) : (
            <BidForm
              gigId={id}
              onCancel={() => setShowBidForm(false)}
              onSuccess={() => {
                setShowBidForm(false);
                navigate('/my-bids');
              }}
            />
          )}
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && currentGig.status === 'open' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="text-yellow-800 text-sm">
            <Link className="text-indigo-600 font-medium hover:underline" to="/login">
              Sign in
            </Link>{' '}
            to submit a bid.
          </p>
        </div>
      )}
    </div>
  );
};

export default GigDetail;
