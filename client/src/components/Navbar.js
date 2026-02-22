import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.svg" alt="Smart Grocery" className="navbar-logo-img" />
          Smart Grocery
        </Link>
        
        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">Products</Link>
          
          {user ? (
            <>
              {user.role !== 'admin' && <Link to="/cart" className="navbar-link">Cart</Link>}
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard" className="navbar-link">Admin</Link>
              ) : null}
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
