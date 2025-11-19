-- Migration: Add collection_id and other missing columns to artworks table

-- Step 1: Add new columns
ALTER TABLE artworks ADD COLUMN collection_id INTEGER;
ALTER TABLE artworks ADD COLUMN year INTEGER;
ALTER TABLE artworks ADD COLUMN technique TEXT;
ALTER TABLE artworks ADD COLUMN dimensions TEXT;
ALTER TABLE artworks ADD COLUMN is_visible BOOLEAN DEFAULT 1;

-- Step 2: Copy section_id to collection_id (sections are now collections)
UPDATE artworks SET collection_id = section_id WHERE section_id IS NOT NULL;

-- Step 3: Remove old columns (optional - can keep for backward compatibility)
-- ALTER TABLE artworks DROP COLUMN section_id;
-- ALTER TABLE artworks DROP COLUMN description;
-- ALTER TABLE artworks DROP COLUMN date;
