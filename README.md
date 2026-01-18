# 🎬 DramaBox API - Self-Hosted Edition

API mandiri untuk mengakses konten DramaBox tanpa bergantung pada API pihak ketiga. Solusi ini memberikan Anda kontrol penuh atas API dengan sistem caching token, retry logic, dan multiple fallback sources.

## ✨ Keunggulan Self-Hosted

- ✅ **Kontrol Penuh**: Deploy dan maintain API sendiri
- ✅ **Token Caching**: Token di-cache 23 jam untuk efisiensi
- ✅ **Auto Retry**: Otomatis retry jika request gagal
- ✅ **Fallback System**: Multiple token sources untuk reliability
- ✅ **Production Ready**: Siap deploy ke Vercel, Railway, atau VPS
- ✅ **CORS Enabled**: Bisa diakses dari frontend manapun

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Setup Environment

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 📡 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/api/docs` | GET | Interactive documentation |
| `/api/latest` | GET | Get latest dramas |
| `/api/search` | GET | Search dramas |
| `/api/stream/:bookId` | GET | Get streaming links |
| `/api/health` | GET | Health check |

**Dokumentasi lengkap**: Lihat [API-DOCS.md](./API-DOCS.md)

---

## 🧪 Testing API

### Menggunakan cURL

```bash
# Test health check
curl http://localhost:3000/api/health

# Get latest dramas
curl "http://localhost:3000/api/latest?page=1"

# Search drama
curl "http://localhost:3000/api/search?q=pewaris"

# Get streaming links
curl "http://localhost:3000/api/stream/41000102902?episode=1"
```

### Menggunakan Browser

Buka browser dan akses:
- http://localhost:3000
- http://localhost:3000/api/docs
- http://localhost:3000/api/latest?page=1

---

## 🌐 Deployment

### Deploy ke Vercel (Gratis) ⭐ Recommended

1. **Install Vercel CLI** (jika belum):
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Production deploy**:
   ```bash
   vercel --prod
   ```

Vercel akan memberikan URL production seperti: `https://your-api.vercel.app`

### Deploy ke Railway

1. Buat akun di [Railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy otomatis dari main branch
4. Set environment variables di Railway dashboard

### Deploy ke VPS (Linux)

```bash
# Clone repository
git clone <your-repo-url>
cd DramaBox-API

# Install dependencies
npm install

# Install PM2 untuk process management
npm install -g pm2

# Start dengan PM2
pm2 start server.js --name dramabox-api

# Setup auto-start on reboot
pm2 startup
pm2 save
```

---

## ⚙️ Configuration

### Environment Variables

Edit file `.env`:

```env
# Server port
PORT=3000

# Node environment
NODE_ENV=production

# Token source (primary)
TOKEN_SOURCE_PRIMARY=https://dramabox-token.vercel.app/token

# Optional: Backup token source
# TOKEN_SOURCE_BACKUP=https://backup-source.com/token
```

### Menambahkan Backup Token Source

Edit `utils/tokenManager.js`:

```javascript
this.tokenSources = [
  'https://dramabox-token.vercel.app/token',
  'https://your-backup-source.com/token',
  'https://another-backup.com/token'
];
```

---

## 🔧 Advanced Features

### Rate Limiting (Optional)

Install rate limiter:

```bash
npm install express-rate-limit
```

Tambahkan ke `server.js`:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Custom Token Generator

Jika Anda punya token generator sendiri, update `tokenManager.js`:

```javascript
this.tokenSources = [
  'https://your-custom-token-api.com/generate'
];
```

---

## 📊 Monitoring

### Check Server Status

```bash
curl http://localhost:3000/api/health
```

### View Logs

Development:
```bash
npm run dev
```

Production (dengan PM2):
```bash
pm2 logs dramabox-api
```

---

## 🛠️ Troubleshooting

### Error: "Failed to fetch token"

**Solusi**:
1. Cek koneksi internet
2. Verify token source URL masih aktif
3. Tambahkan backup token sources
4. Clear token cache: restart server

### Error: "Port already in use"

**Solusi**:
```bash
# Cari process yang menggunakan port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <pid> /F

# Atau gunakan port lain di .env
PORT=4000
```

### Token Cache Issues

**Clear cache**: Restart server

```bash
# Development
Ctrl+C lalu npm run dev

# Production (PM2)
pm2 restart dramabox-api
```

---

## 📁 Project Structure

```
DramaBox-API/
├── server.js              # Main server file
├── routes/
│   └── drama.js          # API route handlers
├── utils/
│   ├── tokenManager.js   # Token caching & management
│   └── dramaboxClient.js # DramaBox API client
├── .env                  # Environment variables (create this)
├── .env.example          # Environment template
├── package.json          # Dependencies
├── vercel.json           # Vercel config
├── API-DOCS.md           # API documentation
└── README.md             # This file
```

---

## 🤝 Contributing

Contributions are welcome! Silakan fork repository ini dan submit pull request.

---

## 📝 License

ISC License

---

## 💡 Tips

1. **Gunakan HTTPS** untuk production deployment
2. **Implementasi rate limiting** untuk mencegah abuse
3. **Monitor logs** secara regular
4. **Backup token sources** untuk reliability
5. **Update dependencies** secara berkala dengan `npm update`

---

## 📧 Support

Jika ada pertanyaan atau masalah:
- Buka issue di GitHub repository
- Check [API-DOCS.md](./API-DOCS.md) untuk panduan lengkap

---

**Selamat menggunakan DramaBox API Self-Hosted! 🎉**

