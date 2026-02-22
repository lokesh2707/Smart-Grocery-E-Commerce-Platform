import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./Orders.css";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const steps = [
    "pending",
    "processing",
    "packed",
    "out_for_delivery",
    "delivered",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => steps.indexOf(status);

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>Start shopping to view your orders</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const stepIndex = getStepIndex(order.status);

            return (
              <div key={order._id} className="order-card">
                <div className="order-top">
                  <div>
                    <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className={`status-tag status-${order.status}`}>
                    {order.status.replace(/_/g, " ")}
                  </div>
                </div>

                {/* Horizontal STATUS TRACKER */}
                <div className="order-timeline">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className={`timeline-step ${
                        index <= stepIndex ? "active" : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>
                      <p>{step.replace(/_/g, " ")}</p>
                    </div>
                  ))}
                </div>

                {/* ORDER ITEMS */}
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <h3 className="order-total">₹{order.total.toFixed(2)}</h3>

                  <button
                    className="download-btn"
                    onClick={() =>
                      window.open(`/orders/${order._id}/receipt`, "_blank")
                    }
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;