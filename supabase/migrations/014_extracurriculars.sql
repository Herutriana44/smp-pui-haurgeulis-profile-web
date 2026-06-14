-- Ekstrakurikuler SMP (section + items)
CREATE TABLE extracurriculars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  lead TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE extracurricular_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extracurriculars_id UUID REFERENCES extracurriculars(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  detail TEXT DEFAULT '',
  icon_image_url TEXT,
  features JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0
);

ALTER TABLE extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracurricular_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read extracurriculars" ON extracurriculars FOR SELECT USING (true);
CREATE POLICY "Public read extracurricular_items" ON extracurricular_items FOR SELECT USING (true);
CREATE POLICY "Auth all extracurriculars" ON extracurriculars FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all extracurricular_items" ON extracurricular_items FOR ALL USING (auth.role() = 'authenticated');
