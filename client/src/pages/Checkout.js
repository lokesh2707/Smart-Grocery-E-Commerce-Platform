import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Fetch Cart
  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);

      if (res.data.items.length === 0) {
        toast.info("Your cart is empty");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error loading cart", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch Address
  const fetchAddress = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data.user.address) {
        setAddress(res.data.user.address);
      }
    } catch (error) {
      console.error("Error loading address");
    }
  }, []);

  // Run on page load
  useEffect(() => {
    fetchCart();
    fetchAddress();
  }, [fetchCart, fetchAddress]);

  // Place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        paymentMethod: "cash_on_delivery",
      };

      const res = await api.post("/orders", orderData);

      await api.delete("/cart/clear");
      toast.success("Order placed!");

      setTimeout(() => navigate(`/orders/${res.data._id}`), 1000);
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="checkout-loading">Loading...</div>;

  const tax = cart.total * 0.05;
  const total = cart.total + tax;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-form-container">

        {/* Shipping Address Card */}
        <div className="checkout-card">
          <div className="card-header">
            <span className="card-icon">📦</span>
            <h2>Shipping Address</h2>
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Payment Card */}
        <div className="checkout-card">
          <div className="card-header">
            <span className="card-icon">💳</span>
            <h2>Payment Method</h2>
          </div>

          <div className="payment-option active">
            <input type="radio" name="payment" defaultChecked />
            <label>Cash on Delivery</label>
          </div>
        </div>

        {/* Place Order Button */}
        <button type="submit" className="place-order-btn" disabled={processing}>
          {processing ? "Processing..." : `Place Order • ₹${total.toFixed(2)}`}
        </button>
      </form>

      {/* Sticky Summary */}
      <div className="checkout-summary-bar">
        <p className="summary-title">Total</p>
        <p className="summary-value">₹{total.toFixed(2)}</p>

        <button
          className="summary-checkout-btn"
          onClick={handlePlaceOrder}
          disabled={processing}
        >
          {processing ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;