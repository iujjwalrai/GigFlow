import { useSelector } from 'react-redux';

const BidList = ({ bids, onHire, gigStatus }) => {
  const { loading } = useSelector((state) => state.bids);

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div
          key={bid._id}
          className={`border rounded-lg p-4 ${
            bid.status === 'hired'
              ? 'bg-green-50 border-green-200'
              : bid.status === 'rejected'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {bid.freelancerId?.name || 'Unknown'}
              </p>
              <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">${bid.price}</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                  bid.status === 'hired'
                    ? 'bg-green-100 text-green-800'
                    : bid.status === 'rejected'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {bid.status}
              </span>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{bid.message}</p>
          {gigStatus === 'open' && bid.status === 'pending' && (
            <button
              onClick={() => onHire(bid._id)}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Hiring...' : 'Hire'}
            </button>
          )}
          {gigStatus === 'assigned' && (
            <div className="text-sm text-gray-500 mt-2">
              {bid.status === 'hired' && (
                <span className="text-green-600 font-semibold">✓ Hired</span>
              )}
              {bid.status === 'rejected' && (
                <span className="text-gray-600">✗ Not selected</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BidList;

