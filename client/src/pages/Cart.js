import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch cart
  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add OCR items
  const addOCRItemsToCart = useCallback(
    async (items) => {
      try {
        for (const item of items) {
          await api.post("/cart/add", {
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
          });
        }
        toast.success(`Added ${items.length} items from your list.`);
        fetchCart();
      } catch (error) {
        toast.error("Failed to add OCR items");
      }
    },
    [fetchCart]
  );

  // On mount
  useEffect(() => {
    if (user) {
      fetchCart();

      const ocrItems = localStorage.getItem("ocrMatchedItems");
      if (ocrItems) {
        addOCRItemsToCart(JSON.parse(ocrItems));
        localStorage.removeItem("ocrMatchedItems");
      }
    }
  }, [user, fetchCart, addOCRItemsToCart]);

  // Update qty
  const updateQuantity = async (productId, variant, newQty) => {
    if (newQty < 1) return;

    try {
      await api.put("/cart/update", {
        productId,
        variant,
        quantity: newQty,
      });
      fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // Remove item
  const removeItem = async (productId, variant) => {
    try {
      await api.delete(`/cart/remove/${productId}?variant=${variant}`);
      fetchCart();
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  if (!user) {
    return (
      <div className="cart-empty-container">
        <h2>Please login to view your cart</h2>
        <button onClick={() => navigate("/login")} className="cart-btn-primary">
          Login
        </button>
      </div>
    );
  }

  if (loading) return <div className="cart-loading">Loading...</div>;

  return (
    <div className="cart-page">

      <h1>Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="cart-empty-container">
          <h2>Your cart is empty</h2>
          <button
            onClick={() => navigate("/products")}
            className="cart-btn-primary"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cart.items.map((item, index) => (
              <div key={index} className="cart-item-card">
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="cart-placeholder">🛒</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  {item.variant && item.variant !== "default" && (
                    <p className="cart-variant">Variant: {item.variant}</p>
                  )}

                  <p className="cart-price">₹{item.price.toFixed(2)}</p>

                  <div className="cart-qty-controls">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variant, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variant, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-total">
                    ₹{item.total.toFixed(2)}
                  </p>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItem(item.productId, item.variant)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom summary */}
          <div className="cart-summary-bar">
            <div>
              <p className="summary-total-label">Total</p>
              <p className="summary-total-value">
                ₹{(cart.total * 1.05).toFixed(2)}
              </p>
            </div>

            <button
              className="summary-checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;