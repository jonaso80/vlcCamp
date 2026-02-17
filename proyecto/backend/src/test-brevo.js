import * as BrevoPkg from '@getbrevo/brevo';
import dotenv from 'dotenv';
import fs from 'fs';

const Brevo = BrevoPkg.default || BrevoPkg;

// Log to file helper
const logFile = 'test_brevo_output.log';
function log(msg) {
    const message = (typeof msg === 'object') ? JSON.stringify(msg, null, 2) : msg;
    console.log(message);
    try {
        fs.appendFileSync(logFile, message + '\n');
    } catch (e) {
        // ignore file write errors
    }
}

// Clear log file
try { fs.unlinkSync(logFile); } catch (e) { }

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'no-reply@vlccamp.com';

log('Iniciando script de prueba Brevo...');
log(`API Key presente: ${!!BREVO_API_KEY}`);
log(`From Email: ${SMTP_FROM_EMAIL}`);

if (!BREVO_API_KEY) {
    log('❌ BREVO_API_KEY no está configurada en .env');
    process.exit(1);
}

const apiInstance = new Brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = BREVO_API_KEY;

async function testEmail() {
    log('Configurando envío...');

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Prueba de Diagnóstico Brevo';
    sendSmtpEmail.htmlContent = '<p>Si recibes esto, la integración con Brevo funciona correctamente.</p>';
    sendSmtpEmail.sender = { name: 'vlcCamp Test', email: SMTP_FROM_EMAIL };
    // Using the sender email as recipient for self-test if possible, or a safer one
    sendSmtpEmail.to = [{ email: 'marty@example.com', name: 'Test User' }];

    try {
        log('Enviando email...');
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        log('✅ ÉXITO: Email enviado con Brevo.');
        log('Respuesta completa:');
        log(data);
    } catch (error) {
        log('❌ ERROR DETALLADO DE BREVO:');
        log(error);
        if (error.response) {
            log('Status: ' + error.response.status);
            log('Text: ' + error.response.text);
            if (error.response.body) {
                log('Body: ' + JSON.stringify(error.response.body, null, 2));
            }
        }
    }
}

testEmail();
