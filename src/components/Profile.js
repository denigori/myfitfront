import React, { useState, useEffect } from 'react';
import { fetchUserPreferences, updateUserPreferences } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css'; // Ensure correct path

function ProfilePage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    favoriteFoods: '',
    dislikedFoods: '',
    typeOfWorkout: '',
    days: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in.');
      return;
    }

    setLoading(true);

    fetchUserPreferences(token)
      .then((data) => {
        if (data) {
          // Spread existing state then overwrite with fetched data
          setFormData((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        setMessage('Could not fetch user preferences.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in.');
      return;
    }

    setLoading(true);
    try {
      await updateUserPreferences(token, formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileTitle}>Profile Settings</h2>

      {loading && <p className={styles.loadingText}>Loading...</p>}
      {message && <p className={styles.messageText}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        {/* Weight */}
        <div className={styles.formGroup}>
          <label htmlFor="weight">Weight (kg):</label>
          <input
            id="weight"
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g. 70"
          />
        </div>

        {/* Height */}
        <div className={styles.formGroup}>
          <label htmlFor="height">Height (cm):</label>
          <input
            id="height"
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="e.g. 170"
          />
        </div>

        {/* Age */}
        <div className={styles.formGroup}>
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 30"
          />
        </div>

        {/* Gender */}
        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>

        {/* Favorite Foods */}
        <div className={styles.formGroup}>
          <label htmlFor="favoriteFoods">Favorite Foods:</label>
          <input
            id="favoriteFoods"
            type="text"
            name="favoriteFoods"
            value={formData.favoriteFoods}
            onChange={handleChange}
            placeholder="e.g. Chicken, Broccoli"
          />
        </div>

        {/* Disliked Foods */}
        <div className={styles.formGroup}>
          <label htmlFor="dislikedFoods">Disliked Foods:</label>
          <input
            id="dislikedFoods"
            type="text"
            name="dislikedFoods"
            value={formData.dislikedFoods}
            onChange={handleChange}
            placeholder="e.g. Fish, Peanuts"
          />
        </div>

        {/* Type of Workout */}
        <div className={styles.formGroup}>
          <label htmlFor="typeOfWorkout">Type of Workout:</label>
          <input
            id="typeOfWorkout"
            type="text"
            name="typeOfWorkout"
            value={formData.typeOfWorkout}
            onChange={handleChange}
            placeholder="e.g. Cardio, Weightlifting"
          />
        </div>

        {/* Days (per week) */}
        <div className={styles.formGroup}>
          <label htmlFor="days">Days per Week:</label>
          <input
            id="days"
            type="number"
            name="days"
            value={formData.days}
            onChange={handleChange}
            placeholder="e.g. 3"
          />
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
