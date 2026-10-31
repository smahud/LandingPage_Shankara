"use client";

import { ChevronDown, CalendarCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, HERO, UI, waLink, WA_MESSAGES } from "@/lib/content";
import { useLang } from "./language-context";

/* Perf 2026-10-31 (LCP):
   1. Background hero = AVIF via <picture> (fallback WebP), di-preload di <head>
      dengan fetchpriority=high — browser modern ambil AVIF ±56KB (webp 92KB).
   2. SEMUA animasi masuk = CSS murni (.anim-hero-* di globals.css). Dulu
      framer-motion menahan konten hero pada opacity:0 sampai JS selesai
      hydrate → LCP mobile 4.8s. CSS animation paint sebelum hydration.
   3. Tidak ada lib JS animasi di bundle lagi. */
export function Hero() {
  const { lang, t } = useLang();
  const bookLink = waLink(CONTACT.waMain, WA_MESSAGES.general[lang]);

  return (
    <section id="home" className="relative isolate overflow-hidden bg-forest-950">
      {/* Preload LCP image — React 19 hoists <link> ke <head> */}
      <link rel="preload" as="image" href="/images/hero-yoga.avif" fetchPriority="high" />

      {/* LCP KRITIS: background TANPA -z-10. Chrome mengecualikan <img>
          di dalam container ber-z-index negatif dari kandidat LCP — biang
          keladi LCP 4.8s versi lama. Konten di atas via relative z-10. */}
      <div className="hero-zoom absolute inset-0">
        <picture>
          <source srcSet="/images/hero-yoga.avif" type="image/avif" />
          <img
            src="/images/hero-yoga.webp"
            alt={lang === "id" ? "Latihan yoga di taman terbuka Shankara" : "Outdoor yoga practice at Shankara"}
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-900/45 to-forest-950/90" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_75%_60%_at_50%_38%,transparent_0%,rgba(10,27,19,0.35)_100%)]" />
      </div>

      {/* Decorative gold ring (z-0: di bawah konten, di atas foto background) */}
      <div
        aria-hidden="true"
        className="float-slow pointer-events-none absolute -right-24 top-1/4 z-0 h-72 w-72 rounded-full border border-gold-500/20 sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-10 z-0 h-72 w-72 rounded-full border border-cream/10"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 pb-28 pt-32 text-center sm:px-6 lg:px-8">
        <div className="anim-hero-1 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-forest-900/60 px-4 py-2 text-[9.5px] font-medium uppercase tracking-[0.16em] text-gold-300 backdrop-blur-sm sm:px-5 sm:text-[11px] sm:tracking-[0.28em]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {t(HERO.eyebrow)}
        </div>

        <h1 className="anim-hero-2 font-display mt-7 max-w-4xl text-balance text-[2.4rem] leading-[1.08] text-cream sm:text-6xl lg:text-7xl">
          {t(HERO.title1)}{" "}
          <span className="relative sm:whitespace-nowrap">
            <span className="bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent">
              {t(HERO.title2)}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 320 14"
              className="absolute -bottom-3 left-0 h-3 w-full text-gold-500/70"
              preserveAspectRatio="none"
            >
              <path
                d="M4 10 C 80 2, 240 2, 316 8"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        </h1>

        <p className="anim-hero-3 mt-7 max-w-xl text-balance text-base leading-relaxed text-cream/80 sm:text-lg">
          {t(HERO.desc)}
        </p>

        <div className="anim-hero-4 mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group h-14 gap-2.5 rounded-full bg-gold-500 px-8 text-base font-semibold text-forest-950 shadow-[0_18px_40px_-12px_rgba(196,162,101,0.55)] transition-all hover:bg-gold-400 hover:shadow-[0_22px_48px_-12px_rgba(196,162,101,0.7)]"
          >
            <a href={bookLink} target="_blank" rel="noopener noreferrer">
              <CalendarCheck className="h-5 w-5 transition-transform group-hover:-rotate-6" aria-hidden="true" />
              {t(UI.book)}
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-14 rounded-full border border-cream/25 px-8 text-base text-cream/90 hover:bg-cream/10 hover:text-cream"
          >
            <a href="#services">{t(HERO.cta2)}</a>
          </Button>
        </div>

        {/* Quick facts strip */}
        <dl className="anim-hero-5 mt-16 grid w-full max-w-2xl grid-cols-3 divide-x divide-cream/15 rounded-3xl border border-cream/15 bg-forest-900/50 py-5 backdrop-blur-md">
          {[
            { v: "4", l: { id: "Pilar Layanan", en: "Service Pillars" } },
            { v: "50", l: { id: "Kapasitas Aula", en: "Hall Capacity" } },
            { v: "2–7", l: { id: "Tamu / Unit", en: "Guests / Unit" } },
          ].map((f) => (
            <div key={f.v} className="px-2 text-center">
              <dt className="font-display text-2xl text-gold-300 sm:text-3xl">{f.v}</dt>
              <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cream/60">
                {lang === "id" ? f.l.id : f.l.en}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label={t(HERO.scroll)}
        className="anim-hero-cue absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-cream/85 transition-colors hover:text-gold-300 md:flex"
      >
        <span className="rounded-full border border-cream/25 bg-forest-950/45 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm">{t(HERO.scroll)}</span>
        <span className="anim-hero-bounce">
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
