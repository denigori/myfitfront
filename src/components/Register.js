// File: src/components/Register.js

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { register } from '../services/api';
import styles from './Register.module.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Track registration status
  const [isRegistered, setIsRegistered] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password });
      setIsRegistered(true);
      setSuccessMessage('Registration successful! You can now log in.');
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        {/* Show form only if not registered */}
        {!isRegistered && (
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <h2 className={styles.registerTitle}>Create Your Account</h2>
            <p className={styles.registerSubtitle}>
              Join us and start your fitness journey today!
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className={styles.inputField}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className={styles.inputField}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.registerButton}
              disabled={isRegistered}
            >
              Register
            </button>
          </form>
        )}

        {/* If isRegistered is true, show the success message */}
        {isRegistered && (
          <div className={styles.successMessage}>
            <h2 className={styles.successTitle}>✅ {successMessage}</h2>
            <p className={styles.successSubtitle}>
              We’ve registered your account. Go ahead and log in when you’re ready!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
