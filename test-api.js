import dramaboxClient from './utils/dramaboxClient.js';

console.log('🧪 Testing DramaBox API Client...\n');

try {
  // Test 1: Get Latest
  console.log('📺 Test 1: Get Latest Dramas');
  const latest = await dramaboxClient.getLatest(1, 43);
  console.log(`✅ Found ${latest.length} dramas`);
  
  if (latest.length > 0) {
    console.log('\n📋 Sample Drama:');
    const sample = latest[0];
    console.log(`  - ID: ${sample.bookId}`);
    console.log(`  - Title: ${sample.bookName}`);
    console.log(`  - Chapters: ${sample.chapterCount}`);
    console.log(`  - Views: ${sample.playCount}`);
  }
  
  // Test 2: Search
  console.log('\n\n🔍 Test 2: Search "pewaris"');
  const searchResults = await dramaboxClient.search('pewaris');
  console.log(`✅ Found ${searchResults.length} results`);
  
  console.log('\n✅ All tests completed successfully!');
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
}
