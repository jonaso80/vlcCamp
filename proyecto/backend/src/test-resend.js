
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('Iniciando prueba de envío a dominio externo...');
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['contacto@google.com'], // Un dominio externo cualquiera
      subject: 'Prueba de Diagnostico',
      html: '<p>Si recibes esto, el sistema funciona para todos.</p>'
    });

    if (error) {
      console.error('❌ ERROR DETALLADO DE RESEND:');
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.log('✅ ÉXITO: Email enviado:', data);
    }
  } catch (err) {
    console.error('❌ ERROR DE EJECUCIÓN:', err);
  }
}

testEmail();
