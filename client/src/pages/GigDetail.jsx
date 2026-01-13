import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig, clearCurrentGig } from '../store/slices/gigSlice';
import { submitBid, fetchBids, hireFreelancer } from '../store/slices/bidSlice';
import BidForm from '../components/BidForm';
import BidList from '../components/BidList';

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
    return () => {
      dispatch(clearCurrentGig());
    };
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
      // Refetch bids to ensure we have the latest statuses from the server
      await dispatch(fetchBids(id));
      // Refetch gig to get updated status
      await dispatch(fetchGig(id));
    }
  };

  if (gigLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Loading gig details...</p>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Gig not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/browse')}
        className="text-indigo-600 hover:text-indigo-800 mb-4"
      >
        ← Back to Gigs
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{currentGig.title}</h1>
          <span
            className={`px-3 py-1 text-sm rounded ${
              currentGig.status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {currentGig.status}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{currentGig.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Posted by</p>
            <p className="font-medium">{currentGig.ownerId?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Budget</p>
            <p className="text-3xl font-bold text-indigo-600">${currentGig.budget}</p>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Bids for this Gig</h2>
            {currentGig.status === 'assigned' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                Gig Assigned
              </span>
            )}
          </div>
          {bidsLoading ? (
            <p className="text-gray-500">Loading bids...</p>
          ) : bids.length === 0 ? (
            <p className="text-gray-500">No bids yet. Check back later!</p>
          ) : (
            <>
              {currentGig.status === 'assigned' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    This gig has been assigned. All bids are shown below with their final status.
                  </p>
                </div>
              )}
              <BidList bids={bids} onHire={handleHire} gigStatus={currentGig.status} />
            </>
          )}
        </div>
      )}

      {canBid && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Submit a Bid
            </button>
          ) : (
            <BidForm
              gigId={id}
              onCancel={() => setShowBidForm(false)}
              onSuccess={() => {
                setShowBidForm(false);
                // Refresh my bids if user navigates to My Bids page
                navigate('/my-bids');
              }}
            />
          )}
        </div>
      )}

      {!isAuthenticated && currentGig.status === 'open' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <Link to="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>{' '}
            to submit a bid on this gig.
          </p>
        </div>
      )}
    </div>
  );
};

export default GigDetail;

