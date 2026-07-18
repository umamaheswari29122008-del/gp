/*
# Create site_content table for admin-editable page content

1. New Tables
- `site_content`: single-row table storing all editable site content as JSONB.
  - `id` (int, primary key, always 1) — enforces single-row pattern.
  - `data` (jsonb, not null) — the full SiteContent object the React app renders.
  - `updated_at` (timestamptz) — last modification time.

2. Security
- Enable RLS on `site_content`.
- Single-tenant, no sign-in: allow anon + authenticated full CRUD so the
  public site (anon key) can read and the admin panel can write.

3. Notes
- The React app reads `data` from the single row (id=1) on load.
- The admin panel updates the same row. A trigger keeps `updated_at` fresh.
*/

CREATE TABLE IF NOT EXISTS site_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_content" ON site_content;
CREATE POLICY "anon_read_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_content" ON site_content;
CREATE POLICY "anon_insert_content" ON site_content FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_content" ON site_content;
CREATE POLICY "anon_update_content" ON site_content FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_content" ON site_content;
CREATE POLICY "anon_delete_content" ON site_content FOR DELETE
  TO anon, authenticated USING (true);

-- Seed the row so the app always finds id=1
INSERT INTO site_content (id, data) VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
