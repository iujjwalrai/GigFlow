import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigSlice';
import { Search, X, Wallet, User, Briefcase } from 'lucide-react';

const BrowseGigs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { gigs, loading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchGigs(''));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(searchQuery));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6 flex items-center gap-3">
          <Briefcase className="text-indigo-600 w-9 h-9" />
          Browse Gigs
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 bg-white/70 backdrop-blur-lg shadow-md px-4 py-3 rounded-xl border border-gray-200 hover:shadow-lg transition"
        >
          <Search className="text-gray-500 w-5 h-5" />

          <input
            type="text"
            placeholder="Search gigs by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                dispatch(fetchGigs(''));
              }}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Loading gigs...</p>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No gigs found. Be the first to post one!</p>
        </div>
      ) : (
        /* GIG GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gig/${gig._id}`}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-6 hover:-translate-y-1 hover:shadow-2xl transition transform"
            >
              {/* Title */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
                {gig.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {gig.description}
              </p>

              {/* Budget & User */}
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                  <Wallet className="w-5 h-5" />
                  ${gig.budget}
                </span>

                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  {gig.ownerId?.name || 'Unknown'}
                </span>
              </div>

              {/* Status Pill */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  gig.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {gig.status.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseGigs;
