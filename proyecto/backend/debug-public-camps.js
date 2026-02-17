
const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in newer node
// If node-fetch isn't available, we'll use http module, but let's try fetch first as it might be in global scope in newer node or we can use dynamic import
// Actually, let's use standard http to be safe and dependency-free

const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/camps/public',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY:');
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log(data);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
