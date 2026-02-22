const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ocr', require('./routes/ocr'));
app.use('/api/upload', require('./routes/upload'));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-grocery', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ MongoDB Connected');

    // Ensure default admin exists
    try {
      const User = require('./models/User');
      const adminEmail = 'admin@gmail.com';
      const adminPassword = 'admin1234';

      let adminUser = await User.findOne({ email: adminEmail });

      if (!adminUser) {
        adminUser = await User.create({
          name: 'Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        });
        console.log('👑 Default admin user created:', adminEmail);
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('👑 Existing user promoted to admin:', adminEmail);
      } else {
        console.log('👑 Admin user already exists:', adminEmail);
      }
    } catch (err) {
      console.error('⚠️ Failed to ensure default admin user:', err.message);
    }
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
