const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Spices', 'Oils', 'Dry Fruits', 'Basics', 'Dairy', 'Beverages', 'Other'],
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  variants: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  image: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  searchKeywords: [{
    type: String,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Index for text search
productSchema.index({ name: 'text', description: 'text', searchKeywords: 'text' });

module.exports = mongoose.model('Product', productSchema);
