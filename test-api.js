import axios from 'axios';
import { token } from './get-token.js'; 

try {
  console.log('🔄 Fetching token...');
  const gettoken = await token();
  console.log('✅ Token received:', {
    tokenLength: gettoken.token.length,
    deviceId: gettoken.deviceid
  });
  
  const url = "https://sapi.dramaboxdb.com/drama-box/he001/theater";
  
  const headers = {
    "User-Agent": "okhttp/4.10.0",
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
    "tn": `Bearer ${gettoken.token}`,
    "version": "430",
    "vn": "4.3.0",
    "cid": "DRA1000042",
    "package-name": "com.storymatrix.drama",
    "apn": "1",
    "device-id": gettoken.deviceid,
    "language": "in",
    "current-language": "in",
    "p": "43",
    "time-zone": "+0800",
    "content-type": "application/json; charset=UTF-8"
  };
  
  const data = {
    newChannelStyle: 1,
    isNeedRank: 1,
    pageNo: 1,
    index: 1,
    channelId: 43
  };
  
  console.log('\n🔄 Calling DramaBox API...');
  const res = await axios.post(url, data, { headers });
  
  console.log('\n📦 Response Status:', res.status);
  console.log('📦 Response Keys:', Object.keys(res.data));
  console.log('\n📋 Full Response:');
  console.log(JSON.stringify(res.data, null, 2));
  
  // Check for dramas in different locations
  console.log('\n🔍 Checking data locations:');
  console.log('- columnVoList exists:', !!res.data.columnVoList);
  console.log('- data.columnVoList exists:', !!res.data.data?.columnVoList);
  console.log('- newTheaterList exists:', !!res.data.newTheaterList);
  console.log('- data.newTheaterList exists:', !!res.data.data?.newTheaterList);
  
  if (res.data.columnVoList) {
    console.log('\n✅ Found columnVoList with', res.data.columnVoList.length, 'columns');
    let totalDramas = 0;
    res.data.columnVoList.forEach((column, idx) => {
      const bookCount = column.bookList?.length || 0;
      console.log(`  Column ${idx + 1}: ${bookCount} books`);
      totalDramas += bookCount;
    });
    console.log(`\n📚 Total dramas found: ${totalDramas}`);
  }
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  if (error.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
  }
}
