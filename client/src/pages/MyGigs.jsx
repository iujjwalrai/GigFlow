import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs } from '../store/slices/gigSlice';

import { Briefcase, PlusCircle, DollarSign } from 'lucide-react';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myGigs, loading } = useSelector((state) => state.gigs);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyGigs());
    }
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-14 text-center text-gray-500 animate-fadeIn">
        Loading your gigs...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          <Briefcase className="w-9 h-9 text-indigo-600" />
          My Gigs
        </h1>

        <Link
          to="/create-gig"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          Post New Gig
        </Link>
      </div>

      {/* When No Gigs */}
      {!loading && myGigs.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xl shadow-md border border-gray-200 rounded-2xl">
          <p className="text-gray-600 text-lg mb-4">You haven't posted any gigs yet.</p>
          <Link
            to="/create-gig"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-lg hover:text-indigo-800 transition"
          >
            Post your first gig →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {myGigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gig/${gig._id}`}
              className="group bg-white/80 backdrop-blur-xl border border-gray-200 shadow-md rounded-2xl p-6 hover:-translate-y-1 hover:shadow-2xl transition transform"
            >
              
              {/* Gig Title */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
                {gig.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 line-clamp-3 mb-4">
                {gig.description}
              </p>

              {/* Footer: Price + Status */}
              <div className="flex justify-between items-center">
                
                {/* Budget */}
                <span className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                  <DollarSign className="w-5 h-5" />
                  {gig.budget}
                </span>

                {/* Status */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    gig.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {gig.status.toUpperCase()}
                </span>
              </div>

            </Link>
          ))}

        </div>
      )}
    </div>
  );
};

export default MyGigs;
