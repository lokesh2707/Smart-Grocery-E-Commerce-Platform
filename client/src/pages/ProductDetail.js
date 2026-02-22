import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);

      if (res.data.variants && res.data.variants.length > 0) {
        setSelectedVariant(res.data.variants[0].name);
      }
    } catch (error) {
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to add items to cart");
      return navigate("/login");
    }

    try {
      await api.post("/cart/add", {
        productId: product._id,
        quantity,
        variant: selectedVariant,
      });

      toast.success("Item added to cart!");
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null;

  const currentPrice =
    selectedVariant && product.variants.length > 0
      ? product.variants.find((v) => v.name === selectedVariant)?.price ||
        product.price
      : product.price;

  return (
    <div className="product-detail-page">
      <div className="product-detail-wrapper">
        <div className="product-image-card">
          {product.image ? (
            <img src={product.image} alt={product.name} className="product-main-img" />
          ) : (
            <div className="placeholder-large">🛒</div>
          )}
        </div>

        <div className="product-info-side">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-category-badge">{product.category}</p>

          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          {product.variants.length > 0 && (
            <div className="variant-section">
              <h3>Select Variant</h3>
              <div className="variant-list">
                {product.variants.map((variant) => (
                  <button
                    key={variant.name}
                    className={`variant-chip ${
                      selectedVariant === variant.name ? "active" : ""
                    }`}
                    onClick={() => setSelectedVariant(variant.name)}
                  >
                    <span className="variant-name">{variant.name}</span>
                    <span className="variant-price">₹{variant.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="price-box">
            <span className="price-main">₹{currentPrice.toFixed(2)}</span>
          </div>

          <div className="quantity-box">
            <label>Quantity</label>
            <div className="qty-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                –
              </button>
              <input
                value={quantity}
                type="number"
                min="1"
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button className="add-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;