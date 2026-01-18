# 🔧 Troubleshooting Guide - DramaBox API

## ✅ Server Sudah Running!

Jika Anda melihat pesan ini berarti server **SUDAH BERJALAN** dengan baik di `http://localhost:3000`

### Cara Mengecek Server Status:

#### 1. Via Browser
Buka browser dan kunjungi:
- http://localhost:3000 → Harus menampilkan JSON dengan API info
- http://localhost:3000/api/health → Harus menampilkan `{"success":true,"status":"healthy"}`
- http://localhost:3000/api/docs → Dokumentasi endpoint

#### 2. Via Terminal (cURL)
```bash
# Health check
curl http://localhost:3000/api/health

# API info
curl http://localhost:3000

# Test endpoint
curl "http://localhost:3000/api/latest?page=1"
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 3000 Already in Use"

**Gejala:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Penyebab:** Ada server lain yang sudah menggunakan port 3000

**Solusi A - Gunakan Port Lain:**
```bash
# Buat file .env
cp .env.example .env

# Edit .env dan ubah PORT
PORT=4000

# Restart server
npm start
```

**Solusi B - Kill Process di Port 3000:**
```powershell
# Cari process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill process (ganti <PID> dengan Process ID)
Stop-Process -Id <PID> -Force

# Atau lebih cepat:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

---

### Issue 2: "Cannot GET /"

**Gejala:** Browser menampilkan "Cannot GET /" atau 404

**Penyebab:** Server belum running atau running di port berbeda

**Solusi:**
```bash
# 1. Cek apakah server running
# Lihat di terminal, harus ada pesan "Server running on port 3000"

# 2. Jika tidak running, start server:
npm start

# 3. Tunggu sampai muncul pesan:
# 🚀 DramaBox API Server Started!
# 📡 Server running on port 3000
```

---

### Issue 3: Empty Results `"dramas":[]`

**Gejala:** Endpoint return success tapi data kosong
```json
{
  "success": true,
  "data": {
    "dramas": []
  }
}
```

**Penyebab:** 
- Token generator tidak available
- DramaBox API sedang down
- Network issues

**Solusi:**

1. **Cek Token:**
   - Lihat di terminal/console saat request
   - Harus ada pesan: `✅ Using cached token` atau `✅ Token fetched and cached successfully`
   
2. **Test Manual:**
   ```bash
   # Test token generator
   curl https://dramabox-token.vercel.app/token
   ```
   
3. **Clear Cache & Retry:**
   ```bash
   # Restart server untuk clear token cache
   # Ctrl+C untuk stop
   npm start
   ```

4. **Add Backup Token Source:**
   Edit `utils/tokenManager.js`:
   ```javascript
   this.tokenSources = [
     'https://dramabox-token.vercel.app/token',
     'https://your-backup-source.com/token'  // Add backup
   ];
   ```

---

### Issue 4: "Failed to fetch token"

**Gejala:**
```
❌ Failed to fetch from source 1
Error: Failed to fetch token from all sources
```

**Penyebab:** 
- Token generator tidak accessible
- Network/internet issues
- Firewall blocking

**Solusi:**

1. **Cek Internet:**
   ```bash
   curl https://dramabox-token.vercel.app/token
   ```

2. **Cek Firewall:**
   - Allow Node.js di Windows Firewall
   - Disable antivirus sementara untuk test

3. **Use VPN/Proxy** (jika diblokir ISP):
   ```bash
   # Set proxy (jika ada)
   set HTTP_PROXY=http://proxy:port
   set HTTPS_PROXY=http://proxy:port
   npm start
   ```

---

### Issue 5: Server Start Lalu Langsung Stop

**Gejala:** Server start tapi langsung crash/exit

**Solusi:**

1. **Cek Error Message:**
   ```bash
   # Run dengan detail error
   npm start
   # Baca error message dengan teliti
   ```

2. **Common Errors:**
   
   **A. Module not found:**
   ```bash
   npm install
   ```
   
   **B. Syntax error:**
   - Check file yang error
   - Lihat line number di error message
   
   **C. Port already in use:**
   - Lihat Issue 1 di atas

---

### Issue 6: CORS Error (dari Frontend)

**Gejala:** 
```
Access to fetch at 'http://localhost:3000' from origin 'http://localhost:8080' 
has been blocked by CORS policy
```

**Penyebab:** CORS seharusnya sudah enabled, tapi ada issue

**Solusi:**

Cek `server.js` pastikan ada:
```javascript
import cors from 'cors';
app.use(cors());
```

