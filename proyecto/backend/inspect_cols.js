
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function inspectCamps() {
    const { data, error } = await supabase
        .from('camps')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching from camps:', error);
    } else if (data && data.length > 0) {
        console.log('Columns in camps table:', Object.keys(data[0]));
    } else {
        console.log('No rows in camps table to inspect columns.');
    }
}

inspectCamps();
