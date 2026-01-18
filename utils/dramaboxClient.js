import axios from 'axios';
import tokenManager from './tokenManager.js';

/**
 * Centralized DramaBox API Client
 */
class DramaBoxClient {
  constructor() {
    this.baseURL = 'https://sapi.dramaboxdb.com/drama-box';
  }

  /**
   * Get headers untuk request DramaBox API
   */
  async getHeaders(tokenData) {
    return {
      'User-Agent': 'okhttp/4.10.0',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
      'tn': `Bearer ${tokenData.token}`,
      'version': '430',
      'vn': '4.3.0',
      'cid': 'DRA1000042',
      'package-name': 'com.storymatrix.drama',
      'apn': '1',
      'device-id': tokenData.deviceid,
      'language': 'in',
      'current-language': 'in',
      'p': '43',
      'time-zone': '+0800',
      'content-type': 'application/json; charset=UTF-8'
    };
  }

  /**
   * Generic request method dengan retry logic
   */
  async request(endpoint, data, retries = 2) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Get token
        const tokenData = await tokenManager.getToken();
        
        // Get headers
        const headers = await this.getHeaders(tokenData);
        
        // Make request
        const response = await axios.post(
          `${this.baseURL}${endpoint}`,
          data,
          { 
            headers,
            timeout: 15000 // 15 detik timeout
          }
        );

        return response.data;
      } catch (error) {
        lastError = error;
        
        // Jika error 401 (Unauthorized), refresh token dan retry
        if (error.response?.status === 401 && attempt < retries) {
          console.log('🔄 Token expired, refreshing...');
          await tokenManager.refreshToken();
          continue;
        }

        // Jika bukan 401 atau sudah max retries, throw error
        if (attempt === retries) {
          throw error;
        }
      }
    }

    throw lastError;
  }

  /**
   * Get latest dramas
   */
  async getLatest(pageNo = 1, channelId = 43) {
    const data = {
      newChannelStyle: 1,
      isNeedRank: 1,
      pageNo,
      index: 1,
      channelId
    };

    const response = await this.request('/he001/theater', data);
    
    // Log full response structure untuk debugging
    console.log('📦 API Response keys:', Object.keys(response));
    console.log('📦 Full Response:', JSON.stringify(response, null, 2));
    
    // Coba berbagai kemungkinan lokasi data
    let dramas = [];
    
    // Option 1: columnVoList[].bookList
    if (response.columnVoList && Array.isArray(response.columnVoList)) {
      console.log(`🔍 Found columnVoList with ${response.columnVoList.length} columns`);
      for (const column of response.columnVoList) {
        if (column.bookList && Array.isArray(column.bookList)) {
          dramas.push(...column.bookList);
          console.log(`  ✅ Added ${column.bookList.length} dramas from column`);
        }
      }
    }
    
    // Option 2: data.columnVoList[].bookList
    if (dramas.length === 0 && response.data?.columnVoList) {
      console.log('🔍 Trying data.columnVoList...');
      for (const column of response.data.columnVoList) {
        if (column.bookList && Array.isArray(column.bookList)) {
          dramas.push(...column.bookList);
        }
      }
    }
    
    // Option 3: newTheaterList.records
    if (dramas.length === 0 && response.newTheaterList?.records) {
      console.log('🔍 Trying newTheaterList.records...');
      dramas = response.newTheaterList.records;
    }
    
    // Option 4: data.newTheaterList.records
    if (dramas.length === 0 && response.data?.newTheaterList?.records) {
      console.log('🔍 Trying data.newTheaterList.records...');
      dramas = response.data.newTheaterList.records;
    }
    
    // Option 5: Direct data array
    if (dramas.length === 0 && response.data && Array.isArray(response.data)) {
      console.log('🔍 Found direct data array');
      dramas = response.data;
    }
    
    console.log(`✅ Final result: ${dramas.length} dramas found`);
    if (dramas.length > 0) {
      console.log('📚 First drama:', dramas[0]?.bookName || dramas[0]?.title || 'No name');
    } else {
      console.log('⚠️ No dramas found. Response structure might have changed.');
    }
    
    return dramas;
  }

  /**
   * Search dramas
   */
  async search(keyword) {
    const data = { keyword };
    const response = await this.request('/search/suggest', data);
    return response.data?.suggestList || [];
  }

  /**
   * Get streaming links
   */
  async getStreamingLinks(bookId, episodeIndex = 1) {
    const data = {
      boundaryIndex: 0,
      comingPlaySectionId: -1,
      index: episodeIndex,
      currencyPlaySource: 'discover_new_rec_new',
      needEndRecommend: 0,
      currencyPlaySourceName: '',
      preLoad: false,
      rid: '',
      pullCid: '',
      loadDirection: 0,
      startUpKey: '',
      bookId
    };

    const response = await this.request('/chapterv2/batch/load', data);
    
    // Extract streaming links
    const chapterList = response.data?.chapterList || [];
    return chapterList.map(chapter => ({
      index: chapter.index,
      title: chapter.title,
      streamUrl: chapter.cdnList?.[0] || null
    }));
  }
}

// Singleton instance
const dramaboxClient = new DramaBoxClient();

export default dramaboxClient;
