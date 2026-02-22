const http = require('http');

function postJson(path, data, headers = {}) {
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
        // log status for debugging
        console.log('STATUS', res.statusCode);
        console.log('HEADERS', res.headers);
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (err) {
          reject(new Error('Invalid JSON response: ' + body));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

async function run() {
  try {
    console.log('Logging in as admin...');
    const login = await postJson('/api/auth/login', { email: 'admin@gmail.com', password: 'admin1234' });
    if (!login.token) {
      console.error('Login failed:', login);
      process.exit(1);
    }
    console.log('Received token, calling admin dashboard (GET) and import (POST) for diagnostics...');
    // Test GET admin/dashboard
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/dashboard',
      method: 'GET',
      headers: { Authorization: `Bearer ${login.token}` }
    };
    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        console.log('DASHBOARD STATUS', res.statusCode);
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => { console.log('DASHBOARD BODY:', body.slice(0, 300)); resolve(); });
      });
      req.on('error', reject);
      req.end();
    });

    // Now call import endpoint
    // Try POST with no body (Content-Length: 0)
    await new Promise((resolve, reject) => {
      const opts = { hostname: 'localhost', port: 5000, path: '/api/admin/import-products', method: 'POST', headers: { Authorization: `Bearer ${login.token}`, 'Content-Length': 0 } };
      const r = http.request(opts, (res) => {
        console.log('EMPTY-POST STATUS', res.statusCode);
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => { console.log('EMPTY-POST BODY:', body); resolve(); });
      });
      r.on('error', reject);
      r.end();
    });

    const res = await postJson('/api/admin/import-products', { replace: true }, { Authorization: `Bearer ${login.token}` });
    console.log('Import response:', res);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

run();
