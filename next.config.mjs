/** @type {import('next').NextConfig} */
let supabaseHost = null
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url) supabaseHost = new URL(url).hostname
} catch {}

// Supabase storage domains - allow images from project URL or *.supabase.co
const supabasePatterns = supabaseHost
  ? [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ]
  : [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: supabasePatterns,
  },
}

export default nextConfig
