
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}


import fs from 'fs';

const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
    console.log(msg);
    fs.appendFileSync('debug-result.txt', msg + '\n');
}

// Clear previous log
fs.writeFileSync('debug-result.txt', '');

log('Starting debug-db.js...');
log('Supabase URL:' + supabaseUrl);
// console.log('Supabase Key:', supabaseKey); // Don't log key fully for security

async function checkCamps() {
    log('Function checkCamps started.');
    try {
        log('Querying camps table...');
        const { data, error } = await supabase
            .from('camps')
            .select('id, name, publicidad_published, camp_details, publicidad_data')
            .limit(10);

        if (error) {
            log('Error fetching camps: ' + JSON.stringify(error));
            return;
        }

        log(`Found ${data?.length || 0} camps.`);

        if (data && data.length > 0) {
            data.forEach(camp => {
                log(`Camp ID: ${camp.id}, Name: ${camp.name}, Published: ${camp.publicidad_published}`);
                log(`Has camp_details? ${!!camp.camp_details}`);
                log(`Has publicidad_data? ${!!camp.publicidad_data}`);
                if (camp.publicidad_data) {
                    log('publicidad_data keys: ' + JSON.stringify(Object.keys(camp.publicidad_data)));
                }
                log('-------------------');
            });
        } else {
            log('No camps found.');
        }

    } catch (err) {
        log('Unexpected error in checkCamps: ' + err);
    }
    log('Function checkCamps finished.');
}

checkCamps().catch(err => log('Top level error: ' + err));
