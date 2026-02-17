
import http from 'http';
import fs from 'fs';

const log = (msg) => fs.appendFileSync('check-api.log', msg + '\n');

log('Starting check-api...');

const req = http.get('http://localhost:4000/api/camps/test', (res) => {
    log(`Status Code: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        log(`Body: ${data}`);
    });
});

req.on('error', (e) => {
    log(`Error: ${e.message}`);
});
