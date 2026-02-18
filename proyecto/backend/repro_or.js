
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

async function testOrFilter(email) {
    console.log(`Testing .or filter with: ${email}`);

    try {
        const { data, error } = await supabase
            .from('camps')
            .select('*')
            .or(`contact_email.eq.${email},user_email.eq.${email}`)
            .limit(1);

        if (error) {
            console.error('❌ Error with unquoted .or filter:', error);
        } else {
            console.log('✅ Unquoted .or filter worked!');
        }
    } catch (e) {
        console.error('❌ Threw error with unquoted .or filter:', e);
    }

    try {
        const { data, error } = await supabase
            .from('camps')
            .select('*')
            .or(`contact_email.eq."${email}",user_email.eq."${email}"`)
            .limit(1);

        if (error) {
            console.error('❌ Error with quoted .or filter:', error);
        } else {
            console.log('✅ Quoted .or filter worked!');
        }
    } catch (e) {
        console.error('❌ Threw error with quoted .or filter:', e);
    }
}

const targetEmail = process.argv[2] || 'test@example.com';
testOrFilter(targetEmail);
