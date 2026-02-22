import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { enrichProductWithImage } from "../utils/imageMapping";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/products/categories/list");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};

      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get("/products", { params });

      const enriched = res.data.products.map((p) => enrichProductWithImage(p));
      setProducts(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  return (
    <div className="products-page">

      {/* HEADER SECTION */}
      <div className="products-header">
        <h1>Shop Groceries</h1>

        <div className="filters-bar">
          <div className="search-box">
            <input
              placeholder="Search for fruits, vegetables, bread..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="icon">🔍</span>
          </div>

          <select
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">No items found</div>
          ) : (
            products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="product-card"
              >
                <div className="product-img">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="placeholder">🛒</div>
                  )}
                </div>

                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>

                  <div className="price">₹{product.price.toFixed(2)}</div>

                  {product.variants && product.variants.length > 0 && (
                    <span className="variant-tag">
                      {product.variants.length} variants
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Products;