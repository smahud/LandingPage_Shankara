import type { Metadata, Viewport } from "next";
import { Marcellus, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  /* Perf: TANPA preload — 48KB bandwidth high-priority lebih baik dipakai
     oleh LCP image (hero AVIF). Body text swap dari font sistem (swap),
     Marcellus (14KB, font judul brand) tetap di-preload. */
  preload: false,
});

const SITE_URL = "https://shankarawell.yapsidarussalam.or.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shankara Wellness & Sanctuary — Glamping, Reflexology & Holistic Wellness di Kota Batu",
    template: "%s | Shankara Wellness & Sanctuary",
  },
  description:
    "Ruang transformasi holistik di Kota Batu, Jawa Timur: glamping piramida & tenda alami, reflexology & healing therapy, gerak tubuh holistik & meditasi, serta workshop pengembangan diri. Booking mudah via WhatsApp.",
  keywords: [
    "Shankara Wellness",
    "glamping Batu",
    "reflexology Kota Batu",
    "healing therapy",
    "meditasi",
    "yoga Batu",
    "wellness Jawa Timur",
    "workshop self development",
    "pijat tradisional Batu",
    "Self Transformation Program",
  ],
  authors: [{ name: "Shankara Wellness & Sanctuary" }],
  alternates: {
    canonical: "/",
    languages: { id: "/", en: "/?lang=en" },
  },
  openGraph: {
    title: "Shankara Wellness & Sanctuary — Experience Your Self-Upgrade",
    description:
      "Temukan kembali keseimbangan tubuh, ketenangan pikiran, dan kejernihan jiwa melalui pengalaman wellness terpadu di kaki alam Kota Batu.",
    url: SITE_URL,
    siteName: "Shankara Wellness & Sanctuary",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/images/hero-yoga.webp", width: 600, height: 400, alt: "Yoga holistik di alam terbuka Shankara Wellness & Sanctuary" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shankara Wellness & Sanctuary",
    description: "Experience Your Self-Upgrade — wellness terpadu di Kota Batu.",
    images: ["/images/hero-yoga.webp"],
  },
  icons: { icon: "/images/logo-lotus.webp" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a1b13",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Shankara Wellness & Sanctuary",
  description:
    "Ruang transformasi holistik yang menggabungkan glamping alami, reflexology & healing therapy, gerak tubuh holistik & meditasi, serta workshop pengembangan diri.",
  url: SITE_URL,
  telephone: "+6287742765221",
  image: `${SITE_URL}/images/hero-yoga.webp`,
  logo: `${SITE_URL}/images/logo-lotus.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jalan Lingkar Barat, Kehutanan, Kec. Batu",
    addressLocality: "Kota Batu",
    addressRegion: "Jawa Timur",
    postalCode: "65311",
    addressCountry: "ID",
  },
  priceRange: "Rp 150.000 - Rp 500.000+",
  sameAs: ["https://wa.me/6287742765221"],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wellness & Glamping Experience" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Reflexology & Healing Therapy" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Holistic Body Movement & Meditation" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Workshop & Self Development" } },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${marcellus.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}>
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
