import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import './Admin.css';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', {
        params: {
          page,
          limit: 20,
          search: search || undefined
        }
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their orders.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Error deleting user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const viewUserProfile = async (userId) => {
    try {
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Error fetching user profile');
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>User Management</h1>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search users by name, email, or phone..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      ) : (
        <>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="btn-view"
                        onClick={() => viewUserProfile(user._id)}
                        title="View Profile"
                      >
                        View
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user._id)}
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages} (Total: {total} users)
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* User Profile Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Profile</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="profile-info">
                <div className="info-item">
                  <label>Name:</label>
                  <p>{selectedUser.name}</p>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone:</label>
                  <p>{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Address:</label>
                  <p>{selectedUser.address || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>City:</label>
                  <p>{selectedUser.city || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Postal Code:</label>
                  <p>{selectedUser.postalCode || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Registered:</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-delete"
                onClick={() => {
                  handleDelete(selectedUser._id);
                  setShowModal(false);
                }}
              >
                Delete User
              </button>
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
