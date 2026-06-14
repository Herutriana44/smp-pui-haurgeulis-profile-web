-- Update metadata default untuk SMP PUI HAURGEULIS (setelah migrasi site_seo ada)
UPDATE site_seo SET
  site_name = 'SMP PUI HAURGEULIS',
  short_name = 'SMP PUI',
  description = 'SMP PUI HAURGEULIS — Sekolah Menengah Pertama Persatuan Umat Islam di Haurgeulis. Kurikulum Merdeka, karakter Islami, literasi & numerasi, serta ekstrakurikuler lengkap.',
  keywords = '["SMP PUI","SMP PUI HAURGEULIS","SMP Haurgeulis","SMP Indramayu","SMP Swasta Haurgeulis","Persatuan Umat Islam","SMP Islam Haurgeulis"]'::jsonb,
  title_template = 'SMP PUI HAURGEULIS — Pendidikan Menengah di Haurgeulis',
  open_graph_image = '/images/foto2/logo_preview_rev_1.png',
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000001';
