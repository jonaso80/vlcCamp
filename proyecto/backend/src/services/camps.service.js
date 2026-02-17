import { supabase } from '../supabaseClient.js';

export async function getAllCamps() {
  const { data, error } = await supabase
    .from('camps')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Marca como confirmado el campamento cuyo contact_email coincide con el email.
 * Devuelve el campamento actualizado o null si no hay ninguno.
 */
export async function confirmCampByEmail(email) {
  const { data, error } = await supabase
    .from('camps')
    .update({ status: 'confirmed' })
    .eq('contact_email', email)
    .eq('status', 'pending')
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Obtiene el campamento del usuario por email (contact_email o user_email).
 */
export async function getCampByUserEmail(email) {
  const { data: byContact, error: errContact } = await supabase
    .from('camps')
    .select('*')
    .eq('contact_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errContact) throw errContact;
  if (byContact) return byContact;

  const { data: byUser, error: errUser } = await supabase
    .from('camps')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errUser) throw errUser;
  return byUser;
}

/**
 * Lista de campamentos con publicidad publicada (para "Campamentos que confían en nosotros").
 * En Supabase, la tabla camps debe tener: publicidad_data (jsonb), publicidad_published (boolean).
 * SQL: ALTER TABLE camps ADD COLUMN IF NOT EXISTS publicidad_data jsonb; ALTER TABLE camps ADD COLUMN IF NOT EXISTS publicidad_published boolean DEFAULT false;
 */
export async function getPublishedCamps() {
  const { data, error } = await supabase
    .from('camps')
    .select('id, name, location, publicidad_data')
    .eq('publicidad_published', true)
    .order('id', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Datos de la página pública de un campamento (para /camp/:id).
 */
export async function getCampPublicPage(id) {
  const { data, error } = await supabase
    .from('camps')
    .select('id, name, location, publicidad_data, camp_details')
    .eq('id', id)
    .eq('publicidad_published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Guarda la plantilla de publicidad y marca el campamento como publicado.
 * @param {number} campId
 * @param {object} publicidadData - { paletteId, title, bodyText, contactEmail, contactPhone, images }
 */
export async function updateCampPublicidad(campId, publicidadData) {
  const { data, error } = await supabase
    .from('camps')
    .update({
      publicidad_data: publicidadData,
      publicidad_published: true,
    })
    .eq('id', campId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza los datos extra del campamento (ubicación, capacidad, trabajadores, contacto corporativo).
 * Columnas en Supabase: capacity (integer), workers (integer), contacto_corporativo (text). location ya existe.
 */
export async function updateCampExtra(campId, { location, capacity, workers, contacto_corporativo }) {
  const payload = {};
  if (location !== undefined) payload.location = location;
  if (capacity !== undefined) payload.capacity = capacity == null || capacity === '' ? null : (typeof capacity === 'number' ? capacity : parseInt(capacity, 10));
  if (workers !== undefined) payload.workers = workers == null || workers === '' ? null : (typeof workers === 'number' ? workers : parseInt(workers, 10));
  if (contacto_corporativo !== undefined) payload.contacto_corporativo = contacto_corporativo || null;

  const { data, error } = await supabase
    .from('camps')
    .update(payload)
    .eq('id', campId)
    .select()
    .single();

  if (error) throw error;
  return data;
}


/**
 * Actualiza los datos del Camp Builder (detalles, descripción, publicidad).
 */
export async function updateCampBuilderData(campId, { camp_details, description, publicidad_data }) {
  const { data, error } = await supabase
    .from('camps')
    .update({
      camp_details,
      description,
      publicidad_data,
      publicidad_published: true
    })
    .eq('id', campId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
