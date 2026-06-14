-- Mengatasi error PostgreSQL 42501 "permission denied for schema public" saat akses tabel via PostgREST
-- (mis. npm run seed dengan service role). Beberapa proyek / versi Postgres membatasi default privilege pada schema public.

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
