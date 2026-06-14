-- Samakan path logo dengan aset baru (public/images/foto2/logo_preview_rev_1.png)
UPDATE site_seo SET
  open_graph_image = '/images/foto2/logo_preview_rev_1.png',
  updated_at = now()
WHERE open_graph_image = '/images/foto/logo.png';

UPDATE navbar SET
  brand_image_url = '/images/foto2/logo_preview_rev_1.png',
  updated_at = now()
WHERE brand_image_url = '/images/foto/logo.png';
