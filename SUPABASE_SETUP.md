# Setup Supabase untuk Admin Panel

## 1. Buat Proyek Supabase

1. Buka [supabase.com](https://supabase.com) dan buat proyek baru
2. Catat **Project URL** dan **API Keys** (anon key, service role key)

## 2. Environment Variables

Copy `.env.example` ke `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Jalankan SQL Migration

1. Buka Supabase Dashboard > SQL Editor
2. Jalankan isi file `supabase/migrations/001_initial.sql`
3. Jalankan isi file `supabase/migrations/002_storage.sql`
4. Jalankan isi file `supabase/migrations/003_chatbot_settings.sql`
5. Jalankan isi file `supabase/migrations/004_chatbot_model.sql`

Atau buat bucket `assets` secara manual di Storage jika migration storage gagal.

## 4. Buat Admin User

1. Buka Supabase Dashboard > Authentication > Users
2. Klik "Add user" > "Create new user"
3. Masukkan email dan password untuk admin

## 5. Jalankan Seeder

Pastikan file **`.env.local`** ada di **root project** (folder yang sama dengan `package.json`) dan berisi:

- `NEXT_PUBLIC_SUPABASE_URL` — URL proyek (`https://xxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` — secret **service_role** dari Dashboard → **Settings → API** (JWT panjang, biasanya dimulai `eyJ...`), **bukan** anon / publishable key.

Jika log menulis `injecting env (0) from .env.local`, berarti isi file tidak terbaca: periksa tidak ada spasi sebelum nama variabel, satu `=` per baris, dan tidak ada karakter aneh di awal file (BOM).

Error **`42501`** (`permission denied for schema public` atau `permission denied for table`):  
1) Jalankan **`019_restore_public_api_grants.sql`** (grant ulang ke tabel/sequence untuk `anon` / `authenticated` / `service_role`).  
2) Jika perlu, **`018_grant_public_schema_usage.sql`**.  
Tanpa grant pada **tabel**, `USAGE` pada schema saja tidak cukup.

Tanpa **service role** yang benar, unggah ke Storage bisa tetap berhasil (policy berbeda), sementara **baca/tulis tabel** lewat PostgREST gagal.

Jalankan migrasi SQL hingga **`019_restore_public_api_grants.sql`** (wajib jika masih error 42501 setelah 018), **`018_grant_public_schema_usage.sql`**, dan **`017_rls_service_role_tables.sql`** (atau `supabase db push`), lalu:

```bash
npm run seed
```

Seeder akan:
- Membaca data dari folder `data/`
- Mengunggah gambar dari `public/` ke bucket Storage `assets` (jika file ada)
- Memasukkan data ke database

Jika seed gagal, pesan error sekarang menampilkan kode PostgREST (mis. `42501` permission denied) agar mudah dilacak.

**Catatan:** Jika path gambar di JSON tidak ada di disk, seeder menyimpan URL path lokal; Anda bisa mengunggah lewat Admin Panel.

## 6. Akses Admin Panel

1. Jalankan `npm run dev`
2. Buka `/admin/login`
3. Login dengan email dan password admin yang dibuat di step 4

## Struktur Admin

- `/admin` - Dashboard
- `/admin/hero` - Edit Hero section
- `/admin/about` - Edit Tentang
- `/admin/visi-misi` - Edit Visi & Misi
- `/admin/programs` - Edit Program
- `/admin/facilities` - CRUD Fasilitas
- `/admin/teachers` - CRUD Guru
- `/admin/gallery` - CRUD Galeri
- `/admin/testimonials` - CRUD Testimoni
- `/admin/contact` - Edit Kontak
- `/admin/navbar` - Edit Navbar
- `/admin/footer` - Edit Footer
- `/admin/instagram` - CRUD Instagram posts
- `/admin/chatbot` - Pengaturan Chatbot (API key Gemini, aktif/nonaktif)

## Chatbot

Chatbot muncul di pojok kanan bawah website profile. API key Gemini disimpan di database (bukan .env). Dapatkan API key di [Google AI Studio](https://aistudio.google.com/apikey).

## Fallback ke JSON

Jika env Supabase tidak di-set, website akan otomatis memakai data dari folder `data/` (JSON files) seperti sebelumnya.
