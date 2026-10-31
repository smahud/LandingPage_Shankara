"use client";

import Image from "next/image";
import { Phone, MapPin, ArrowUp } from "lucide-react";
import { CONTACT, FOOTER, NAV, SERVICES, UI, waLink, WA_MESSAGES } from "@/lib/content";
import { useLang } from "./language-context";
import { LotusDivider } from "./reveal";

export function Footer() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative bg-forest-950 text-cream/80">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-12 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-1 ring-gold-500/40">
                <Image src="/images/logo-lotus.webp" alt="Logo Shankara — bunga lotus emas" width={30} height={30} className="object-contain" />
              </span>
              <p className="font-display text-lg leading-tight text-cream">
                Shankara
                <span className="block text-[10px] font-normal uppercase tracking-[0.3em] text-cream/50">
                  Wellness & Sanctuary
                </span>
              </p>
            </div>
            <LotusDivider className="mt-6" />
            <p className="mt-5 max-w-sm text-[14px] leading-[1.85] text-cream/60">{t(FOOTER.tagline)}</p>
          </div>

          {/* Company */}
          <nav className="md:col-span-2" aria-label="Footer — company">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300">
              {t(FOOTER.company)}
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => go(n.id)}
                    className="text-[14px] text-cream/65 transition-colors hover:text-gold-300"
                  >
                    {t(n.label)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="md:col-span-3" aria-label="Footer — services">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300">
              {t(FOOTER.services)}
            </h3>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href={waLink(CONTACT.waService, WA_MESSAGES[s.waKey][lang])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] leading-snug text-cream/65 transition-colors hover:text-gold-300"
                  >
                    {t(s.title)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Address */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300">
              {t(FOOTER.address)}
            </h3>
            <address className="mt-5 space-y-4 text-[13.5px] not-italic leading-relaxed text-cream/65">
              <p className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" aria-hidden="true" />
                {CONTACT.address.line}
              </p>
              <p>
                <a
                  href={`tel:${CONTACT.phoneHref.slice(4)}`}
                  className="inline-flex items-center gap-2 font-medium text-cream/80 hover:text-gold-300"
                >
                  <Phone className="h-4 w-4 text-gold-500/70" aria-hidden="true" />
                  {CONTACT.phoneDisplay}
                </a>
              </p>
            </address>
            <button
              onClick={() => go("home")}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-[12px] text-cream/60 transition-colors hover:border-gold-500/40 hover:text-gold-300"
              aria-label={lang === "id" ? "Kembali ke atas" : "Back to top"}
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              {lang === "id" ? "Ke atas" : "To top"}
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-7 text-[12.5px] text-cream/45 sm:flex-row">
          <p>
            © {year} Shankara Wellness & Sanctuary. {t(FOOTER.rights)}
          </p>
          <p className="flex items-center gap-1.5">
            {t(FOOTER.builtNote)}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Floating WhatsApp button, same spirit as the original site's chat bubble */
export function WhatsAppFab() {
  const { lang, t } = useLang();
  const link = waLink(CONTACT.waMain, WA_MESSAGES.general[lang]);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t(UI.book)}
      className="wa-fab group fixed bottom-5 right-5 z-50 flex items-center gap-0 rounded-full bg-whatsapp p-4 text-white shadow-[0_14px_35px_-8px_rgba(37,211,102,0.65)] transition-all hover:bg-whatsapp-dark hover:shadow-[0_18px_45px_-8px_rgba(37,211,102,0.8)] sm:bottom-6 sm:right-6"
    >
      <span className="wa-pulse relative flex items-center justify-center rounded-full">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.83 14.12c-.25.7-1.45 1.38-2 1.43-.51.05-1.15.07-1.86-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.38.79-.38h.57c.18 0 .43-.07.67.51.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.49.22.57.35.07.12.07.73-.18 1.43Z" />
        </svg>
      </span>
      <span className="wa-label max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500">
        {t(UI.book)}
      </span>
    </a>
  );
}
