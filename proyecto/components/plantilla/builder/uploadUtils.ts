
import { supabase } from '../../../supabaseClient';

/**
 * Sube una imagen al bucket 'camp-images' en Supabase.
 * Retorna la URL pública.
 */
/**
 * Sube una imagen a través del backend (proxy) para evitar problemas de RLS/Bucket.
 */
export async function uploadImage(file: File, campId: number, prefix: string = 'image'): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('campId', campId.toString());
        formData.append('prefix', prefix);

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Error uploading image');
        }

        const data = await res.json();
        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
