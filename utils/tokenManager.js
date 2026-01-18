import axios from 'axios';
import NodeCache from 'node-cache';

// Cache token selama 23 jam (token biasanya valid 24 jam)
const tokenCache = new NodeCache({ stdTTL: 23 * 60 * 60 });

/**
 * Token Manager dengan multi-source fallback dan caching
 */
class TokenManager {
  constructor() {
    // Daftar token generators (primary & backup)
    this.tokenSources = [
      'https://dramabox-token.vercel.app/token',
      // Tambahkan backup sources jika ada
    ];
    this.currentSourceIndex = 0;
  }

  /**
   * Get token dari cache atau fetch baru
   */
  async getToken() {
    // Cek cache terlebih dahulu
    const cachedToken = tokenCache.get('dramabox_token');
    if (cachedToken) {
      console.log('✅ Using cached token');
      return cachedToken;
    }

    console.log('🔄 Fetching new token...');
    return await this.fetchNewToken();
  }

  /**
   * Fetch token baru dengan fallback mechanism
   */
  async fetchNewToken() {
    let lastError;

    // Coba semua sources sampai berhasil
    for (let i = 0; i < this.tokenSources.length; i++) {
      const sourceUrl = this.tokenSources[this.currentSourceIndex];
      
      try {
        console.log(`🔍 Trying token source ${this.currentSourceIndex + 1}: ${sourceUrl}`);
        
        const response = await axios.get(sourceUrl, {
          timeout: 10000, // 10 detik timeout
        });

        if (response.data && response.data.token) {
          const tokenData = response.data;
          
          // Simpan ke cache
          tokenCache.set('dramabox_token', tokenData);
          console.log('✅ Token fetched and cached successfully');
          
          return tokenData;
        }
      } catch (error) {
        console.error(`❌ Failed to fetch from source ${this.currentSourceIndex + 1}:`, error.message);
        lastError = error;
        
        // Pindah ke source berikutnya
        this.currentSourceIndex = (this.currentSourceIndex + 1) % this.tokenSources.length;
      }
    }

    // Semua sources gagal
    throw new Error(`Failed to fetch token from all sources. Last error: ${lastError?.message}`);
  }

  /**
   * Force refresh token (untuk error recovery)
   */
  async refreshToken() {
    console.log('🔄 Force refreshing token...');
    tokenCache.del('dramabox_token');
    return await this.fetchNewToken();
  }

  /**
   * Clear cache
   */
  clearCache() {
    tokenCache.flushAll();
    console.log('🗑️ Token cache cleared');
  }
}

// Singleton instance
const tokenManager = new TokenManager();

export default tokenManager;
