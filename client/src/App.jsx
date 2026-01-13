import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import { fetchMyBids } from './store/slices/bidSlice';
import { initSocket, disconnectSocket } from './utils/socket';
import { addNotification } from './store/slices/notificationSlice';

import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import BrowseGigs from './pages/BrowseGigs';
import CreateGig from './pages/CreateGig';
import GigDetail from './pages/GigDetail';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on mount
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // Initialize socket connection when user is authenticated
    if (isAuthenticated && user) {
      const socket = initSocket(user.id || user._id);
      
      // Listen for hire notifications
      socket.on('hired', (data) => {
        dispatch(addNotification({
          type: 'success',
          message: data.message,
          title: 'You\'ve been hired!'
        }));
        // Refresh my bids if user is on My Bids page
        const currentPath = window.location.pathname;
        if (currentPath === '/my-bids') {
          dispatch(fetchMyBids());
        }
      });

      return () => {
        socket.off('hired');
        disconnectSocket();
      };
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <NotificationToast />
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" /> : <Register />
          } />
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<BrowseGigs />} />
          <Route path="/gig/:id" element={<GigDetail />} />
          <Route
            path="/create-gig"
            element={
              <ProtectedRoute>
                <CreateGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-gigs"
            element={
              <ProtectedRoute>
                <MyGigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bids"
            element={
              <ProtectedRoute>
                <MyBids />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
