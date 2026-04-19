# InternHub Render Deployment TODO

## ✅ Configuration Files Created
- [x] `render.yaml` - Render blueprint
- [x] `server/.env.example` - Backend env template  
- [x] `client/public/_redirects` - SPA routing
- [x] `client/.env.example` - Frontend env

## ⏳ Deployment Steps
1. [ ] Push to GitHub
2. [ ] Connect repo to Render Dashboard  
3. [ ] Deploy Backend first (Node Web Service):
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`  
   - **Root Directory**: `server/`
   - Copy server/.env.example → Render Environment Vars
   - Get MongoDB Atlas URI
4. [ ] Deploy Frontend:
   - Set REACT_APP_API_URL to backend URL
5. [ ] Test connectivity
6. [ ] Seed admin user on backend
7. [ ] Update frontend API calls if needed

## 🔧 Post-Deploy
- [ ] Custom domain (optional)
- [ ] Add SSL (automatic on Render)
- [ ] Monitor logs/performance
