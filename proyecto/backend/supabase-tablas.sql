-- Ejecutar en el SQL Editor de Supabase.
-- Tabla de niños por campamento (columnas: id, nombre, apellidos, padre/madre/tutor, edad, dias_en_campamento, limitaciones, alergias)
CREATE TABLE IF NOT EXISTS camp_children (
  id bigserial PRIMARY KEY,
  camp_id bigint NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  apellidos text,
  padre_madre_tutor text,
  edad integer,
  dias_en_campamento integer,
  limitaciones text,
  alergias text,
  created_at timestamptz DEFAULT now()
);

-- Tabla de actividades por campamento (idActividad, nombre, categoria, capacidadNiños, monitorACargo)
CREATE TABLE IF NOT EXISTS camp_activities (
  id bigserial PRIMARY KEY,
  camp_id bigint NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  categoria text,
  capacidad_ninos integer,
  monitor_a_cargo text,
  created_at timestamptz DEFAULT now()
);

-- Índices para consultas por camp_id
CREATE INDEX IF NOT EXISTS idx_camp_children_camp_id ON camp_children(camp_id);
CREATE INDEX IF NOT EXISTS idx_camp_activities_camp_id ON camp_activities(camp_id);