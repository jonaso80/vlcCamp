-- Add camp_details column to store builder data (JSONB)
ALTER TABLE camps 
ADD COLUMN IF NOT EXISTS camp_details JSONB DEFAULT '{}'::jsonb;

-- Create an index for faster querying if needed (optional for now)
-- CREATE INDEX IF NOT EXISTS idx_camps_camp_details ON camps USING gin (camp_details);

-- Comment on column
COMMENT ON COLUMN camps.camp_details IS 'Stores the full configuration from Camp Builder (Identity, Content, Trust, Schedule)';