Jika masih error, gunakan specific origin:
```javascript
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));
```

---

### Issue 7: "npm: command not found"

**Gejala:** Windows tidak recognize `npm` command

**Solusi:**

1. **Install Node.js:**
   - Download dari https://nodejs.org
   - Pilih LTS version
   - Install dengan default options

2. **Restart Terminal:**
   - Close dan buka terminal baru
   - Test: `node --version` dan `npm --version`

---

### Issue 8: Response Lambat

**Gejala:** Request butuh waktu lama (>10 detik)

**Penyebab:**
- Token fetch pertama kali
- DramaBox API slow
- Network issues

**Solusi:**

1. **Normal Behavior:**
   - Request pertama akan lambat karena fetch token
   - Request berikutnya cepat (token di-cache 23 jam)

2. **Jika Selalu Lambat:**
   - Check internet speed
   - Try VPN
   - Change token source

---

## 🧪 Testing Checklist

Jalankan test ini untuk memastikan semua berfungsi:

### ✅ Step 1: Server Running
```bash
npm start
# Harus muncul: "🚀 DramaBox API Server Started!"
```

### ✅ Step 2: Health Check
```bash
curl http://localhost:3000/api/health
# Expected: {"success":true,"status":"healthy",...}
```

### ✅ Step 3: API Info
```bash
curl http://localhost:3000
# Expected: JSON dengan list endpoints
```

### ✅ Step 4: Test Latest Endpoint
```bash
curl "http://localhost:3000/api/latest?page=1"
# Expected: {"success":true,"data":{...}}
```

### ✅ Step 5: Test Search
```bash
curl "http://localhost:3000/api/search?q=test"
# Expected: {"success":true,"data":{...}}
```

### ✅ Step 6: Test via Browser
Buka browser:
- http://localhost:3000 ✅
- http://localhost:3000/api/health ✅
- http://localhost:3000/api/docs ✅

---

## 📊 Understanding Logs

### Normal Logs (Good):
```
🚀 DramaBox API Server Started!
📡 Server running on port 3000
🔄 Fetching new token...
🔍 Trying token source 1: https://...
✅ Token fetched and cached successfully
2026-01-18T08:00:00.000Z - GET /api/health
✅ Using cached token
```

### Error Logs (Need Action):
```
❌ Failed to fetch from source 1: Error: ...
❌ Failed to fetch token from all sources
Error: listen EADDRINUSE :::3000
```

---

## 🔍 Debug Mode

Untuk debugging lebih detail:

### Enable Verbose Logging:

Edit `server.js`, tambahkan:
```javascript
// Di bagian middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
});
```

### Check Token Status:

Tambahkan endpoint debug di `server.js`:
```javascript
app.get('/debug/token', async (req, res) => {
  try {
    const token = await tokenManager.getToken();
    res.json({
      success: true,
      tokenExists: !!token,
      tokenData: {
        hasToken: !!token?.token,
        hasDeviceId: !!token?.deviceid
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});
```

Test:
```bash
curl http://localhost:3000/debug/token
```

---

## 💡 Quick Fixes

### Quick Fix 1: Complete Reset
```bash
# Stop server (Ctrl+C)
# Clear cache dengan delete node_modules
rm -rf node_modules
npm install
npm start
```

### Quick Fix 2: Use Different Port
```bash
# Create .env
echo "PORT=4000" > .env
npm start
# Now runs on http://localhost:4000
```

### Quick Fix 3: Force Fresh Token
```bash
# Stop server (Ctrl+C)
# Start lagi - token akan di-fetch fresh
npm start
```

---

## 📞 Still Not Working?

Jika masih ada masalah, collect info berikut:

1. **Error Message Lengkap** dari terminal
2. **Node Version**: `node --version`
3. **NPM Version**: `npm --version`
4. **OS Version**: Windows 10/11?
5. **Antivirus/Firewall** yang active
6. **Screenshot** error di terminal

---

## ✅ Success Indicators

Server berfungsi dengan baik jika:
- ✅ Terminal show "🚀 DramaBox API Server Started!"
- ✅ http://localhost:3000 menampilkan JSON
- ✅ http://localhost:3000/api/health return `"healthy"`
- ✅ Token log menunjukkan `✅ Token fetched and cached successfully`
- ✅ Request endpoint tidak error 500
- ✅ Browser bisa akses semua endpoint

---

**Jika semua checklist ✅, berarti API Anda sudah running dengan sempurna! 🎉**
