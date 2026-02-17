
import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../supabaseClient.js';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to ensure bucket exists
async function ensureBucket() {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.find(b => b.name === 'camp-images');
    if (!exists) {
        console.log('Creating camp-images bucket...');
        await supabase.storage.createBucket('camp-images', {
            public: true,
            fileSizeLimit: 5242880,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
        });
    }
}

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { campId, prefix } = req.body;
        if (!campId) {
            return res.status(400).json({ error: 'campId is required' });
        }

        // Ensure bucket exists before uploading
        await ensureBucket();

        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${campId}/${prefix || 'image'}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('camp-images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('camp-images')
            .getPublicUrl(fileName);

        res.json({ publicUrl: data.publicUrl });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
});

export default router;
