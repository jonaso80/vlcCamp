
import net from 'net';

const client = new net.Socket();
client.setTimeout(2000);

client.connect(4000, '127.0.0.1', () => {
    console.log('Connected to port 4000');
    client.destroy();
});

client.on('error', (err) => {
    console.log('Error connecting: ' + err.message);
    client.destroy();
});

client.on('timeout', () => {
    console.log('Connection timed out');
    client.destroy();
});
