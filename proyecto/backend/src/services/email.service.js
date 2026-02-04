/**
 * Servicio para enviar emails usando Resend
 */

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'onboarding@resend.dev';

// Inicializar cliente de Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Envía un email de verificación con el código
 * @param {string} to - Email del destinatario
 * @param {string} code - Código de verificación de 6 dígitos
 * @param {string} userName - Nombre del usuario
 * @returns {Promise<{success: boolean, error?: string, messageId?: string}>}
 */
export const sendVerificationEmail = async (to, code, userName) => {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no está configurada');
    return { success: false, error: 'API key no configurada' };
  }

  if (!resend) {
    console.error('❌ Cliente de Resend no inicializado');
    return { success: false, error: 'Cliente de email no inicializado' };
  }

  console.log('📧 Intentando enviar email de verificación a:', to);
  console.log('🔑 API Key configurada:', RESEND_API_KEY ? 'Sí (primeros 10 chars: ' + RESEND_API_KEY.substring(0, 10) + '...)' : 'No');

  try {
    const { data, error } = await resend.emails.send({
      from: `vlcCamp <${RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: 'Código de verificación - vlcCamp',
      html: `
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
      `,
    });

    if (error) {
      console.error('❌ Error al enviar email con Resend:', error);
      return { success: false, error: error.message || 'Error desconocido al enviar email' };
    }

    console.log('✅ Email de verificación enviado correctamente a:', to);
    console.log('📧 Message ID:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Error inesperado al enviar email:', error);
    return { success: false, error: error.message || 'Error desconocido' };
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
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no está configurada');
    return { success: false, error: 'API key no configurada' };
  }

  if (!resend) {
    console.error('❌ Cliente de Resend no inicializado');
    return { success: false, error: 'Cliente de email no inicializado' };
  }

  console.log('📧 Intentando enviar email de confirmación de registro de campamento a:', email);

  try {
    const { data, error } = await resend.emails.send({
      from: `vlcCamp <${RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Confirmación de registro - vlcCamp',
      html: `
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
              <h2>¡Registro recibido${contactName ? ` ${contactName}` : ''}!</h2>
              <p>Hemos recibido tu solicitud de registro para el campamento <strong>${campName}</strong>.</p>
              <p>Nuestro equipo revisará tu solicitud y te contactaremos pronto con más información.</p>
              <p>Gracias por confiar en vlcCamp.</p>
              <div class="footer">
                <p>© ${new Date().getFullYear()} vlcCamp. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error al enviar email de confirmación de campamento con Resend:', error);
      return { success: false, error: error.message || 'Error desconocido al enviar email' };
    }

    console.log('✅ Email de confirmación de campamento enviado correctamente a:', email);
    console.log('📧 Message ID:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Error inesperado al enviar email de confirmación de campamento:', error);
    return { success: false, error: error.message || 'Error desconocido' };
  }
};

/**
 * Envía un email de bienvenida al usuario
 * @param {string} email - Email del destinatario
 * @param {string} name - Nombre del usuario
 * @returns {Promise<{success: boolean, error?: string, messageId?: string}>}
 */
export const sendWelcomeEmail = async (email, name) => {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no está configurada');
    return { success: false, error: 'API key no configurada' };
  }

  if (!resend) {
    console.error('❌ Cliente de Resend no inicializado');
    return { success: false, error: 'Cliente de email no inicializado' };
  }

  console.log('📧 Intentando enviar email de bienvenida a:', email);

  try {
    const { data, error } = await resend.emails.send({
      from: `vlcCamp <${RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: '¡Bienvenido a vlcCamp!',
      html: `
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
      `,
    });

    if (error) {
      console.error('❌ Error al enviar email de bienvenida con Resend:', error);
      return { success: false, error: error.message || 'Error desconocido al enviar email' };
    }

    console.log('✅ Email de bienvenida enviado correctamente a:', email);
    console.log('📧 Message ID:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Error inesperado al enviar email de bienvenida:', error);
    return { success: false, error: error.message || 'Error desconocido' };
  }
};

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info.campvlc@gmail.com';

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
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no está configurada');
    return { success: false, error: 'API key no configurada' };
  }

  if (!resend) {
    return { success: false, error: 'Cliente de email no inicializado' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `vlcCamp <${RESEND_FROM_EMAIL}>`,
      to: [CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `[Contacto vlcCamp] ${subject}`,
      html: `
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
      `,
    });

    if (error) {
      console.error('❌ Error al enviar email de contacto:', error);
      return { success: false, error: error.message || 'Error al enviar' };
    }
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Error inesperado en sendContactEmail:', error);
    return { success: false, error: error.message || 'Error desconocido' };
  }
};
