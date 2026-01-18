# 🚀 Deploy DramaBox API ke Vercel

Panduan step-by-step untuk deploy API ke Vercel (GRATIS!)

## ✨ Mengapa Vercel?

- ✅ **100% Gratis** untuk personal projects
- ✅ **Auto SSL/HTTPS** otomatis
- ✅ **Global CDN** - cepat di seluruh dunia
- ✅ **Easy deployment** - 1 command
- ✅ **Auto-deploy** dari Git
- ✅ **Environment variables** support

---

## 📋 Prerequisites

1. Akun Vercel (gratis) - [Daftar di sini](https://vercel.com/signup)
2. Node.js terinstall
3. Git repository (GitHub/GitLab/Bitbucket)

---

## 🎯 Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login ke Vercel

```bash
vercel login
```

Pilih metode login (Email/GitHub/GitLab/Bitbucket)

### Step 3: Deploy

Dari root directory project:

```bash
vercel
```

Vercel akan bertanya:
1. **Set up and deploy**: Pilih `Y`
2. **Which scope**: Pilih account Anda
3. **Link to existing project**: Pilih `N` (untuk project baru)
4. **Project name**: Biarkan default atau ganti nama
5. **Directory**: Pilih `./` (current directory)

**Output**: Anda akan mendapat URL preview seperti:
```
https://dramabox-api-xxx.vercel.app
```

### Step 4: Production Deploy

```bash
vercel --prod
```

**Output**: URL production Anda, misalnya:
```
https://dramabox-api.vercel.app
```

### Step 5: Test Deployment

```bash
curl https://dramabox-api.vercel.app/api/health
```

✅ Jika berhasil, Anda akan mendapat response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "..."
}
```

---

## 🎯 Method 2: Deploy via Vercel Dashboard

### Step 1: Push ke Git

```bash
# Initialize git (jika belum)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DramaBox API"

# Push ke GitHub/GitLab/Bitbucket
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Import di Vercel Dashboard

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **"Add New..."** → **"Project"**
3. **Import Git Repository** → Pilih repository Anda
4. **Configure Project**:
   - Framework Preset: **Other**
   - Build Command: (kosongkan)
   - Output Directory: (kosongkan)
   - Install Command: `npm install`
5. Klik **"Deploy"**

### Step 3: Wait for Deployment

Vercel akan otomatis:
1. Install dependencies
2. Build project
3. Deploy ke production

**Time**: ~1-2 menit

### Step 4: Get Your URL

Setelah selesai, Anda akan mendapat:
```
https://your-project-name.vercel.app
```

---

## ⚙️ Set Environment Variables (Optional)

Jika butuh custom environment variables:

### Via CLI:

```bash
vercel env add PORT
# Input value: 3000

vercel env add NODE_ENV
# Input value: production
```

### Via Dashboard:

1. Buka project di Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Add variable:
   - Name: `PORT`
   - Value: `3000`
   - Environment: Production
4. **Save**
5. **Redeploy** untuk apply changes

---

## 🔄 Auto Deploy (Git Integration)

Jika deploy via Dashboard, setiap push ke Git akan otomatis deploy!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys!
```

---

## 🧪 Test Your Deployed API

### Health Check
```bash
curl https://your-api.vercel.app/api/health
```

### Get Latest Dramas
```bash
curl "https://your-api.vercel.app/api/latest?page=1"
```

### Search
```bash
curl "https://your-api.vercel.app/api/search?q=pewaris"
```

### Get Streaming Links
```bash
curl "https://your-api.vercel.app/api/stream/41000102902?episode=1"
```

---

## 📊 Monitor Your Deployment

### Via Dashboard:

1. **Deployments** tab - lihat semua deployment
2. **Functions** tab - monitor serverless functions
3. **Analytics** - traffic & performance
4. **Logs** - real-time logs

### Via CLI:

```bash
# View logs
vercel logs your-deployment-url

# List all deployments
vercel ls
```

---

## 🛠️ Troubleshooting

### Issue 1: Build Failed

**Check**:
```bash
# Test build locally
npm install
npm start
```

**Common causes**:
- Missing dependencies in `package.json`
- Syntax errors
- Wrong Node version

### Issue 2: Function Timeout

**Vercel limits**: 10 seconds for Hobby plan

**Solution**: Optimize your code or upgrade plan

### Issue 3: Environment Variables Not Working

**Check**:
1. Variables di Dashboard → Settings → Environment Variables
2. Redeploy setelah add variables
3. Pastikan nama variable benar (case-sensitive)

### Issue 4: 404 Not Found

**Check `vercel.json`**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain:

1. **Settings** → **Domains**
2. **Add Domain** → masukkan domain Anda
3. Update DNS di domain registrar:
   - Type: `CNAME`
   - Name: `@` atau `www`
   - Value: `cname.vercel-dns.com`
4. **Verify**

**Result**: API Anda bisa diakses via domain sendiri!
```
https://api.yourdomain.com
```

---

## 💡 Tips & Best Practices

1. **Use Git for Deployment**
   - Otomatis deploy setiap push
   - Rollback mudah
   - Version control

2. **Enable Analytics**
   - Monitor traffic
   - Identify issues
   - Performance insights

3. **Set Up Alerts**
   - Email notification untuk deployment
   - Error alerts

4. **Use Preview Deployments**
   - Test changes sebelum production
   - Safe untuk experiment

5. **Keep Dependencies Updated**
   ```bash
   npm update
   git commit -am "Update dependencies"
   git push
   ```

---

## 🔒 Security Best Practices

1. **Never commit `.env`** (already in `.gitignore`)
2. **Use Environment Variables** untuk secrets
3. **Enable HTTPS** (otomatis di Vercel)
4. **Add Rate Limiting** untuk production
5. **Monitor Logs** untuk suspicious activity

---

## 📈 Scaling (Future)

Jika traffic meningkat:

1. **Upgrade Vercel Plan**
   - Hobby: Gratis
   - Pro: $20/month
   - Enterprise: Custom

2. **Add Caching**
   - Redis untuk distributed cache
   - Response caching

3. **Add CDN**
   - Already included di Vercel!

4. **Optimize Code**
   - Reduce response time
   - Minimize dependencies

---

## ✅ Checklist Deployment

- [ ] Project berjalan di local (`npm start`)
- [ ] Push ke Git repository
- [ ] Install Vercel CLI / Login ke Dashboard
- [ ] Deploy (`vercel` atau via Dashboard)
- [ ] Test production URL
- [ ] Set environment variables (jika perlu)
- [ ] Enable auto-deploy (Git integration)
- [ ] Monitor first requests
- [ ] Share API URL! 🎉

---

## 📚 Useful Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove <deployment-url>

# Link project
vercel link
```

---

## 🎉 Selesai!

API Anda sekarang live di internet dan bisa diakses siapa saja!

**Share URL Anda**:
```
https://your-api.vercel.app
```

**Next Steps**:
- Add custom domain
- Implement rate limiting
- Monitor analytics
- Build frontend untuk consume API ini! 🚀
