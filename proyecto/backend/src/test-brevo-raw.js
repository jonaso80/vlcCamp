
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const apiKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : '';

console.log('Testing Brevo API with Raw Fetch...');
console.log(`Key: ${apiKey.substring(0, 10)}... (Length: ${apiKey.length})`);

async function testRaw() {
    const logContent = [];
    const log = (msg) => {
        console.log(msg);
        logContent.push(msg);
    };

    try {
        log(`Using Key: ${apiKey.substring(0, 5)}*** (Length: ${apiKey.length})`);

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'Test', email: process.env.SMTP_FROM_EMAIL },
                to: [{ email: process.env.SMTP_FROM_EMAIL, name: 'Test User' }],
                subject: 'Raw API Test',
                htmlContent: '<p>This is a raw test</p>'
            })
        });

        const data = await response.json();
        log(`Status: ${response.status}`);
        log(`Response: ${JSON.stringify(data, null, 2)}`);

    } catch (error) {
        log(`Fetch Error: ${error.message}`);
    } finally {
        fs.writeFileSync('test_raw_log.txt', logContent.join('\n'));
    }
}

testRaw();
