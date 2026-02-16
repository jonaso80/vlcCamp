-- Ejecutar en el SQL Editor de Supabase.
-- Plantilla de publicidad:
ALTER TABLE camps ADD COLUMN IF NOT EXISTS publicidad_data jsonb;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS publicidad_published boolean DEFAULT false;
-- Datos extra:
ALTER TABLE camps ADD COLUMN IF NOT EXISTS capacity integer;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS workers integer;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS contacto_corporativo text;
