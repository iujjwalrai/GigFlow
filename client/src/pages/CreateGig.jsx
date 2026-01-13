import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createGig, clearError } from '../store/slices/gigSlice';
import { FileText, DollarSign, PencilLine, ArrowLeftCircle } from 'lucide-react';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.gigs);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createGig(formData));
    if (!result.error) {
      navigate('/my-gigs');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
        Post a New Gig
      </h1>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition"
      >
        {/* Error Box */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Need a MERN stack developer"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <PencilLine className="w-5 h-5 text-indigo-600" />
            Description
          </label>
          <textarea
            name="description"
            rows="6"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project in detail..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Budget */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Budget ($)
          </label>
          <input
            type="number"
            name="budget"
            min="0"
            step="0.01"
            required
            value={formData.budget}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Gig'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGig;
