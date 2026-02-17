
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Faltan claves de Supabase');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testGetCamp(email) {
    console.log(`Buscando campamento para: ${email}`);

    // Lógica idéntica a getCampByUserEmail del servicio
    const { data: byContact, error: errContact } = await supabase
        .from('camps')
        .select('*')
        .eq('contact_email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (errContact) {
        console.error('Error buscando por contact_email:', errContact);
    } else if (byContact) {
        console.log('Encontrado por contact_email:', byContact);
        return;
    }

    const { data: byUser, error: errUser } = await supabase
        .from('camps')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (errUser) {
        console.error('Error buscando por user_email:', errUser);
    } else {
        console.log('Encontrado por user_email:', byUser);
    }
}

// Puedes cambiar este email por uno que sepas que tiene un campamento pendiente
const targetEmail = process.argv[2] || 'test@example.com';
testGetCamp(targetEmail);
