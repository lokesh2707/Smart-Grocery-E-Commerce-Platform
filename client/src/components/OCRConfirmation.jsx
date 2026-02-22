import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/OCRConfirmation.css';
import { toast } from 'react-toastify';

const OCRConfirmation = ({ matchData, onConfirm, onCancel }) => {
  const [items, setItems] = useState(matchData.matchedItems || []);
  const [unmatchedItems, setUnmatchedItems] = useState(matchData.unmatchedLines || []);
  const [manualSearch, setManualSearch] = useState({});
  const [showSearchResults, setShowSearchResults] = useState({});

  const handleQuantityChange = (index, newQuantity) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, newQuantity);
    updated[index].total = updated[index].quantity * updated[index].price;
    setItems(updated);
  };

  const handleUseAlternative = (itemIndex, alternative) => {
    const updated = [...items];
    updated[itemIndex].productId = alternative.productId;
    updated[itemIndex].name = alternative.name;
    updated[itemIndex].price = alternative.price;
    updated[itemIndex].confidence = alternative.confidence;
    updated[itemIndex].alternatives = [];
    // Recalculate total with new price and existing quantity
    updated[itemIndex].total = updated[itemIndex].quantity * updated[itemIndex].price;
    setShowSearchResults({ ...showSearchResults, [itemIndex]: false });
    toast.info(`Changed to ${alternative.name}`);
  };

  const handleRemoveItem = (index) => {
    const removed = items[index];
    setItems(items.filter((_, i) => i !== index));
    setUnmatchedItems([...unmatchedItems, {
      text: removed.originalText,
      itemName: removed.itemName,
      quantity: removed.requestedQuantity,
      unit: removed.unit,
      searchResults: []
    }]);
  };

  const handleSkipUnmatched = (index) => {
    setUnmatchedItems(unmatchedItems.filter((_, i) => i !== index));
  };

  const handleManualAdd = async (index, itemName) => {
    if (!itemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    try {
      // Get all products - can be optimized with search endpoint
      const allProducts = await api.get('/products?limit=1000');
      const products = allProducts.data.products || allProducts.data;
      
      // Search for matching product
      const found = products.find(p => 
        p.name.toLowerCase().includes(itemName.toLowerCase())
      );

      if (found) {
        let price = found.price;
        let variantName = 'default';
        
        // Try to match variant if available
        if (found.variants && found.variants.length > 0) {
          price = found.variants[0].price;
          variantName = found.variants[0].name;
        }

        const newItem = {
          productId: found._id,
          name: found.name,
          quantity: unmatchedItems[index].quantity || 1,
          price: price,
          total: (unmatchedItems[index].quantity || 1) * price,
          image: found.image,
          confidence: 1,
          originalText: unmatchedItems[index].text,
          itemName: itemName,
          unit: unmatchedItems[index].unit,
          variant: variantName,
          alternatives: []
        };
        
        setItems([...items, newItem]);
        setUnmatchedItems(unmatchedItems.filter((_, i) => i !== index));
        toast.success(`Added ${found.name}`);
      } else {
        toast.error(`Product "${itemName}" not found in our catalog`);
      }
    } catch (error) {
      toast.error('Error searching for product');
      console.error(error);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return '#10b981'; // Green
    if (confidence >= 0.8) return '#f59e0b'; // Amber
    if (confidence >= 0.7) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleConfirmAll = () => {
    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    onConfirm(items);
  };

  return (
    <div className="ocr-confirmation-overlay">
      <div className="ocr-confirmation-modal">
        <div className="ocr-modal-header">
          <h2>Review OCR Matches</h2>
          <button className="ocr-close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="ocr-modal-body">
          {/* MATCHED ITEMS */}
          {items.length > 0 && (
            <div className="ocr-section">
              <h3>✓ Matched Items ({items.length})</h3>
              <div className="ocr-items-list">
                {items.map((item, idx) => (
                  <div key={`matched-${item.productId}-${idx}`} className="ocr-item-card">
                    <div className="item-header">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="original-text">"{item.originalText}"</p>
                      </div>
                      <div 
                        className="confidence-badge"
                        style={{ 
                          backgroundColor: getConfidenceColor(item.confidence),
                          color: 'white'
                        }}
                      >
                        {(item.confidence * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="item-details">
                      <div className="detail-group">
                        <label>Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value))}
                          className="quantity-input"
                        />
                      </div>
                      <div className="detail-group">
                        <label>Price:</label>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* ALTERNATIVES */}
                    {item.alternatives && item.alternatives.length > 0 && (
                      <div className="alternatives-section">
                        <button
                          className="show-alternatives-btn"
                          onClick={() => setShowSearchResults({ 
                            ...showSearchResults, 
                            [idx]: !showSearchResults[idx] 
                          })}
                        >
                          {showSearchResults[idx] ? '▼' : '▶'} {item.alternatives.length} Alternative{item.alternatives.length > 1 ? 's' : ''}
                        </button>
                        
                        {showSearchResults[idx] && (
                          <div className="alternatives-list">
                            {item.alternatives.map((alt, altIdx) => (
                              <button
                                key={`alt-${alt.productId}-${altIdx}`}
                                className="alternative-item"
                                onClick={() => handleUseAlternative(idx, alt)}
                              >
                                <span className="alt-name">{alt.name}</span>
                                <span className="alt-confidence">
                                  {(alt.confidence * 100).toFixed(0)}%
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="item-actions">
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNMATCHED ITEMS */}
          {unmatchedItems.length > 0 && (
            <div className="ocr-section">
              <h3>❓ Unmatched Items ({unmatchedItems.length})</h3>
              <p className="section-hint">These items weren't automatically matched. You can manually add them or skip them.</p>
              <div className="ocr-items-list">
                {unmatchedItems.map((item, idx) => (
                  <div key={`unmatched-${item.text}-${idx}`} className="ocr-item-card unmatched">
                    <div className="item-header">
                      <div className="item-info">
                        <h4>{item.itemName || item.text}</h4>
                        <p className="original-text">"{item.text}"</p>
                      </div>
                      <span className="unmatched-badge">Not Found</span>
                    </div>

                    {/* SUGGESTIONS FOR UNMATCHED */}
                    {item.searchResults && item.searchResults.length > 0 && (
                      <div className="suggestions-section">
                        <p className="suggestion-hint">Similar products:</p>
                        <div className="suggestions-list">
                          {item.searchResults.map((result, resultIdx) => (
                            <button
                              key={`suggestion-${result.productId}-${resultIdx}`}
                              className="suggestion-item"
                              onClick={async () => {
                                try {
                                  // Fetch product details
                                  const productRes = await api.get(`/products/${result.productId}`);
                                  const product = productRes.data;
                                  
                                  let price = product.price;
                                  let variantName = 'default';
                                  
                                  if (product.variants && product.variants.length > 0) {
                                    price = product.variants[0].price;
                                    variantName = product.variants[0].name;
                                  }

                                  const newItem = {
                                    productId: product._id,
                                    name: product.name,
                                    quantity: item.quantity || 1,
                                    price: price,
                                    total: (item.quantity || 1) * price,
                                    image: product.image,
                                    confidence: result.confidence,
                                    originalText: item.text,
                                    itemName: item.itemName,
                                    unit: item.unit,
                                    variant: variantName,
                                    alternatives: []
                                  };
                                  
                                  setItems([...items, newItem]);
                                  setUnmatchedItems(unmatchedItems.filter((_, i) => i !== idx));
                                  toast.success(`Added ${product.name}`);
                                } catch (error) {
                                  toast.error('Failed to add product');
                                  console.error(error);
                                }
                              }}
                            >
                              <span>{result.name}</span>
                              <span className="suggestion-confidence">
                                {(result.confidence * 100).toFixed(0)}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="manual-add-section">
                      <input
                        type="text"
                        placeholder="Type product name..."
                        value={manualSearch[idx] || ''}
                        onChange={(e) => setManualSearch({ 
                          ...manualSearch, 
                          [idx]: e.target.value 
                        })}
                        className="manual-search-input"
                      />
                      <button
                        className="btn-manual-add"
                        onClick={() => handleManualAdd(idx, manualSearch[idx])}
                      >
                        Add
                      </button>
                    </div>

                    <div className="item-actions">
                      <button
                        className="btn-skip"
                        onClick={() => handleSkipUnmatched(idx)}
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {items.length === 0 && unmatchedItems.length === 0 && (
            <div className="empty-ocr-state">
              <p>No items to display</p>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="ocr-modal-summary">
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total Items:</span>
              <span className="stat-value">{items.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Price:</span>
              <span className="stat-value-price">₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="ocr-modal-footer">
          <button
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirmAll}
            disabled={items.length === 0}
          >
            Add {items.length} Item{items.length !== 1 ? 's' : ''} to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OCRConfirmation;
