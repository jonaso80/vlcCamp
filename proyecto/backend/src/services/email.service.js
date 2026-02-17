/**
 * Servicio para enviar emails usando Brevo (anteriormente Sendinblue)
 */

import * as BrevoPkg from '@getbrevo/brevo';
const Brevo = BrevoPkg.default || BrevoPkg;

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'no-reply@vlccamp.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_PUBLIC_URL = process.env.BACKEND_PUBLIC_URL || 'http://localhost:4000';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info.campvlc@gmail.com';

// Inicializar cliente de Brevo
// Inicializar cliente de Brevo
let apiInstance = new Brevo.TransactionalEmailsApi();

if (BREVO_API_KEY) {
  const key = BREVO_API_KEY.trim();
  console.log(`🔑 Configurando API Key: ${key.substring(0, 8)}... (Length: ${key.length})`);

  // Intentar asignar la key en todas las ubicaciones posibles de autenticación
  if (apiInstance.authentications['apiKey']) {
    apiInstance.authentications['apiKey'].apiKey = key;
  }
  if (apiInstance.authentications['api-key']) {
    apiInstance.authentications['api-key'].apiKey = key;
  }
} else {
  console.error('❌ NO SE ENCONTRÓ LA VO BREVO_API_KEY');
}

/**
 * Helper para verificar configuración
 */
const checkConfig = () => {
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY no está configurada');
    return { success: false, error: 'API key no configurada' };
  }
  return { success: true };
};

/**
 * Envía un email de verificación con el código
 * @param {string} to - Email del destinatario
 * @param {string} code - Código de verificación de 6 dígitos
 * @param {string} userName - Nombre del usuario
 * @returns {Promise<{success: boolean, error?: string, messageId?: string}>}
 */
export const sendVerificationEmail = async (to, code, userName) => {
  const configCheck = checkConfig();
  if (!configCheck.success) return configCheck;

  console.log('📧 Intentando enviar email de verificación a:', to);

  let sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = 'Código de verificación - vlcCamp';
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8EB8BA 0%, #B2DFDB 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-box { background: white; border: 2px dashed #8EB8BA; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .code { font-size: 32px; font-weight: bold; color: #2E4053; letter-spacing: 8px; font-family: 'Courier New', monospace; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>vlcCamp</h1>
        </div>
        <div class="content">
          <h2>¡Hola${userName ? ` ${userName}` : ''}!</h2>
          <p>Gracias por registrarte en vlcCamp. Para completar tu registro, introduce el siguiente código de verificación:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p>Este código expirará en 10 minutos. Si no has solicitado este código, puedes ignorar este email.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} vlcCamp. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  sendSmtpEmail.sender = { name: 'vlcCamp', email: SMTP_FROM_EMAIL };
  sendSmtpEmail.to = [{ email: to, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email de verificación enviado correctamente a:', to);
    // data.body contains the actual response structure in newer versions, or data itself
    console.log('📧 Message ID:', data.messageId || (data.body && data.body.messageId));
    return { success: true, messageId: data.messageId || (data.body && data.body.messageId) };
  } catch (error) {
    console.error('❌ Error al enviar email con Brevo:', error.message);
    if (error.response) {
      console.error('🔴 Brevo Response Status Code:', error.response.statusCode);
      console.error('🔴 Brevo Response Message:', error.response.statusMessage);
      if (error.response.body) {
        console.error('🔴 Brevo Response Body:', JSON.stringify(error.response.body));
      }
    }
    return { success: false, error: error.message || 'Error desconocido al enviar email' };
  }
};

/**
 * Envía un email de confirmación de registro de campamento
 * @param {string} email - Email del destinatario (contacto del campamento)
 * @param {string} campName - Nombre del campamento
 * @param {string} contactName - Nombre del contacto (opcional)
 * @returns {Promise<{success: boolean, error?: string, messageId?: string}>}
 */
