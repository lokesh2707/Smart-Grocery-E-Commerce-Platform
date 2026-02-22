import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    description: '',
    price: '',
    stock: '',
    image: '',
    variants: []
  });
  const [variantInput, setVariantInput] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=1000');
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addVariant = () => {
    if (variantInput.name && variantInput.price) {
      setFormData({
        ...formData,
        variants: [...formData.variants, {
          name: variantInput.name,
          price: parseFloat(variantInput.price),
          stock: parseInt(variantInput.stock) || 0
        }]
      });
      setVariantInput({ name: '', price: '', stock: '' });
    }
  };

  const removeVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        toast.success('Product updated!');
      } else {
        await api.post('/products', formData);
        toast.success('Product added!');
      }
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Vegetables',
      description: '',
      price: '',
      stock: '',
      image: '',
      variants: []
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      variants: product.variants || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted!');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const res = await api.post('/upload/image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ ...formData, image: res.data.imageUrl });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <div className="admin-actions">
          <button onClick={() => { setShowForm(true); resetForm(); setEditingProduct(null); }} className="btn-primary">
            Add New Product
          </button>
          <button onClick={async () => {
            if (!window.confirm('Import products from server/data/products.json? This will replace existing products.')) return;
            try {
              toast.info('Importing products...');
              const res = await api.post('/admin/import-products', { replace: true });
              toast.success(res.data.message || 'Import complete');
              fetchProducts();
            } catch (error) {
              console.error('Import failed', error);
              toast.error(error.response?.data?.message || 'Import failed');
            }
          }} className="btn-secondary">
            Import Products
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Spices">Spices</option>
                  <option value="Oils">Oils</option>
                  <option value="Dry Fruits">Dry Fruits</option>
                  <option value="Basics">Basics</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'block', marginBottom: '0.5rem' }}
                    />
                    <small style={{ color: '#666' }}>Max file size: 5MB (jpg, png, gif, webp)</small>
                    {uploading && <p style={{ color: '#0066cc', marginTop: '0.5rem' }}>Uploading...</p>}
                  </div>
                  {formData.image && (
                    <div style={{ width: '120px' }}>
                      <img 
                        src={formData.image} 
                        alt="preview" 
                        style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: '100px' }}
                      />
                      <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>Image uploaded</small>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="variants-section">
                <h3>Variants</h3>
                <div className="variant-input">
                  <input
                    type="text"
                    placeholder="Variant name (e.g., 1kg)"
                    value={variantInput.name}
                    onChange={(e) => setVariantInput({ ...variantInput, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    value={variantInput.price}
                    onChange={(e) => setVariantInput({ ...variantInput, price: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    min="0"
                    value={variantInput.stock}
                    onChange={(e) => setVariantInput({ ...variantInput, stock: e.target.value })}
                  />
                  <button type="button" onClick={addVariant}>Add Variant</button>
                </div>
                <div className="variants-list">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="variant-item">
                      <span>{variant.name} - ₹{variant.price} (Stock: {variant.stock})</span>
                      <button type="button" onClick={() => removeVariant(index)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Variants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.variants?.length || 0}</td>
                <td>
                  <button onClick={() => handleEdit(product)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
