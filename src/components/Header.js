import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaHamburger } from 'react-icons/fa';
import styles from './Header.module.css';  // Importing CSS Module

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  const profile = () => {
    navigate('/profile');
  };

  const diet = () => {
    navigate('/diet');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    isAuthenticated && (
      <header className={styles.header}>
        <div className={styles['header-content']}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => navigate('/')}>
            <h1>FoodieApp</h1>
          </div>

          {/* Centered Navigation Menu */}
          <nav className={styles['nav-center']}>
            <ul className={styles['nav-list']}>
              <li><button onClick={diet} className={styles['nav-button']}><FaHamburger /> Diet</button></li>
              <li><button onClick={profile} className={styles['nav-button']}><FaUserCircle /> Profile</button></li>
            </ul>
          </nav>

          {/* Logout Button on the Right */}
          <div className={styles['nav-right']}>
            <button onClick={handleLogout} className={styles['nav-button']}><FaSignOutAlt /> Logout</button>
          </div>
        </div>
      </header>
    )
  );
};

export default Header;
