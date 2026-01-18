import axios from 'axios';

const tokenData = {
  "token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnlaV2RwYzNSbGNsUjVjR1VpT2lKVVJVMVFJaXdpZFhObGNrbGtJam96T1RZek1EUTVNakI5LnVNZDZacS1VNTR6ZkpMVjhGZEtFUjBsLU5MQ1RxZHlXZUNPLWFOdzZxMmc=",
  "deviceid": "2dd3165f-fa84-40ef-944a-d2213dc9b1bf",
  "androidid": "ffffffffaa896fba2cebf918875c62271d17236600000000"
};

const headers = {
  "User-Agent": "okhttp/4.10.0",
  "Accept-Encoding": "gzip",
  "Content-Type": "application/json",
  "tn": `Bearer ${tokenData.token}`,
  "version": "430",
  "vn": "4.3.0",
  "cid": "DRA1000042",
  "package-name": "com.storymatrix.drama",
  "apn": "1",
  "device-id": tokenData.deviceid,
  "language": "in",
  "current-language": "in",
  "p": "43",
  "time-zone": "+0800"
};

const requestData = {
  newChannelStyle: 1,
  isNeedRank: 1,
  pageNo: 1,
  index: 1,
  channelId: 43
};

console.log('🔄 Testing DramaBox API...\n');

try {
  const response = await axios.post(
    'https://sapi.dramaboxdb.com/drama-box/he001/theater',
    requestData,
    { headers, timeout: 15000 }
  );
  
  const data = response.data;
  
  console.log('✅ API Response received!');
  console.log('Status:', response.status);
  console.log('\n📦 Response structure:');
  console.log('Keys:', Object.keys(data));
  console.log('\n🔍 Checking data paths:');
  console.log('  success:', data.success);
  console.log('  path:', data.path);
  console.log('  message:', data.message);
  console.log('  columnVoList:', !!data.columnVoList);
  console.log('  data:', !!data.data);
  console.log('  newTheaterList:', !!data.newTheaterList);
  
  console.log('\n📋 Full Response (first 500 chars):');
  const jsonStr = JSON.stringify(data, null, 2);
  console.log(jsonStr.substring(0, 500));
  
  if (jsonStr.length > 500) {
    console.log('\n... (truncated, total length:', jsonStr.length, 'chars)');
  }
  
  // Save full response to file
  const fs = await import('fs');
  fs.writeFileSync('api-response-debug.json', jsonStr);
  console.log('\n💾 Full response saved to: api-response-debug.json');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', JSON.stringify(error.response.data, null, 2));
  }
}
