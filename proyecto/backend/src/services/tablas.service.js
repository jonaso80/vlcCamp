import { supabase } from '../supabaseClient.js';

/** Niños: listar por campamento */
export async function getChildrenByCampId(campId) {
  const { data, error } = await supabase
    .from('camp_children')
    .select('*')
    .eq('camp_id', campId)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

/** Niños: crear */
export async function createChild(campId, body) {
  const { data, error } = await supabase
    .from('camp_children')
    .insert({
      camp_id: campId,
      nombre: body.nombre ?? '',
      apellidos: body.apellidos ?? null,
      padre_madre_tutor: body.padre_madre_tutor ?? null,
      edad: body.edad != null && body.edad !== '' ? parseInt(body.edad, 10) : null,
      dias_en_campamento: body.dias_en_campamento != null && body.dias_en_campamento !== '' ? parseInt(body.dias_en_campamento, 10) : null,
      limitaciones: body.limitaciones ?? null,
      alergias: body.alergias ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Niños: actualizar */
export async function updateChild(campId, childId, body) {
  const payload = {};
  if (body.nombre !== undefined) payload.nombre = body.nombre;
  if (body.apellidos !== undefined) payload.apellidos = body.apellidos;
  if (body.padre_madre_tutor !== undefined) payload.padre_madre_tutor = body.padre_madre_tutor;
  if (body.edad !== undefined) payload.edad = body.edad === '' || body.edad == null ? null : parseInt(body.edad, 10);
  if (body.dias_en_campamento !== undefined) payload.dias_en_campamento = body.dias_en_campamento === '' || body.dias_en_campamento == null ? null : parseInt(body.dias_en_campamento, 10);
  if (body.limitaciones !== undefined) payload.limitaciones = body.limitaciones;
  if (body.alergias !== undefined) payload.alergias = body.alergias;

  const { data, error } = await supabase
    .from('camp_children')
    .update(payload)
    .eq('id', childId)
    .eq('camp_id', campId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Niños: eliminar */
export async function deleteChild(campId, childId) {
  const { error } = await supabase
    .from('camp_children')
    .delete()
    .eq('id', childId)
    .eq('camp_id', campId);

  if (error) throw error;
}

/** Actividades: listar por campamento */
export async function getActivitiesByCampId(campId) {
  const { data, error } = await supabase
    .from('camp_activities')
    .select('*')
    .eq('camp_id', campId)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

/** Actividades: crear */
export async function createActivity(campId, body) {
  const { data, error } = await supabase
    .from('camp_activities')
    .insert({
      camp_id: campId,
      nombre: body.nombre ?? '',
      categoria: body.categoria ?? null,
      capacidad_ninos: body.capacidad_ninos != null && body.capacidad_ninos !== '' ? parseInt(body.capacidad_ninos, 10) : null,
      monitor_a_cargo: body.monitor_a_cargo ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Actividades: actualizar */
export async function updateActivity(campId, activityId, body) {
  const payload = {};
  if (body.nombre !== undefined) payload.nombre = body.nombre;
  if (body.categoria !== undefined) payload.categoria = body.categoria;
  if (body.capacidad_ninos !== undefined) payload.capacidad_ninos = body.capacidad_ninos === '' || body.capacidad_ninos == null ? null : parseInt(body.capacidad_ninos, 10);
  if (body.monitor_a_cargo !== undefined) payload.monitor_a_cargo = body.monitor_a_cargo;

  const { data, error } = await supabase
    .from('camp_activities')
    .update(payload)
    .eq('id', activityId)
    .eq('camp_id', campId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Actividades: eliminar */
export async function deleteActivity(campId, activityId) {
  const { error } = await supabase
    .from('camp_activities')
    .delete()
    .eq('id', activityId)
    .eq('camp_id', campId);

  if (error) throw error;
}
