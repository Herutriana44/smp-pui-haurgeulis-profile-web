-- Allow service_role to upload/update/delete in storage (for seed script & server-side ops)
-- Run after 002_storage.sql
-- RLS: any matching policy allows the operation

CREATE POLICY "Service role insert assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'service_role');

CREATE POLICY "Service role update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets' AND auth.role() = 'service_role');
