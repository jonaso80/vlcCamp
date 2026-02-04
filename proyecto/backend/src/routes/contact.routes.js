import { Router } from 'express';
import { sendContactEmail } from '../services/email.service.js';

const router = Router();

/**
 * POST /api/contact
 * Recibe el formulario de contacto y envía un email al equipo
 * Body: { name: string, email: string, subject: string, message: string }
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: name, email, subject, message',
      });
    }
    const result = await sendContactEmail({ name, email, subject, message });
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Error en POST /api/contact:', error);
    res.status(500).json({ success: false, error: 'Error al procesar el mensaje' });
  }
});

export default router;
