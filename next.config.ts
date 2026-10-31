import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    /* Gambar sudah dioptimasi manual (PIL → WebP/AVIF, hero-yoga.avif 56KB).
     * Dengan unoptimized, URL gambar = /images/* LANGSUNG (punya ekstensi)
     * sehingga ter-cache di edge Cloudflare global — beda dengan /_next/image
     * yang selalu cf-cache-status: DYNAMIC (bolak-balik origin tiap request).
     * LCP hero kini <picture> AVIF/WebP di hero.tsx. */
    unoptimized: true,
  },
  async headers() {
    return [
      {
        /* Edge-cache semua aset media 1 tahun + immutable (audit GTmetrix
         * "uses-long-cache-ttl"; perubahan gambar = rename file). */
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        /* Early Hints-ready: browser bisa mulai unduh gambar LCP SEBELUM
         * HTML selesai dikirim (Cloudflare mengubah Link header + 103 Early
         * Hints bila fitur aktif di zone). Kandidat LCP = hero AVIF. */
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</images/hero-yoga.avif>; rel="preload"; as="image"; fetchpriority="high"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
