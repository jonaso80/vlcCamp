import { Router } from 'express';
import { getAllCamps, confirmCampByEmail, getCampByUserEmail } from '../services/camps.service.js';
import { sendCampRegistrationEmail } from '../services/email.service.js';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

router.get('/', async (req, res) => {
  try {
    const camps = await getAllCamps();
    res.json(camps);
  } catch (error) {
    console.error('Error al obtener camps', error);
    res.status(500).json({ error: 'Error al obtener camps' });
  }
});

/**
 * GET /api/camps/test
 * Endpoint de prueba para verificar que la ruta funciona
 */
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Ruta de camps funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/camps/send-registration-confirmation
 * Envía un email de confirmación después del registro de un campamento
 * Body: { email: string, campName: string, contactName?: string }
 */
router.post('/send-registration-confirmation', async (req, res) => {
  try {
    console.log('📧 [BACKEND] Recibida petición de envío de email de confirmación de campamento');
    console.log('📧 [BACKEND] Body recibido:', req.body);
    
    const { email, campName, contactName } = req.body;

    if (!email || !campName) {
      console.error('❌ [BACKEND] Faltan parámetros requeridos. Email:', email, 'CampName:', campName);
      return res.status(400).json({ 
        success: false, 
        error: 'Email y nombre del campamento son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ [BACKEND] Email inválido:', email);
      return res.status(400).json({ 
        success: false, 
        error: 'Email inválido' 
      });
    }

    console.log('📧 [BACKEND] Llamando a sendCampRegistrationEmail con:', { email, campName, contactName });
    const result = await sendCampRegistrationEmail(email, campName, contactName || '');
    console.log('📧 [BACKEND] Resultado de sendCampRegistrationEmail:', result);

    if (result.success) {
      console.log('✅ [BACKEND] Email enviado exitosamente. Message ID:', result.messageId);
      res.json({ 
        success: true, 
        message: 'Email de confirmación enviado correctamente',
        messageId: result.messageId
      });
    } else {
      // No devolvemos error 500 porque el registro ya fue exitoso
      // Solo logueamos el error pero respondemos con éxito
      console.error('❌ [BACKEND] Error al enviar email de confirmación (no crítico):', result.error);
      res.json({ 
        success: false, 
        message: 'Registro completado, pero no se pudo enviar el email de confirmación',
        error: result.error,
        warning: result.error
      });
    }
  } catch (error) {
    console.error('❌ [BACKEND] Error en send-registration-confirmation:', error);
    console.error('❌ [BACKEND] Error stack:', error.stack);
    // No devolvemos error 500 porque el registro ya fue exitoso
    res.json({ 
      success: false, 
      message: 'Registro completado, pero no se pudo enviar el email de confirmación',
      error: error.message || 'Error desconocido',
      warning: error.message || 'Error desconocido'
    });
  }
});

/**
 * GET /api/camps/confirm-registration?email=xxx
 * Valida la confirmación del campamento (cuando el usuario pulsa "Confirmar" en el correo).
 * Actualiza status a 'confirmed' y redirige al frontend con #confirmado.
 */
router.get('/confirm-registration', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.redirect(`${FRONTEND_URL}#confirmado?error=missing`);
    }
    const camp = await confirmCampByEmail(email);
    if (!camp) {
      return res.redirect(`${FRONTEND_URL}#confirmado?error=notfound`);
    }
    return res.redirect(`${FRONTEND_URL}#confirmado`);
  } catch (error) {
    console.error('❌ [BACKEND] Error en confirm-registration:', error);
    return res.redirect(`${FRONTEND_URL}#confirmado?error=server`);
  }
});

/**
 * GET /api/camps/my-camp?email=xxx
 * Devuelve el campamento del usuario (contact_email o user_email) con status confirmed.
 */
router.get('/my-camp', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email es requerido' });
    }
    const camp = await getCampByUserEmail(email);
    return res.json(camp || null);
  } catch (error) {
    console.error('Error al obtener mi campamento:', error);
    res.status(500).json({ error: 'Error al obtener el campamento' });
  }
});

export default router;



