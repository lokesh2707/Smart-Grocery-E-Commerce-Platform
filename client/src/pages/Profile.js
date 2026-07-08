import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty-card">
          <h2>Please login to view your profile</h2>
          <p>Track bookings, manage your details, and keep your orders close at hand.</p>
          <Link to="/login" className="profile-action-btn primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="meta">
          <span className="section-pill">Your account</span>
          <h1>Welcome back, {user.name || 'there'}.</h1>
          <p>Everything about your shopping journey is available here, including order history, account details, and quick actions.</p>
        </div>

        <div className="profile-highlight">
          <strong>Member since</strong>
          <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="profile-main">
        <section className="profile-details">
          <h2>Account details</h2>
          <div className="profile-grid">
            <div className="profile-card">
              <strong>Name</strong>
              <p>{user.name}</p>
            </div>
            <div className="profile-card">
              <strong>Email</strong>
              <p>{user.email}</p>
            </div>
            <div className="profile-card">
              <strong>Phone</strong>
              <p>{user.phone || 'Not provided'}</p>
            </div>
            <div className="profile-card">
              <strong>Role</strong>
              <p>{user.role || 'Customer'}</p>
            </div>
          </div>
        </section>

        <aside className="profile-actions-card">
          <h2>Quick actions</h2>
          <Link to="/orders" className="profile-action-btn primary">
            View booking history
          </Link>
          <Link to="/cart" className="profile-action-btn secondary">
            Open cart
          </Link>
          <Link to="/products" className="profile-action-btn secondary">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
