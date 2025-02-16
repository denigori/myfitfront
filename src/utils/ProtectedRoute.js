import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { fetchUserPreferences } from '../services/api'; // your API call
import Spinner from '../components/Spinner'; // optional loading spinner

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 1) Check if user is authenticated
    if (!token) {
      console.log("🚨 No token found, redirecting to /login");
      navigate('/login', { replace: true });
      return;
    }

    // 2) Fetch user preferences to see if they exist
    fetchUserPreferences(token)
      .then((prefs) => {
        if (!prefs || isPreferencesEmpty(prefs)) {
          // If preferences are empty, redirect to profile
          console.log("🚨 Preferences are empty, redirecting to /profile");
          navigate('/profile', { replace: true });
        } else {
          // Preferences are valid, user can continue
          console.log("✅ Preferences found, granting access");
          setAuthorized(true);
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching user preferences:", error);
        // Optionally redirect or handle error
        navigate('/profile', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate, location]);

  // Helper function to check if preferences are empty
  const isPreferencesEmpty = (prefs) => {
    // Customize your logic:
    return (
      !prefs.weight ||
      !prefs.height ||
      !prefs.age ||
      !prefs.favoriteFoods ||
      // etc...
      !prefs.dislikedFoods
    );
  };

  // While loading user prefs, show a spinner or null
  if (loading) {
    return <Spinner />; // or return null if you prefer
  }

  // If user has preferences, allow access
  return authorized ? children : null;
};

export default ProtectedRoute;