export const sendCampRegistrationEmail = async (email, campName, contactName = '') => {
  const configCheck = checkConfig();
  if (!configCheck.success) return configCheck;

  console.log('📧 Intentando enviar email de confirmación de registro de campamento a:', email);

  const confirmUrl = `${BACKEND_PUBLIC_URL.replace(/\/$/, '')}/api/camps/confirm-registration?email=${encodeURIComponent(email)}`;

  let sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = 'Confirmación de registro - vlcCamp';
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8EB8BA 0%, #B2DFDB 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .thanks { font-size: 18px; color: #2E4053; margin: 24px 0 16px; font-weight: 600; }
        .cta-wrap { text-align: center; margin: 28px 0; }
        .cta { display: inline-block; padding: 14px 28px; background: #2E4053; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>vlcCamp</h1>
        </div>
        <div class="content">
          <h2>¡Registro recibido${contactName ? ` ${contactName}` : ''}!</h2>
          <p>Hemos recibido tu solicitud de registro para el campamento <strong>${campName}</strong>.</p>
          <p class="thanks">Gracias por confiar en vlcCamp.</p>
          <p>Para validar tu registro, pulsa el botón siguiente. Después podrás volver a la web de vlcCamp y acceder al perfil de tu campamento desde el apartado <strong>Cuenta</strong> (arriba en el menú).</p>
          <div class="cta-wrap">
            <a href="${confirmUrl}" class="cta">Confirmar</a>
          </div>
          <p style="font-size: 14px; color: #666;">Si tienes cualquier duda, responde a este correo y te ayudaremos.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} vlcCamp. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  sendSmtpEmail.sender = { name: 'vlcCamp', email: SMTP_FROM_EMAIL };
  sendSmtpEmail.to = [{ email: email, name: contactName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email de confirmación de campamento enviado correctamente a:', email);
    console.log('📧 Message ID:', data.messageId || (data.body && data.body.messageId));
    return { success: true, messageId: data.messageId || (data.body && data.body.messageId) };
  } catch (error) {
    console.error('❌ Error al enviar email de confirmación de campamento con Brevo:', error.message);
    if (error.response) {
      console.error('🔴 Brevo Response Status Code:', error.response.statusCode);
      console.error('🔴 Brevo Response Message:', error.response.statusMessage);
      if (error.response.body) {
        console.error('🔴 Brevo Response Body:', JSON.stringify(error.response.body));
      }
    }
    return { success: false, error: error.message || 'Error desconocido al enviar email' };
  }
};

/**
 * Envía un email de bienvenida al usuario
 * @param {string} email - Email del destinatario
 * @param {string} name - Nombre del usuario
 * @returns {Promise<{success: boolean, error?: string, messageId?: string}>}
 */
export const sendWelcomeEmail = async (email, name) => {
  const configCheck = checkConfig();
  if (!configCheck.success) return configCheck;

  console.log('📧 Intentando enviar email de bienvenida a:', email);

  let sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = '¡Bienvenido a vlcCamp!';
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8EB8BA 0%, #B2DFDB 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>vlcCamp</h1>
        </div>
        <div class="content">
          <h2>¡Bienvenido${name ? ` ${name}` : ''}!</h2>
          <p>Gracias por unirte a vlcCamp. Estamos emocionados de tenerte con nosotros.</p>
          <p>Ahora puedes explorar nuestros campamentos y encontrar el perfecto para tus hijos.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} vlcCamp. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  sendSmtpEmail.sender = { name: 'vlcCamp', email: SMTP_FROM_EMAIL };
  sendSmtpEmail.to = [{ email: email, name: name }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email de bienvenida enviado correctamente a:', email);
    console.log('📧 Message ID:', data.messageId || (data.body && data.body.messageId));
    return { success: true, messageId: data.messageId || (data.body && data.body.messageId) };
  } catch (error) {
    console.error('❌ Error al enviar email de bienvenida con Brevo:', error.message);
    if (error.response) {
      console.error('🔴 Brevo Response Status Code:', error.response.statusCode);
      console.error('🔴 Brevo Response Message:', error.response.statusMessage);
      if (error.response.body) {
        console.error('🔴 Brevo Response Body:', JSON.stringify(error.response.body));
      }
    }
    return { success: false, error: error.message || 'Error desconocido al enviar email' };
  }
};

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

/**
 * Envía un email de contacto desde el formulario de la web
 * @param {{ name: string, email: string, subject: string, message: string }} payload
 * @returns {Promise<{success: boolean, error?: string, messageId?: string}>}
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  const configCheck = checkConfig();
  if (!configCheck.success) return configCheck;

  try {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `[Contacto vlcCamp] ${subject}`;
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8EB8BA 0%, #B2DFDB 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 16px; }
          .label { font-weight: 600; color: #555; font-size: 12px; text-transform: uppercase; }
          .value { margin-top: 4px; }
          .message-box { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 12px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Nuevo mensaje de contacto</h1></div>
          <div class="content">
            <div class="field"><span class="label">Nombre</span><div class="value">${escapeHtml(name)}</div></div>
            <div class="field"><span class="label">Email</span><div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div></div>
            <div class="field"><span class="label">Asunto</span><div class="value">${escapeHtml(subject)}</div></div>
            <div class="field"><span class="label">Mensaje</span><div class="value message-box">${escapeHtml(message)}</div></div>
          </div>
        </div>
      </body>
      </html>
    `;
    sendSmtpEmail.sender = { name: 'vlcCamp Contacto', email: SMTP_FROM_EMAIL };
    sendSmtpEmail.to = [{ email: CONTACT_TO_EMAIL }];
    sendSmtpEmail.replyTo = { email: email, name: name };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: data.messageId || (data.body && data.body.messageId) };
  } catch (error) {
    console.error('❌ Error al enviar email de contacto:', error);
    return { success: false, error: error.message || 'Error desconocido' };
  }
};
