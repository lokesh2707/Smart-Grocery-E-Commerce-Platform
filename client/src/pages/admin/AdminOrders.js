import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // ------------------------------------
  // FIX 1: Memoize fetchOrders
  // ------------------------------------
  const fetchOrders = useCallback(async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await api.get('/admin/orders', { params });
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // ------------------------------------
  // FIX 2: Clean useEffect dependency
  // ------------------------------------
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id.slice(-8).toUpperCase()}</td>

                  <td>
                    <div>
                      <strong>{order.user?.name || 'N/A'}</strong>
                      <br />
                      <small>{order.user?.email || ''}</small>
                    </div>
                  </td>

                  <td>
                    <div className="order-items-preview">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div>+{order.items.length - 2} more</div>
                      )}
                    </div>
                  </td>

                  <td>₹{order.total.toFixed(2)}</td>

                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;