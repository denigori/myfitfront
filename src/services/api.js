import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5001/api';

//const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);


const register = async (userData) => {
    try {
        // Make the POST request to the backend
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        toast.success(response.data.message || 'Registration successful!');
        return response.data;
      } catch (error) {
        // If user already exists, we'll receive a 409 with a specific message
        const errMsg = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(errMsg);
        throw error;
      }
  };
  

const login = async (userData, navigate) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        console.log(response);
        localStorage.setItem('token', response.data.token);
        navigate('/diet');
    } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
    }
};

// ✅ Fetch user profile settings
const fetchSavedUserData = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/settings`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching user settings:', error);
        toast.error('Could not fetch user settings.');
        return null;
    }
};

// ✅ Update user settings (Basic Profile Info)
const updateUserSettings = async (token, userData) => {
    try {
        await axios.post(`${API_URL}/users/settings`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('User settings updated successfully.');
    } catch (error) {
        console.error('Error updating settings:', error);
        toast.error('Error updating user settings.');
    }
};

// ✅ Update user preferences (Diet & Activity Data)
const updateUserPreferences = async (token, preferencesData) => {
    try {
        const response = await axios.post(`${API_URL}/preferences`, preferencesData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Preferences update response:", response.data);
        toast.success('User preferences updated successfully.');
        return response.data;
    } catch (error) {
        console.error("❌ Error updating preferences:", error.response?.data || error.message);
        toast.error('Error updating user preferences.');
    }
};
const fetchUserPreferences = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/preferences`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return null;
    }
};

// ✅ Exercise Endpoints
const generateExercise = (dietData, token) => axios.post(`${API_URL}/exercise/generate`, dietData, {
    headers: { Authorization: `Bearer ${token}` },
});
const getExercise = (token) => axios.get(`${API_URL}/exercise`, {
    headers: { Authorization: `Bearer ${token}` },
});


// ✅ Diet Plan Endpoints
const generateDietPlan = (dietData, token) => axios.post(`${API_URL}/diet/generate`, dietData, {
    headers: { Authorization: `Bearer ${token}` },
});

const getDietPlan = (token) => axios.get(`${API_URL}/diet`, {
    headers: { Authorization: `Bearer ${token}` },
});

const fetchDailyDietPlan = (dietData, token) => axios.post(`${API_URL}/diet/info`, dietData, {
    headers: { Authorization: `Bearer ${token}` },
});

// ✅ Export all functions
export { 
    register, 
    login, 
    fetchSavedUserData, 
    fetchUserPreferences,
    updateUserSettings, 
    updateUserPreferences, // ✅ Now included for preferences updates
    generateExercise,
    getExercise,
    generateDietPlan, 
    getDietPlan, 
    fetchDailyDietPlan 
};
