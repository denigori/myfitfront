import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Register.module.css';

import { register } from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State to track whether registration is successful
  const [isRegistered, setIsRegistered] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the register API
      await register({ username, password });

      // On success, show a message and mark the user as registered
      setIsRegistered(true);
      setSuccessMessage('Registration successful! You can now log in.');
      
      // (Optional) You can also use react-toastify for a toast message
      toast.success('Registration successful!');
    } catch (error) {
      // Handle error (already possibly in your api.js, but you can also do extra logic here)
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        
        {/* Only show the form if NOT registered */}
        {!isRegistered && (
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <h2>Create Your Account</h2>
            <p>Join us and start your fitness journey today!</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className={styles.inputField}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={styles.inputField}
            />
            {/* Disable the button if we've successfully registered to prevent extra clicks */}
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
            <h2>✅ {successMessage}</h2>
            <p>
              We’ve registered your account. Go ahead and log in when you’re ready!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
