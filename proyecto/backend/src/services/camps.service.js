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



