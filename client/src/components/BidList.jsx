import { useSelector } from 'react-redux';
import {
  User2,
  Mail,
  DollarSign,
  CheckCircle,
  XCircle,
  Hourglass,
  BadgeCheck
} from 'lucide-react';

const BidList = ({ bids, onHire, gigStatus }) => {
  const { loading } = useSelector((state) => state.bids);

  return (
    <div className="space-y-6">
      {bids.map((bid) => (
        <div
          key={bid._id}
          className={`rounded-2xl p-6 border shadow-sm transition hover:shadow-xl hover:-translate-y-1
            ${
              bid.status === 'hired'
                ? 'bg-green-50 border-green-200'
                : bid.status === 'rejected'
                ? 'bg-red-50 border-red-200'
                : 'bg-white/80 backdrop-blur-xl border-gray-200'
            }
          `}
        >
          {/* HEADER: Freelancer + Price */}
          <div className="flex justify-between items-start mb-4">
            {/* Freelancer Info */}
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User2 className="w-5 h-5 text-gray-700" />
                {bid.freelancerId?.name || 'Unknown'}
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-gray-500" />
                {bid.freelancerId?.email}
              </p>
            </div>

            {/* Price + Status */}
            <div className="text-right">
              <p className="flex items-center gap-1 justify-end text-2xl font-bold text-indigo-600">
                <DollarSign className="w-5 h-5" />
                {bid.price}
              </p>

              <span
                className={`inline-flex items-center gap-1 px-3 py-1 mt-2 text-xs font-semibold rounded-full
                  ${
                    bid.status === 'hired'
                      ? 'bg-green-100 text-green-700'
                      : bid.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                `}
              >
                {bid.status === 'hired' && <CheckCircle className="w-4 h-4" />}
                {bid.status === 'rejected' && <XCircle className="w-4 h-4" />}
                {bid.status === 'pending' && <Hourglass className="w-4 h-4" />}
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Bid Message */}
          <p className="text-gray-700 mb-4 leading-relaxed">{bid.message}</p>

          {/* ACTIONS */}
          {gigStatus === 'open' && bid.status === 'pending' && (
            <button
              onClick={() => onHire(bid._id)}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {!loading ? (
                <>
                  Hire
                  <BadgeCheck className="w-4 h-4" />
                </>
              ) : (
                'Hiring...'
              )}
            </button>
          )}

          {/* Status when Gig Assigned */}
          {gigStatus === 'assigned' && (
            <div className="mt-3 text-sm">
              {bid.status === 'hired' && (
                <span className="flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle className="w-4 h-4" /> Hired
                </span>
              )}

              {bid.status === 'rejected' && (
                <span className="flex items-center gap-1 text-gray-600">
                  <XCircle className="w-4 h-4" /> Not selected
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BidList;
