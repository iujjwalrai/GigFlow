import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigSlice';
import { Search, X, Briefcase, DollarSign, User, TrendingUp } from 'lucide-react';

const Home = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Find Your Next Opportunity
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
              Discover amazing gigs and connect with talented professionals
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search gigs by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-gray-900 shadow-lg focus:ring-4 focus:ring-indigo-300 transition-all duration-200 text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    dispatch(fetchGigs(''));
                  }}
                  className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Gigs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{gigs.length}</p>
              </div>
              <Briefcase className="w-12 h-12 text-indigo-500 opacity-80" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Open Positions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {gigs.filter(g => g.status === 'open').length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Budget</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ${gigs.length > 0 ? Math.round(gigs.reduce((acc, g) => acc + g.budget, 0) / gigs.length) : 0}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading amazing gigs...</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Gigs Found</h3>
            <p className="text-gray-500 text-lg mb-6">Be the first to post an opportunity!</p>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
              Post a Gig
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Gigs'}
              </h2>
              <p className="text-gray-500">{gigs.length} {gigs.length === 1 ? 'gig' : 'gigs'} available</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig, index) => (
                <Link
                  key={gig._id}
                  to={`/gig/${gig._id}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          gig.status === 'open'
                            ? 'bg-green-100 text-green-700 ring-2 ring-green-200'
                            : 'bg-gray-100 text-gray-700 ring-2 ring-gray-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          gig.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                        }`}></span>
                        {gig.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {gig.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {gig.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-indigo-600" />
                        <span className="text-2xl font-bold text-indigo-600">
                          {gig.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {gig.ownerId?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;