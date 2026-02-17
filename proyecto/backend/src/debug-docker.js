console.log('--- DEBUG DOCKER START ---');
import express from 'express';
const app = express();
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.send('OK-DEBUG');
});
app.listen(4000, '0.0.0.0', () => {
    console.log('Backend debug escuchando en puerto 4000 (0.0.0.0)');
});
console.log('--- DEBUG DOCKER ACTIVE ---');
