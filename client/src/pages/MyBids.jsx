import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBids } from '../store/slices/bidSlice';

const MyBids = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myBids, loading } = useSelector((state) => state.bids);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyBids());
    }
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Loading your bids...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bids</h1>

      {!loading && myBids.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-4">You haven't submitted any bids yet.</p>
          <Link
            to="/browse"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Browse available gigs →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <Link
              key={bid._id}
              to={`/gig/${bid.gigId._id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {bid.gigId?.title || 'Gig Title'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Posted by: {bid.gigId?.ownerId?.name || 'Unknown'}
                  </p>
                  <p className="text-gray-600 line-clamp-2 mb-3">{bid.message}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-indigo-600">${bid.price}</p>
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded mt-2 ${
                      bid.status === 'hired'
                        ? 'bg-green-100 text-green-800'
                        : bid.status === 'rejected'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {bid.status === 'hired' && '✓ Hired'}
                    {bid.status === 'rejected' && '✗ Rejected'}
                    {bid.status === 'pending' && '⏳ Pending'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded ${
                      bid.gigId?.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Gig Status: {bid.gigId?.status || 'unknown'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Bid submitted: {new Date(bid.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;

