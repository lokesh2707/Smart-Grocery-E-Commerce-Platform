const http = require('http');

async function postJson(path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: Object.assign({
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }, headers)
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (err) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function test() {
  try {
    console.log('🔍 OCR Diagnostic Test\n');

    // Login
    console.log('1️⃣  Testing login...');
    const login = await postJson('/api/auth/login', { 
      email: 'admin@gmail.com', 
      password: 'admin1234' 
    });
    
    if (login.status !== 200 || !login.data.token) {
      console.error('❌ Login failed:', login);
      process.exit(1);
    }
    console.log('✅ Login successful\n');

    const token = login.data.token;

    // Test the /ocr/upload endpoint directly
    console.log('2️⃣  Testing OCR endpoint...');
    const testUpload = await postJson('/api/ocr/upload', 
      { message: 'test' },
      { Authorization: `Bearer ${token}` }
    );
    
    console.log('OCR Upload POST response:');
    console.log('Status:', testUpload.status);
    console.log('Response:', JSON.stringify(testUpload.data, null, 2));

    if (testUpload.status === 400) {
      console.log('\n⚠️  Expected error (no file uploaded) - endpoint is accessible');
    }

    // Check match endpoint
    console.log('\n3️⃣  Testing OCR match endpoint...');
    const testMatch = await postJson('/api/ocr/match',
      { lines: ['apple', 'banana', 'tomato'] },
      { Authorization: `Bearer ${token}` }
    );

    console.log('OCR Match response:');
    console.log('Status:', testMatch.status);
    console.log('Matches found:', testMatch.data.matchedItems?.length || 0);
    console.log('Items:', testMatch.data.matchedItems?.slice(0, 2).map(i => ({ name: i.name, confidence: i.confidence })));

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

test();
