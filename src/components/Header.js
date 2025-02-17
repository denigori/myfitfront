import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaHamburger, 
  FaBars, 
  FaTimes,
  FaDumbbell  // Icon for Exercise
} from 'react-icons/fa';
import styles from './Header.module.css'; 

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Close the menu after navigating (optional behavior)
  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  if (!isAuthenticated) return null;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        
        {/* Logo (can use an <img> or just styled text) */}
        <div className={styles.logo} onClick={() => handleNavClick('/')}>
          {/* <img src="/path/to/logo.png" alt="MyFit Logo" /> */}
          <h1>MyFit</h1>
        </div>

        {/* Mobile Menu Icon */}
        <button 
          className={styles.menuToggle} 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation (responsive) */}
        <nav className={`${styles.nav} ${menuOpen ? styles.showNav : ''}`}>
          <ul className={styles.navList}>
            
            {/* Diet */}
            <li>
              <a 
                href="#diet" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/diet');
                }}
              >
                <FaHamburger className={styles.icon} /> 
                <span>Diet</span>
              </a>
            </li>

            {/* Exercise (NEW) */}
            <li>
              <a 
                href="#exercise" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/exercise');
                }}
              >
                <FaDumbbell className={styles.icon} /> 
                <span>Exercise</span>
              </a>
            </li>

            {/* Profile */}
            <li>
              <a 
                href="#profile" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/profile');
                }}
              >
                <FaUserCircle className={styles.icon} /> 
                <span>Profile</span>
              </a>
            </li>
          </ul>

          {/* Logout (on the right) */}
          <div className={styles.logout}>
            <a 
              href="#logout" 
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <FaSignOutAlt className={styles.icon} />
              <span>Logout</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
