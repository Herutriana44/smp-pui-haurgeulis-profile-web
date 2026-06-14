-- Seeder & operasi server memakai SUPABASE_SERVICE_ROLE_KEY (JWT role = service_role).
-- Policy "Auth all ... authenticated" tidak cocok dengan JWT service_role, sehingga INSERT/UPDATE/DELETE
-- dari skrip seed ditolak. Storage sudah punya policy service_role (006); tabel konten perlu policy serupa.

-- Tabel dari 001_initial (selalu ada setelah migrasi pertama)
DROP POLICY IF EXISTS "Service role all hero" ON hero;
CREATE POLICY "Service role all hero" ON hero FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all hero_stats" ON hero_stats;
CREATE POLICY "Service role all hero_stats" ON hero_stats FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all about" ON about;
CREATE POLICY "Service role all about" ON about FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all visi_misi" ON visi_misi;
CREATE POLICY "Service role all visi_misi" ON visi_misi FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all visi_misi_values" ON visi_misi_values;
CREATE POLICY "Service role all visi_misi_values" ON visi_misi_values FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all programs" ON programs;
CREATE POLICY "Service role all programs" ON programs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all program_items" ON program_items;
CREATE POLICY "Service role all program_items" ON program_items FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all contact" ON contact;
CREATE POLICY "Service role all contact" ON contact FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all navbar" ON navbar;
CREATE POLICY "Service role all navbar" ON navbar FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all footer" ON footer;
CREATE POLICY "Service role all footer" ON footer FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all facilities" ON facilities;
CREATE POLICY "Service role all facilities" ON facilities FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all teachers" ON teachers;
CREATE POLICY "Service role all teachers" ON teachers FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all gallery_images" ON gallery_images;
CREATE POLICY "Service role all gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all testimonials" ON testimonials;
CREATE POLICY "Service role all testimonials" ON testimonials FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

DROP POLICY IF EXISTS "Service role all instagram_posts" ON instagram_posts;
CREATE POLICY "Service role all instagram_posts" ON instagram_posts FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Tabel dari migrasi lanjutan (hanya jika sudah ada)
DO $$
BEGIN
  IF to_regclass('public.site_seo') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role all site_seo" ON site_seo';
    EXECUTE $p$CREATE POLICY "Service role all site_seo" ON site_seo FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true)$p$;
  END IF;

  IF to_regclass('public.extracurriculars') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role all extracurriculars" ON extracurriculars';
    EXECUTE $p$CREATE POLICY "Service role all extracurriculars" ON extracurriculars FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true)$p$;
  END IF;

  IF to_regclass('public.extracurricular_items') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role all extracurricular_items" ON extracurricular_items';
    EXECUTE $p$CREATE POLICY "Service role all extracurricular_items" ON extracurricular_items FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true)$p$;
  END IF;

  IF to_regclass('public.chatbot_settings') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role all chatbot_settings" ON chatbot_settings';
    EXECUTE $p$CREATE POLICY "Service role all chatbot_settings" ON chatbot_settings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true)$p$;
  END IF;

  IF to_regclass('public.chatbot_faq') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role all chatbot_faq" ON chatbot_faq';
    EXECUTE $p$CREATE POLICY "Service role all chatbot_faq" ON chatbot_faq FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true)$p$;
  END IF;

  IF to_regclass('public.chatbot_keywords') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role all chatbot_keywords" ON chatbot_keywords';
    EXECUTE $p$CREATE POLICY "Service role all chatbot_keywords" ON chatbot_keywords FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true)$p$;
  END IF;
END $$;
