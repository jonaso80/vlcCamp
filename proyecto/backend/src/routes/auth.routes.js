import { Router } from 'express';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/email.service.js';

const router = Router();

/**
 * POST /api/auth/send-verification-code
 * Envía un código de verificación por email
 * Body: { email: string, code: string, userName?: string }
 */
router.post('/send-verification-code', async (req, res) => {
  try {
    const { email, code, userName } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email y código son requeridos'
      });
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        error: 'El código debe ser de 6 dígitos numéricos'
      });
    }

    const result = await sendVerificationEmail(email, code, userName || '');

    if (result.success) {
      res.json({
        success: true,
        message: 'Código de verificación enviado correctamente'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Error al enviar el email'
      });
    }
  } catch (error) {
    console.error('Error en send-verification-code:', error);
    try {
      // Append error to a file we can read from host
      import('fs').then(fs => {
        fs.appendFileSync('src/error_log.txt', new Date().toISOString() + ' - ' + (error.stack || error) + '\n');
      });
    } catch (e) { console.error('Error writing log:', e); }

    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/auth/test-email
 * Endpoint de prueba para verificar que el envío de correos funciona
 * Query params: ?email=test@example.com
 */
router.get('/test-email', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email es requerido como query parameter: ?email=test@example.com'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Enviar email de prueba (verificación)
    const testCode = '123456';
    const result = await sendVerificationEmail(email, testCode, 'Usuario de Prueba');

    if (result.success) {
      res.json({
        success: true,
        message: 'Email de prueba enviado correctamente',
        messageId: result.messageId,
        email: email
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Error al enviar el email de prueba'
      });
    }
  } catch (error) {
    console.error('Error en test-email:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/auth/send-welcome-email
 * Envía un email de bienvenida después del registro exitoso
 * Body: { email: string, name: string }
 */
router.post('/send-welcome-email', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email es requerido'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    const result = await sendWelcomeEmail(email, name || '');

    if (result.success) {
      res.json({
        success: true,
        message: 'Email de bienvenida enviado correctamente',
        messageId: result.messageId
      });
    } else {
      // No devolvemos error 500 porque el registro ya fue exitoso
      // Solo logueamos el error pero respondemos con éxito
      console.error('Error al enviar email de bienvenida (no crítico):', result.error);
      res.json({
        success: true,
        message: 'Registro completado, pero no se pudo enviar el email de bienvenida',
        warning: result.error
      });
    }
  } catch (error) {
    console.error('Error en send-welcome-email:', error);
    // No devolvemos error 500 porque el registro ya fue exitoso
    res.json({
      success: true,
      message: 'Registro completado, pero no se pudo enviar el email de bienvenida',
      warning: error.message || 'Error desconocido'
    });
  }
});

export default router;
