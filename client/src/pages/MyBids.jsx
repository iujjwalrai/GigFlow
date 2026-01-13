import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBids } from '../store/slices/bidSlice';

import {
  ScrollText,
  ArrowRight,
  User2,
  DollarSign,
  BadgeCheck,
  Hourglass,
  XCircle
} from 'lucide-react';

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
      <div className="max-w-7xl mx-auto py-14 text-center text-gray-500 animate-fadeIn">
        Loading your bids...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">

      {/* Header */}
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-8 flex items-center gap-3">
        <ScrollText className="w-8 h-8 text-indigo-600" />
        My Bids
      </h1>

      {/* When No Bids */}
      {!loading && myBids.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xl shadow-md border border-gray-200 rounded-2xl">
          <p className="text-gray-600 text-lg mb-4">
            You haven't submitted any bids yet.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-lg hover:text-indigo-800 transition"
          >
            Browse available gigs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myBids.map((bid) => (
            <Link
              key={bid._id}
              to={`/gig/${bid.gigId._id}`}
              className="block bg-white/80 backdrop-blur-xl shadow-md border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition transform"
            >
              <div className="flex justify-between items-start">
                
                {/* Left Section */}
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {bid.gigId?.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <User2 className="w-4 h-4" />
                    Posted by: {bid.gigId?.ownerId?.name || 'Unknown'}
                  </div>

                  <p className="text-gray-700 line-clamp-2 mb-3">
                    {bid.message}
                  </p>

                  {/* Gig Status */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      bid.gigId?.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Gig Status: {bid.gigId?.status}
                  </span>
                </div>

                {/* Right Section */}
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    <p className="text-2xl font-bold text-indigo-600">{bid.price}</p>
                  </div>

                  {/* Bid Status Badge */}
                  <span
                    className={`mt-3 inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full font-medium ${
                      bid.status === 'hired'
                        ? 'bg-green-100 text-green-800'
                        : bid.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {bid.status === 'hired' && <BadgeCheck className="w-4 h-4" />}
                    {bid.status === 'pending' && <Hourglass className="w-4 h-4" />}
                    {bid.status === 'rejected' && <XCircle className="w-4 h-4" />}
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>
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
