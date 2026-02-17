
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
    console.log('Checking storage buckets...');
    const bucketName = 'camp-images';

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const exists = buckets.find(b => b.name === bucketName);

    if (exists) {
        console.log(`Bucket '${bucketName}' already exists.`);
    } else {
        console.log(`Creating bucket '${bucketName}'...`);
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
        });

        if (createError) {
            console.error('Error creating bucket:', createError);
            return;
        }
        console.log(`Bucket '${bucketName}' created successfully.`);
    }

    // Since we can't easily set policies via JS client (usually requires SQL), 
    // we assume 'public: true' in createBucket handles the basic need for reading.
    // For writing, if we use the anon key in frontend, we need RLS policies.
    // However, if we don't have SQL access via JS, we might need to instruct user or use service key proxy.

    // Actually, let's verify if we can upload a test file using the service key just to be sure backend can write.
    console.log('Test upload...');
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload('test.txt', Buffer.from('Hello World'), { upsert: true });

    if (uploadError) {
        console.error('Test upload failed:', uploadError);
    } else {
        console.log('Test upload successful:', uploadData);
        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl('test.txt');
        console.log('Public URL:', publicUrl);
    }
}

setupStorage();
