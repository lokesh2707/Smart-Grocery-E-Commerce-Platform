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
          <span className="navbar-brand-mark">S</span>
          <span className="navbar-brand-copy">
            <strong>SmartCart</strong>
            <small>AI Grocery</small>
          </span>
        </Link>

        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">Products</Link>

          {user ? (
            <>
              {user.role !== 'admin' && <Link to="/cart" className="navbar-link">Cart</Link>}
              {user.role !== 'admin' && <Link to="/orders" className="navbar-link">Orders</Link>}
              {user.role !== 'admin' && <Link to="/profile" className="navbar-link">Profile</Link>}
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
