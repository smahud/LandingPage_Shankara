"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Tent,
  Hand,
  Flower2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Check,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CONTACT, SERVICES, SECTION_SERVICES, UI, waLink, WA_MESSAGES, type Service } from "@/lib/content";
import { useLang } from "./language-context";
import { Reveal, SectionHeading } from "./reveal";

const ICONS = {
  tent: Tent,
  hand: Hand,
  flower: Flower2,
  sparkles: Sparkles,
} as const;

function ServiceCard({ s, i, onOpen }: { s: Service; i: number; onOpen: (s: Service) => void }) {
  const { lang, t } = useLang();
  const Icon = ICONS[s.icon];
  const link = waLink(CONTACT.waService, WA_MESSAGES[s.waKey][lang]);

  return (
    <Reveal delay={(i % 2) * 0.1} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest-900/10 bg-white shadow-lg shadow-forest-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-forest-900/12">
        <div className="relative h-56 overflow-hidden sm:h-60">
          <Image
            src={s.image}
            alt={t(s.imageAlt)}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900/85 text-gold-300 ring-1 ring-gold-500/40 backdrop-blur-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="absolute bottom-4 left-4 rounded-full bg-gold-500 px-4 py-1.5 text-[13px] font-bold text-forest-950 shadow-lg">
            {t(s.price)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <h3 className="font-display text-xl leading-snug text-forest-900 sm:text-[1.35rem]">{t(s.title)}</h3>
          <p className="mt-3 flex-1 text-[14px] leading-[1.8] text-muted-foreground">{t(s.short)}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {s.facilities.slice(0, 2).map((f) => (
              <span
                key={f.en}
                className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 px-3 py-1 text-[11px] font-medium text-forest-700"
              >
                <Check className="h-3 w-3" aria-hidden="true" />
                {t(f)}
              </span>
            ))}
            {s.facilities.length > 2 && (
              <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                +{s.facilities.length - 2}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => onOpen(s)}
              variant="ghost"
              className="min-w-0 gap-1.5 rounded-full px-4 text-forest-800 hover:bg-mint-50 hover:text-forest-900"
            >
              <span className="truncate">{t(UI.seeMore)}</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button
              asChild
              size="sm"
              className="w-full gap-1.5 rounded-full bg-forest-800 px-5 font-semibold hover:bg-forest-900 min-[420px]:ml-auto min-[420px]:w-auto"
            >
              <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`${t(UI.book)} — ${t(s.title)}`}>
                <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{t(UI.book)}</span>
              </a>
            </Button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ServiceDialog({ s, onClose }: { s: Service | null; onClose: () => void }) {
  const { lang, t } = useLang();
  const link = s ? waLink(CONTACT.waService, WA_MESSAGES[s.waKey][lang]) : "#";

  return (
    <Dialog open={!!s} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="nice-scroll max-h-[88vh] max-w-2xl gap-0 overflow-y-auto rounded-[1.75rem] bg-cream p-0">
        {s && (
          <>
            <div className="relative h-52 w-full overflow-hidden sm:h-60">
              <Image
                src={s.image}
                alt={t(s.imageAlt)}
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
              <DialogHeader className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <DialogTitle className="font-display text-left text-2xl text-cream sm:text-3xl">
                  {t(s.title)}
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              <DialogDescription className="text-[14.5px] leading-[1.85] text-forest-900/75">
                {t(s.tagline)}
              </DialogDescription>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold-500/25 bg-mint-50 px-5 py-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-forest-600">{t(UI.startingFrom)}</p>
                  <p className="font-display mt-1 text-xl text-forest-900">{t(s.price)}</p>
                </div>
                <p className="text-right text-xs leading-relaxed text-muted-foreground">{t(s.priceNote)}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-display flex items-center gap-2 text-lg text-forest-900">
                  <span className="inline-block h-5 w-1 rounded-full bg-gold-500" aria-hidden="true" />
                  {t(UI.servicesLabel)}
                </h4>
                <ul className="mt-4 space-y-3.5">
                  {s.items.map((item) => (
                    <li key={item.name.en} className="rounded-2xl border border-forest-900/8 bg-white p-5">
                      <p className="font-display text-[15px] text-forest-900">{t(item.name)}</p>
                      <p className="mt-2 text-[13.5px] leading-[1.75] text-muted-foreground">{t(item.desc)}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Facilities */}
              <div>
                <h4 className="font-display flex items-center gap-2 text-lg text-forest-900">
                  <span className="inline-block h-5 w-1 rounded-full bg-gold-500" aria-hidden="true" />
                  {t(UI.facilities)}
                </h4>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {s.facilities.map((f) => (
                    <li
                      key={f.en}
                      className="flex items-center gap-2.5 rounded-xl bg-mint-50 px-4 py-3 text-[13.5px] text-forest-800"
                    >
                      <Check className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                      {t(f)}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className="h-13 w-full gap-2 rounded-full bg-whatsapp py-6 text-base font-bold text-white shadow-lg shadow-whatsapp/25 hover:bg-whatsapp-dark"
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  {t(UI.viaWa)}
                </a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Services() {
  const { t } = useLang();
  const [open, setOpen] = useState<Service | null>(null);

  return (
    <section id="services" className="relative bg-cream-dark/40 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(SECTION_SERVICES.eyebrow)}
          title={t(SECTION_SERVICES.title)}
          desc={t(SECTION_SERVICES.desc)}
        />

        <div className="mt-14 grid gap-7 md:grid-cols-2 xl:gap-8">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} onOpen={setOpen} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-[13px] text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
            {lang_note(t)}
          </p>
        </Reveal>
      </div>

      <ServiceDialog s={open} onClose={() => setOpen(null)} />
    </section>
  );
}

// tiny helper to avoid repeating the location note
function lang_note(t: (a: { id: string; en: string }) => string) {
  return t({
    id: "Semua layanan berada di kawasan alam Jalan Lingkar Barat, Kehutanan, Kota Batu.",
    en: "All services are located in the natural area of Jalan Lingkar Barat, Kehutanan, Batu City.",
  });
}
