# Smart Grocery Platform - Deployment Guide

## 🚀 Step 1: Prepare Your GitHub Repository

### 1.1 Initialize Git (if not already done)
```bash
cd SmartAI
git init
git add .
git commit -m "Initial commit: Smart Grocery Platform"
```

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **New Repository**
3. Name it: `smart-grocery` (or your preference)
4. Click **Create Repository**

### 1.3 Push Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-grocery.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend on Render.com

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### 2.2 Create a New Web Service
1. Click **New +** → **Web Service**
2. Select your GitHub repository (`smart-grocery`)
3. Connect Render to GitHub

### 2.3 Configure the Web Service
**Basic Settings:**
- **Name:** smartgrocery-api
- **Environment:** Node
- **Region:** Choose closest to you
- **Plan:** Free (or Starter for better reliability)

**Build Settings:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** `server`

### 2.4 Add Environment Variables
Click **Environment** and add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `5000` | (Optional, Render assigns port) |
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/smart-grocery` | Get from MongoDB Atlas |
| `JWT_SECRET` | `your-secure-key-here-change-this` | Generate a strong random key |
| `JWT_EXPIRE` | `7d` | |
| `CLOUD_NAME` | `dymblm25l` | Your Cloudinary cloud name |
| `CLOUD_API_KEY` | `272257295885546` | Your Cloudinary API key |
| `CLOUD_API_SECRET` | `-RKsNSab5xT6dcYiB5TyagZHJlE` | Your Cloudinary API secret |

### 2.5 Deploy
Click **Create Web Service** and wait for deployment to complete.

**Your backend URL will be something like:**
```
https://smartgrocery-api.onrender.com
```

⚠️ **Note the full URL** - you'll need it for the frontend!

### 2.6 Get MongoDB Atlas Connection String
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier available)
3. Create a cluster
4. Click **Connect**
5. Copy connection string
6. Update `MONGODB_URI` in Render environment variables

---

## 🌐 Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### 3.2 Import Project
1. Click **Add New +** → **Project**
2. Select your GitHub repository (`smart-grocery`)
3. Click **Import**

### 3.3 Configure Project
**Project Settings:**
- **Framework Preset:** Create React App (auto-detected)
- **Root Directory:** `client`

### 3.4 Add Environment Variables
Click **Environment Variables** and add:

| Key | Value | Example |
|-----|-------|---------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` | `https://smartgrocery-api.onrender.com/api` |

**Important:** Use your actual Render backend URL from Step 2.5

### 3.5 Deploy
Click **Deploy** and wait for the build to complete.

**Your frontend URL will be:**
```
https://smart-grocery.vercel.app
```

---

## ✅ Step 4: Testing & Verification

### 4.1 Test Backend
```bash
curl https://your-backend-url.onrender.com/api/products
```

Should return JSON with products.

### 4.2 Test Frontend
1. Open `https://your-frontend-url.vercel.app`
2. Try these actions:
   - View products ✓
   - Sign up & login ✓
   - Add to cart ✓
   - Admin login ✓

### 4.3 Debugging
If something doesn't work:

**Backend Issues:**
- View logs on Render dashboard
- Check environment variables are set correctly
- Verify MongoDB connection string

**Frontend Issues:**
- Check browser Network tab for API calls
- Verify `REACT_APP_API_URL` points to correct backend
- Check Vercel deployment logs

---

## 🔄 Step 5: Continuous Deployment

Both Render and Vercel automatically redeploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Fix something"
git push origin main

# Your apps will redeploy automatically!
```

---

## 📝 Environment Variables Summary

### Backend (.env on Render)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smart-grocery
JWT_SECRET=your-secret-key-minimum-32-characters-recommended
PORT=5000
NODE_ENV=production
CLOUD_NAME=dymblm25l
CLOUD_API_KEY=272257295885546
CLOUD_API_SECRET=-RKsNSab5xT6dcYiB5TyagZHJlE
```

### Frontend (.env.local on Vercel)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 🛠️ Troubleshooting

### "Cannot connect to backend"
- ✓ Check REACT_APP_API_URL in Vercel
- ✓ Check backend is running on Render
- ✓ Check CORS is enabled (it is by default)

### "MongoDB connection failed"
- ✓ Check MONGODB_URI is correct
- ✓ Whitelist Render IP in MongoDB Atlas:
  1. Go to MongoDB Atlas
  2. Network Access
  3. Add IP Address: `0.0.0.0/0` (allows all)

### "Uploads not working"
- ✓ Check Cloudinary credentials are correct
- ✓ Check `CLOUD_API_SECRET` (not `CLOUD_API_KEY`)

### "Images not loading"
- ✓ Check image URLs in database
- ✓ Verify Cloudinary URLs are public

---

## 🎯 Final Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on both platforms
- [ ] MongoDB connection working
- [ ] Cloudinary images working
- [ ] API calls working between frontend & backend
- [ ] User authentication working
- [ ] Admin panel accessible
- [ ] Products & orders displaying correctly

---

## 🔐 Security Tips

1. **Change JWT_SECRET** - Use a long random string
2. **MongoDB Security** - Don't hardcode credentials
3. **Cloudinary Keys** - These are semi-public (API keys), keep API secret safe
4. **HTTPS** - Both Render and Vercel provide free HTTPS
5. **CORS** - Currently allows localhost, update if needed

---

## 📚 Useful Links

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

**Your app is now live! 🎉**
