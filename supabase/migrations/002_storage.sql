-- Storage bucket for assets (images, etc.)
-- Run after 001_initial.sql
-- Or create via Supabase Dashboard: Storage > New bucket > name: assets, public: true

INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for assets
CREATE POLICY "Public read assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Authenticated users can upload
CREATE POLICY "Auth insert assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Auth update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Auth delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
