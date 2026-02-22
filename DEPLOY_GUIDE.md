# 🌍 Smart Grocery - Complete Deployment Guide (Render + Vercel)

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Continuous Deployment](#continuous-deployment)

---

## Prerequisites

Before you start, you'll need:

### Accounts & Services
1. **GitHub Account** - [github.com](https://github.com)
2. **Render Account** - [render.com](https://render.com) (free)
3. **Vercel Account** - [vercel.com](https://vercel.com) (free)
4. **MongoDB Atlas** - [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (free)
5. **Cloudinary Account** - Already have: `dymblm25l`

### What You Have
✓ Cloudinary Cloud Name: `dymblm25l`
✓ Cloudinary API Key: `272257295885546`  
✓ Cloudinary API Secret: `-RKsNSab5xT6dcYiB5TyagZHJlE`

---

## GitHub Setup

### Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `smart-grocery`
3. Description: `Smart Grocery - AI-powered grocery shopping platform`
4. Choose **Public** (free private repos also available)
5. Click **Create repository**

### Step 2: Push Your Code to GitHub

Open terminal in your project root:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Smart Grocery Platform"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/smart-grocery.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click **Sign up**
3. Choose **Continue with GitHub** (recommended)
4. Authorize Render

### Step 2: Create Web Service
1. On Render dashboard, click **New +**
2. Select **Web Service**
3. Choose your `smart-grocery` repository
4. Click **Connect**

### Step 3: Configure Service

**Settings:**
- **Name:** `smartgrocery-api` (important for URL)
- **Environment:** Node
- **Region:** Choose closest to your location
- **Plan:** Free (Starter recommended for better uptime)

**Build & Start:**
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 4: Add Environment Variables

Click **Environment** tab and add these variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smart-grocery
JWT_SECRET=your-secure-random-key-here-minimum-32-chars
JWT_EXPIRE=7d
CLOUD_NAME=dymblm25l
CLOUD_API_KEY=272257295885546
CLOUD_API_SECRET=-RKsNSab5xT6dcYiB5TyagZHJlE
```

⚠️ **IMPORTANT:** You need to replace:
- `MONGODB_URI` - Get from MongoDB Atlas (Step 5)
- `JWT_SECRET` - Generate a random secure key

### Step 5: Get MongoDB Connection String

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign up**
3. Create free cluster
4. Go to **Clusters** → **Connect**
5. Choose **Connect your application**
6. Copy connection string
7. Replace `<username>`, `<password>`, and database name
8. Paste in Render's `MONGODB_URI`

Example:
```
mongodb+srv://admin:password123@cluster0.mongodb.net/smart-grocery
```

### Step 6: Deploy
1. Click **Create Web Service**
2. Wait for deployment (2-3 minutes)
3. You'll see: ✅ Your service is live!

### Step 7: Get Your Backend URL
On the Render dashboard, you'll see something like:
```
https://smartgrocery-api.onrender.com
```

**Save this URL!** You'll need it for the frontend deployment.

### Step 8: Configure MongoDB Network Access
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** (in left menu)
3. Click **Add IP Address**
4. Choose **Allow access from anywhere** (select `0.0.0.0/0`)
5. Confirm

This allows Render to connect to MongoDB.

### ✅ Backend Deployed!
Test it:
```bash
curl https://smartgrocery-api.onrender.com/api/products
```

Should return JSON with products.

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up**
3. Choose **Continue with GitHub**
4. Authorize Vercel

### Step 2: Import Project
1. On Vercel dashboard, click **Add New** → **Project**
2. Click **Import Git Repository**
3. Find and select `smart-grocery` repository
4. Click **Import**

### Step 3: Configure Project

**Project Settings:**
- **Framework Preset:** React (auto-detected)
- **Root Directory:** `client`
- **Build Command:** `npm run build` (auto)
- **Output Directory:** `build` (auto)

### Step 4: Add Environment Variable

**CRITICAL:** Add this environment variable:

Click **Environment Variables** and add:
```
REACT_APP_API_URL = https://smartgrocery-api.onrender.com/api
```

Replace `smartgrocery-api` with your actual Render service name if different.

### Step 5: Deploy
1. Click **Deploy**
2. Wait for build (2-4 minutes)
3. You'll see: Deployment successful! 🎉

### Step 6: Get Your Frontend URL
On success page, you'll see:
```
https://smart-grocery.vercel.app
```

This is your live website!

### ✅ Frontend Deployed!
Open `https://smart-grocery.vercel.app` and test it.

---

## Testing

### ✅ Test Checklist

#### Backend API
```bash
# Should return products JSON
curl https://smartgrocery-api.onrender.com/api/products
```

#### Frontend Functionality
1. **Homepage** - [ ] Loads without errors
2. **Products** - [ ] Products display with images
3. **Product Detail** - [ ] Click product shows details
4. **Sign Up** - [ ] Create new account works
5. **Login** - [ ] User login works
6. **Admin Login** - [ ] Admin login with admin@gmail.com / admin1234
7. **Add to Cart** - [ ] Can add products to cart
8. **Checkout** - [ ] Checkout process works
9. **Admin Dashboard** - [ ] View dashboard stats
10. **Admin Products** - [ ] Add/edit/delete products
11. **Upload Image** - [ ] Image upload to Cloudinary works
12. **Orders** - [ ] Can view user orders

### Common Test Cases

**Test User Signup:**
```
Email: user@example.com
Password: test123
Name: Test User
Phone: 9876543210
```

**Test Admin:**
```
Email: admin@gmail.com
Password: admin1234
```

---

## Troubleshooting

### ❌ "Cannot Connect to API"
**Cause:** Frontend can't reach backend
**Fix:**
1. Check `REACT_APP_API_URL` in Vercel environment variables
2. Verify backend is running on Render (check logs)
3. Make sure URL is exactly: `https://smartgrocery-api.onrender.com/api`

### ❌ "MongoDB Connection Failed"
**Cause:** Invalid connection string
**Fix:**
1. Verify `MONGODB_URI` on Render
2. Check IP whitelist on MongoDB Atlas (should be 0.0.0.0/0)
3. Make sure username/password are correct in URI

### ❌ "Images Not Loading"
**Cause:** Cloudinary credentials issue
**Fix:**
1. Verify `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` on Render
2. Test upload on admin products page
3. Check image URLs start with `https://res.cloudinary.com/`

### ❌ "Environment Variables Not Working"
**Fix:**
1. Check for typos in variable names
2. Make sure values don't have extra quotes or spaces
3. Redeploy after changing variables:
   - Render: Usually auto-redeploys
   - Vercel: May need manual redeploy (click "Redeploy")

### ❌ "Build Failed on Vercel"
**Fix:**
1. Check build logs in Vercel dashboard
2. Make sure all dependencies are installed locally
3. Test `npm run build` locally first
4. Check for TypeScript/JavaScript errors

### ❌ "Long Initial Load Time"
**Cause:** Render free tier spins down after inactivity
**Fix:** Upgrade to Starter plan (recommended for production)

---

## Continuous Deployment

After deploying, your apps will auto-redeploy when you push to GitHub!

### Make Updates & Redeploy

```bash
# Make changes to your code
# Edit files as needed

# Stage changes
git add .

# Commit
git commit -m "Fix: Detailed description of changes"

# Push to GitHub
git push origin main

# Wait 1-3 minutes for auto-deployment
```

Both Render and Vercel will automatically:
1. Pull your latest code
2. Install dependencies
3. Build your app
4. Deploy the new version
5. Update your live site

---

## Environment Variables Quick Reference

### Backend (Render)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smart-grocery
JWT_SECRET=your-secure-random-key
JWT_EXPIRE=7d
CLOUD_NAME=dymblm25l
CLOUD_API_KEY=272257295885546
CLOUD_API_SECRET=-RKsNSab5xT6dcYiB5TyagZHJlE
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://smartgrocery-api.onrender.com/api
```

---

## URLs After Deployment

**Backend API:** `https://smartgrocery-api.onrender.com`
**Frontend:** `https://smart-grocery.vercel.app`
**Admin Panel:** `https://smart-grocery.vercel.app/admin/login`

---

## Security Tips

1. ✅ Keep `JWT_SECRET` and `CLOUD_API_SECRET` safe
2. ✅ Don't commit `.env` files (check .gitignore)
3. ✅ Use strong `JWT_SECRET` (at least 32 characters)
4. ✅ Enable HTTPS (both platforms provide it by default)
5. ✅ Whitelist MongoDB IPs (0.0.0.0/0 for testing, later restrict)

---

## Final Checklist

- [ ] GitHub repository created and code pushed
- [ ] Render account created
- [ ] Backend deployed on Render
- [ ] MongoDB Atlas set up with connection string
- [ ] MongoDB network access configured (0.0.0.0/0)
- [ ] All backend environment variables set on Render
- [ ] Vercel account created
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variable set (REACT_APP_API_URL)
- [ ] Backend API responding (`/api/products` returns data)
- [ ] Frontend loads and can connect to backend
- [ ] User signup and login working
- [ ] Admin panel accessible
- [ ] Image uploads working
- [ ] All features tested

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

**🎉 Congratulations! Your app is live!**

Monitor your apps and make updates by pushing to GitHub.

For issues, check the deployment logs in Render and Vercel dashboards.

Good luck! 🚀
