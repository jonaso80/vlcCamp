
import 'dotenv/config';
import { sendCampRegistrationEmail } from './src/services/email.service.js';

async function test() {
    console.log('Testing Email Service...');
    console.log('API Key present:', !!process.env.BREVO_API_KEY);
    console.log('API Key length:', process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.length : 0);

    try {
        const result = await sendCampRegistrationEmail(
            'info.campvlc@gmail.com', // Enviamos al correo corporativo para recibirlo seguro
            'Campamento de Prueba',
            'Test User'
        );
        console.log('Result:', result);
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

test();
