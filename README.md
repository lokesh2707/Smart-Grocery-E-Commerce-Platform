# 🛒 Smart Grocery E-Commerce Platform

A full-stack grocery e-commerce platform with AI-powered shopping list upload using OCR and fuzzy matching.

## ✨ Features

### User Features
- 🔐 User Authentication (Register/Login)
- 🛍️ Browse Products by Category
- 🔍 Search & Filter Products
- 🛒 Shopping Cart Management
- 📸 **AI Shopping List Upload** - Upload handwritten/printed lists, OCR extracts items, fuzzy matching adds to cart
- 💳 Checkout & Order Placement
- 📄 Auto PDF Receipt Generation
- 📋 Order History

### Admin Features
- 🔐 Admin Authentication
- ➕ Add/Edit/Delete Products
- 🏷️ Product Variants Management (1kg, 500g, etc.)
- 📊 Dashboard Analytics
- 📦 Order Management
- 📈 View Sales & Revenue

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose
- **JWT** Authentication
- **Tesseract.js** for OCR
- **Fuse.js** for Fuzzy Matching
- **PDFKit** for Receipt Generation
- **Multer** for File Uploads

### Frontend
- **React.js**
- **React Router** for Navigation
- **Axios** for API Calls
- **React Toastify** for Notifications
- **CSS3** for Styling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd SmartAI
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-grocery
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Run the Application

#### Option A: Run Both Server & Client Together

From the root directory:

```bash
npm run dev
```

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 Usage Guide

### Creating an Admin Account

1. Register a new user through `/register`
2. In MongoDB, update the user's role to `admin`:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```
3. Login at `/admin/login`

### Adding Products (Admin)

1. Login as admin
2. Go to `/admin/products`
3. Click "Add New Product"
4. Fill in product details:
   - Name, Category, Description
   - Price, Stock
   - Image URL
   - Variants (optional): e.g., "1kg", "500g"
5. Save product

### Using AI Shopping List Upload

1. Login as a user
2. Go to homepage (`/`)
3. Click "Choose Image File" in the OCR section
4. Upload an image of your handwritten shopping list
5. Click "Process & Add to Cart"
6. System will:
   - Extract text using OCR
   - Match items with products using fuzzy matching
   - Automatically add matched items to cart
7. Review cart and proceed to checkout

### Placing an Order

1. Add items to cart (manually or via OCR)
2. Go to `/cart`
3. Review items and quantities
4. Click "Proceed to Checkout"
5. Enter shipping address
6. Click "Place Order"
7. PDF receipt will auto-download

## 📁 Project Structure

```
SmartAI/
├── server/
│   ├── models/          # MongoDB models (User, Product, Order)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # PDF generator, helpers
│   ├── index.js         # Server entry point
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── utils/       # API utilities
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/:id/receipt` - Download PDF receipt

### OCR
- `POST /api/ocr/upload` - Upload image for OCR
- `POST /api/ocr/match` - Match OCR text with products

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status

## 🧪 Testing OCR Feature

1. Create a handwritten shopping list with items like:
   - "Potato 2kg"
   - "Rice 5kg"
   - "Oil 1L"
   - "Tomato 1kg"
2. Take a photo or scan the list
3. Upload via the homepage OCR section
4. System will match items with products in database

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Update `MONGODB_URI` to MongoDB Atlas connection string
3. Deploy server folder

### Frontend Deployment (Vercel/Netlify)

1. Build the React app: `cd client && npm run build`
2. Deploy the `build` folder
3. Set `REACT_APP_API_URL` environment variable

## 📝 Notes

- Cart is stored in-memory (use Redis for production)
- OCR works best with clear, handwritten text
- Fuzzy matching threshold can be adjusted in `server/routes/ocr.js`
- PDF receipts are generated on-demand

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License

## 🎉 Enjoy Building!

This is a complete, production-ready e-commerce platform. Customize it to your needs!
