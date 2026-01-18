# 📚 DramaBox API Documentation

## Base URL
```
http://localhost:3000  (Development)
https://your-domain.vercel.app  (Production)
```

---

## Endpoints

### 1. 🏠 Root Endpoint
**GET /** 

Returns API information and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "DramaBox API - Self-Hosted Version",
  "version": "1.0.0",
  "endpoints": {
    "latest": "/api/latest?page=1&channelId=43",
    "search": "/api/search?q=keyword",
    "stream": "/api/stream/:bookId?episode=1",
    "health": "/api/health"
  }
}
```

---

### 2. 📺 Get Latest Dramas
**GET /api/latest**

Mengambil daftar drama terbaru.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Nomor halaman |
| channelId | integer | No | 43 | ID channel drama |

**Example Request:**
```bash
GET /api/latest?page=1&channelId=43
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "channelId": 43,
    "dramas": [
      {
        "bookId": "41000102902",
        "title": "Drama Title",
        "cover": "https://...",
        "description": "...",
        // ... other fields
      }
    ]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch latest dramas",
  "message": "Error details"
}
```

---

### 3. 🔍 Search Dramas
**GET /api/search**

Mencari drama berdasarkan keyword.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | **Yes** | Kata kunci pencarian |

**Example Request:**
```bash
GET /api/search?q=pewaris
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "keyword": "pewaris",
    "results": [
      {
        "bookId": "...",
        "title": "...",
        "cover": "...",
        // ... other fields
      }
    ]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Search keyword (q) is required"
}
```

---

### 4. 🎬 Get Streaming Links
**GET /api/stream/:bookId**

Mendapatkan link streaming untuk drama tertentu.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bookId | string | **Yes** | ID buku drama |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| episode | integer | No | 1 | Nomor episode |

**Example Request:**
```bash
GET /api/stream/41000102902?episode=1
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "bookId": "41000102902",
    "episode": 1,
    "streamingLinks": [
      {
        "index": 1,
        "title": "Episode 1",
        "streamUrl": "https://cdn.dramabox.com/..."
      },
      // ... more episodes
    ]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Book ID is required"
}
```

---

### 5. ❤️ Health Check
**GET /api/health**

Memeriksa status server.

**Example Request:**
```bash
GET /api/health
```

**Success Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-18T07:54:00.000Z"
}
```

---

## Error Codes

| HTTP Code | Description |
|-----------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Endpoint tidak ditemukan |
| 500 | Internal Server Error - Kesalahan server |

---

## Rate Limiting

Saat ini belum ada rate limiting. Untuk production, disarankan menambahkan rate limiting middleware seperti `express-rate-limit`.

---

## CORS

API ini mendukung CORS untuk semua origins. Anda bisa mengakses API dari domain manapun.

---

## Example Usage

### cURL
```bash
# Get latest dramas
curl "http://localhost:3000/api/latest?page=1"

# Search
curl "http://localhost:3000/api/search?q=pewaris"

# Get stream links
curl "http://localhost:3000/api/stream/41000102902?episode=1"
```

### JavaScript (Fetch)
```javascript
// Get latest dramas
const response = await fetch('http://localhost:3000/api/latest?page=1');
const data = await response.json();
console.log(data);

// Search
const searchResponse = await fetch('http://localhost:3000/api/search?q=pewaris');
const searchData = await searchResponse.json();
console.log(searchData);

// Get stream links
const streamResponse = await fetch('http://localhost:3000/api/stream/41000102902');
const streamData = await streamResponse.json();
console.log(streamData);
```

### Axios
```javascript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Get latest
const latest = await client.get('/latest', { params: { page: 1 } });

// Search
const search = await client.get('/search', { params: { q: 'pewaris' } });

// Get stream
const stream = await client.get('/stream/41000102902', { params: { episode: 1 } });
```

---

## Notes

- Token secara otomatis di-cache selama 23 jam
- Jika token expired, sistem akan otomatis refresh
- Retry logic otomatis untuk request yang gagal
- Semua response menggunakan format JSON standar dengan field `success`
