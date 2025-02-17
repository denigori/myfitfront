// File: src/components/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css'; // Import your plain CSS file

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // (Optional) Close the menu when clicking a link
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={handleLinkClick}>
            MyFit
          </Link>
        </div>

        {/* Hamburger toggle (hidden on desktop) */}
        <button
          className="menu-toggle"
          onClick={handleToggleMenu}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? 'show-nav' : ''}`}>
          <ul className="nav-list">
            <li>
              <Link to="/register" onClick={handleLinkClick}>
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={handleLinkClick}>
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
