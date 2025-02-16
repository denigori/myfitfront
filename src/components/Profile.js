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
          setFormData((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        setMessage('Could not fetch user preferences.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in.');
      return;
    }

    setLoading(true);
    await updateUserPreferences(token, formData);
    setLoading(false);
    setMessage('Profile updated successfully!');
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileTitle}>Profile Settings</h2>

      {loading && <p className={styles.loadingText}>Loading...</p>}
      {message && <p className={styles.messageText}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Weight:</label>
          <input type="text" name="weight" value={formData.weight} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Height:</label>
          <input type="text" name="height" value={formData.height} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Age:</label>
          <input type="text" name="age" value={formData.age} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Gender:</label>
          <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Favorite Foods:</label>
          <input type="text" name="favoriteFoods" value={formData.favoriteFoods} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Disliked Foods:</label>
          <input type="text" name="dislikedFoods" value={formData.dislikedFoods} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Type of Workout:</label>
          <input type="text" name="typeOfWorkout" value={formData.typeOfWorkout} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Days:</label>
          <input type="text" name="days" value={formData.days} onChange={handleChange} />
        </div>
        <button type="submit" className={styles.saveButton}>Save Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
