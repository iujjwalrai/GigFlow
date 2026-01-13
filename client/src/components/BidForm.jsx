import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitBid, clearError } from '../store/slices/bidSlice';

import { DollarSign, MessageSquare, SendHorizonal, XCircle } from 'lucide-react';

const BidForm = ({ gigId, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    message: '',
    price: '',
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.bids);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitBid({ ...formData, gigId }));
    if (!result.error) onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition"
    >
      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        Submit Your Bid
      </h3>

      {/* Error Box */}
      {error && (
        <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          <XCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Bid Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-indigo-600" />
          Your Price ($)
        </label>

        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          required
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          Message
        </label>

        <textarea
          name="message"
          rows="4"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell the client why you're the right fit..."
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? (
            'Submitting...'
          ) : (
            <>
              Submit Bid
              <SendHorizonal className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BidForm;
