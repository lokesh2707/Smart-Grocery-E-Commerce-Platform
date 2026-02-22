const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/upload/image
// @desc    Upload image to Cloudinary
// @access  Private Admin
router.post('/image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'smartgrocery/products',
      resource_type: 'auto',
    });

    // Delete local file after successful upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    // Clean up uploaded file if upload fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Image upload failed',
      error: error.message 
    });
  }
});

module.exports = router;
