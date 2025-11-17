import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - KIEMELT DIZÁJN: "It!" szó külön színnel */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-main">Reserve</span>
          <span className="logo-accent">It!</span>
        </Link>

        {/* Mobile menü toggle gomb */}
        <button className="navbar-toggle" onClick={toggleMobileMenu}>
          ☰
        </button>

        {/* Navigation menu */}
        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
              Companies
            </Link>
          </li>

          {!user ? (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link" onClick={closeMobileMenu}>
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register/user" className="navbar-btn navbar-btn-outline" onClick={closeMobileMenu}>
                  Sign Up (User)
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register/company" className="navbar-btn" onClick={closeMobileMenu}>
                  Register Company
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link 
                  to={user.role === 'company' ? '/dashboard/company' : '/dashboard/user'} 
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item navbar-user">
                <span className="navbar-user-name">{user.name}</span>
                <span className="navbar-user-role">
                  {user.role === 'company' ? 'Company' : 'User'}
                </span>
              </li>
              <li className="navbar-item">
                <button className="navbar-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
