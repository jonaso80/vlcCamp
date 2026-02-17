
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Manually load .env to be sure
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const apiKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : '';
const senderEmail = process.env.SMTP_FROM_EMAIL || 'test@example.com';

console.log('--- DIAGNÓSTICO DE CLAVE BREVO ---');
console.log(`API Key leída: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NO ENCONTRADA'}`);
console.log(`Longitud: ${apiKey.length}`);

if (!apiKey) {
    console.error('❌ ERROR CRÍTICO: No se ha detectado BREVO_API_KEY en el archivo .env');
    process.exit(1);
}

if (!apiKey.startsWith('xkeysib-')) {
    console.warn('⚠️ ADVERTENCIA: La clave no empieza por "xkeysib-". Es posible que sea un formato antiguo (v2) o incorrecto.');
}

async function verifyKey() {
    console.log('\nContactando con Brevo (API v3)...');

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'Test Script', email: senderEmail },
                to: [{ email: senderEmail, name: 'Yo mismo' }],
                subject: 'Prueba de validación de clave',
                htmlContent: '<p>Si ves esto, tu clave funciona 100% correcta.</p>'
            })
        });

        const data = await response.json();

        console.log(`\nEstado HTTP: ${response.status}`);

        if (response.ok) {
            console.log('✅ ÉXITO TOTAL: La clave es válida y el email se ha enviado.');
            console.log('Message ID:', data.messageId);
            console.log('\nCONCLUSIÓN: La clave está bien. El problema ESTÁ EN DOCKER.');
        } else {
            console.error('❌ LA CLAVE FUE RECHAZADA POR BREVO.');
            console.error(`Código de error: ${data.code}`);
            console.error(`Mensaje: ${data.message}`);
            console.log('\nCONCLUSIÓN: La clave es inválida o ha sido revocada. Tienes que generar una nueva.');
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
    }
}

verifyKey();
