import { Router } from 'express';
import fs from 'fs';
const log = (msg) => {
  try { fs.appendFileSync('email-debug.log', new Date().toISOString() + ' ' + msg + '\n'); } catch (e) { }
};

import {
  getAllCamps,
  confirmCampByEmail,
  getCampsByUserEmail,
  getPublishedCamps,
  getCampPublicPage,
  updateCampPublicidad,
  updateCampBuilderData,
  updateCampExtra,
} from '../services/camps.service.js';
import { sendCampRegistrationEmail } from '../services/email.service.js';
import {
  getChildrenByCampId,
  createChild,
  updateChild,
  deleteChild,
  getActivitiesByCampId,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../services/tablas.service.js';

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
    log('Recibida petición email: ' + JSON.stringify(req.body));


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
    log('Resultado email: ' + JSON.stringify(result));

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
    log('Error catch email: ' + error.message);

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
 * Devuelve los campamentos asociados al usuario (contact_email o user_email).
 */
router.get('/my-camp', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email es requerido' });
    }
    const camps = await getCampsByUserEmail(email);
    return res.json(camps);
  } catch (error) {
    console.error('❌ [BACKEND] Error al obtener mis campamentos:', error);
    if (error.stack) console.error(error.stack);
    res.status(500).json({
      error: 'Error al obtener los campamentos',
      details: error.message || error,
      hint: error.hint
    });
  }
});

/**
 * GET /api/camps/public
 * Lista campamentos con publicidad publicada (para la sección "Campamentos que confían en nosotros").
 */
router.get('/public', async (req, res) => {
  try {
    const camps = await getPublishedCamps();
    return res.json(camps);
  } catch (error) {
    console.error('Error al obtener campamentos publicados:', error);
    res.status(500).json({ error: 'Error al obtener campamentos' });
  }
});

/**
 * Niños: GET /api/camps/:id/children
 */
router.get('/:id/children', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
    const list = await getChildrenByCampId(id);
    return res.json(list);
  } catch (error) {
    console.error('Error al listar niños:', error);
    res.status(500).json({ error: 'Error al obtener niños' });
  }
});

router.post('/:id/children', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
    const child = await createChild(id, req.body || {});
    return res.status(201).json(child);
  } catch (error) {
    console.error('Error al crear niño:', error);
    res.status(500).json({ error: 'Error al crear' });
  }
});

router.patch('/:id/children/:childId', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const childId = parseInt(req.params.childId, 10);
    if (Number.isNaN(id) || Number.isNaN(childId)) return res.status(400).json({ error: 'id inválido' });
    const child = await updateChild(id, childId, req.body || {});
    return res.json(child);
  } catch (error) {
    console.error('Error al actualizar niño:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

router.delete('/:id/children/:childId', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const childId = parseInt(req.params.childId, 10);
    if (Number.isNaN(id) || Number.isNaN(childId)) return res.status(400).json({ error: 'id inválido' });
    await deleteChild(id, childId);
    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar niño:', error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

/**
 * Actividades: GET /api/camps/:id/activities
 */
router.get('/:id/activities', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
    const list = await getActivitiesByCampId(id);
    return res.json(list);
  } catch (error) {
    console.error('Error al listar actividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

router.post('/:id/activities', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
    const activity = await createActivity(id, req.body || {});
    return res.status(201).json(activity);
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ error: 'Error al crear' });
  }
});

router.patch('/:id/activities/:activityId', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const activityId = parseInt(req.params.activityId, 10);
    if (Number.isNaN(id) || Number.isNaN(activityId)) return res.status(400).json({ error: 'id inválido' });
    const activity = await updateActivity(id, activityId, req.body || {});
    return res.json(activity);
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

router.delete('/:id/activities/:activityId', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const activityId = parseInt(req.params.activityId, 10);
    if (Number.isNaN(id) || Number.isNaN(activityId)) return res.status(400).json({ error: 'id inválido' });
    await deleteActivity(id, activityId);
    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

/**
 * GET /api/camps/:id/public
 * Página pública de un campamento (para /camp/:id).
 */
router.get('/:id/public', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const camp = await getCampPublicPage(id);
    if (!camp) return res.status(404).json({ error: 'Campamento no encontrado' });
    return res.json(camp);
  } catch (error) {
    console.error('Error al obtener página pública:', error);
    res.status(500).json({ error: 'Error al obtener el campamento' });
  }
});

/**
 * POST /api/camps/:id/publicidad
 * Guarda la plantilla de publicidad y publica el campamento.
 * Body: { paletteId, title, bodyText, contactEmail, contactPhone, images: string[] }
 */
router.post('/:id/publicidad', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const body = req.body || {};
    const publicidadData = {
      paletteId: body.paletteId ?? 'verde',
      title: body.title ?? '',
      bodyText: body.bodyText ?? '',
      contactEmail: body.contactEmail ?? '',
      contactPhone: body.contactPhone ?? '',
      images: Array.isArray(body.images) ? body.images : [],
    };
    const camp = await updateCampPublicidad(id, publicidadData);
    return res.json({ success: true, camp });
  } catch (error) {
    console.error('Error al guardar publicidad:', error);
    res.status(500).json({ error: 'Error al guardar la plantilla' });
  }
});

/**
 * PATCH /api/camps/:id/extra
 * Actualiza datos extra del campamento: ubicación, capacidad, trabajadores, contacto corporativo.
 * Body: { location?, capacity?, workers?, contacto_corporativo? }
 */
router.patch('/:id/extra', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const body = req.body || {};
    const camp = await updateCampExtra(id, {
      location: body.location,
      capacity: body.capacity,
      workers: body.workers,
      contacto_corporativo: body.contacto_corporativo,
    });
    return res.json(camp);
  } catch (error) {
    console.error('Error al guardar datos extra:', error);
    res.status(500).json({ error: 'Error al guardar los datos' });
  }
});

/**
 * POST /api/camps/:id/builder
 * Guarda los datos del Camp Builder (bypassing RLS via backend).
 */
router.post('/:id/builder', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });

    // Validar body
    const { camp_details, description, publicidad_data } = req.body;
    if (!camp_details) return res.status(400).json({ error: 'Faltan datos del builder' });

    const camp = await updateCampBuilderData(id, {
      camp_details,
      description,
      publicidad_data
    });

    return res.json({ success: true, camp });
  } catch (error) {
    console.error('Error al guardar datos del builder:', error);
    res.status(500).json({ error: 'Error al guardar el campamento' });
  }
});

export default router;



