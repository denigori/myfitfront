import axios from 'axios';
import ProfilePage from '../components/Profile';

const API_URL = 'http://localhost:5001/api';

// ✅ Fetch user profile settings
export const fetchUserProfile = (token) => async (dispatch) => {
  dispatch({ type: 'FETCH_PROFILE_REQUEST' });

  try {
    const response = await axios.get(`${API_URL}/users/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: 'FETCH_PROFILE_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_PROFILE_FAILURE', payload: error.message });
  }
};

// ✅ Update user profile settings (Basic User Info)
export const updateUserProfile = (userData, token) => async (dispatch) => {
  dispatch({ type: 'UPDATE_PROFILE_REQUEST' });

  try {
    await axios.post(`${API_URL}/users/settings`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: userData });
  } catch (error) {
    dispatch({ type: 'UPDATE_PROFILE_FAILURE', payload: error.message });
  }
};

// ✅ Update user preferences (Diet & Workout Preferences)
export const updateUserPreferences = (preferencesData, token) => async (dispatch) => {
  dispatch({ type: 'UPDATE_PREFERENCES_REQUEST' });

  try {
    await axios.post(`${API_URL}/preferences`, preferencesData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: 'UPDATE_PREFERENCES_SUCCESS', payload: preferencesData });
  } catch (error) {
    dispatch({ type: 'UPDATE_PREFERENCES_FAILURE', payload: error.message });
  }
};

export default ProfilePage;
