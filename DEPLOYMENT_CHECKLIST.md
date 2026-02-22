# 🚀 Quick Deployment Checklist

## Before Deploying

- [ ] All code committed to Git
- [ ] No .env file in Git (check .gitignore)
- [ ] `npm start` works locally for both frontend and backend
- [ ] All features tested locally

## Backend Setup (Render)

### Prerequisites
- [ ] GitHub account with repository
- [ ] MongoDB Atlas account & connection string
- [ ] Render account

### Steps
1. [ ] Go to render.com → New Web Service
2. [ ] Connect GitHub repository
3. [ ] Set Root Directory: `server`
4. [ ] Build: `npm install`
5. [ ] Start: `npm start`
6. [ ] Add Environment Variables:
   - [ ] `MONGODB_URI` = Your MongoDB connection string
   - [ ] `JWT_SECRET` = Generate strong random key
   - [ ] `NODE_ENV` = production
   - [ ] `CLOUD_NAME` = dymblm25l
   - [ ] `CLOUD_API_KEY` = 272257295885546
   - [ ] `CLOUD_API_SECRET` = -RKsNSab5xT6dcYiB5TyagZHJlE
7. [ ] Deploy
8. [ ] **Copy Backend URL** from Render dashboard

### After Backend Deployed
- [ ] Backend URL looks like: `https://smartgrocery-api.onrender.com`
- [ ] Check MongoDB Atlas allows Render IP (Network Access: 0.0.0.0/0)
- [ ] Test endpoint: `https://your-backend.onrender.com/api/products`

## Frontend Setup (Vercel)

### Prerequisites
- [ ] Backend URL from Render (from step above)

### Steps
1. [ ] Go to vercel.com → Add New → Project
2. [ ] Import GitHub repository
3. [ ] Set Root Directory: `client`
4. [ ] Add Environment Variable:
   - [ ] `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
5. [ ] Deploy
6. [ ] **Copy Frontend URL** from Vercel dashboard

### After Frontend Deployed
- [ ] Frontend URL looks like: `https://your-project.vercel.app`
- [ ] Visit the site and test all features

## Verify Everything Works

### Test Backend API
```bash
curl https://your-backend.onrender.com/api/products
```

### Test Frontend
- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Sign up works
- [ ] Login works
- [ ] Admin login works
- [ ] Can add to cart
- [ ] All images load from Cloudinary

## Continuous Updates

After deploying, any `git push` to main branch will auto-deploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
# Wait 2-3 minutes for auto-deployment
```

## Need Help?

- Check logs in Render dashboard
- Check logs in Vercel dashboard
- Verify all environment variables are set
- Check browser console for errors (F12)
- Verify API URL is correct in frontend

---

**Good luck! 🎉**
