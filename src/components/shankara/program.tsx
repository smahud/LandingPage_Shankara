"use client";

import Image from "next/image";
import { Moon, Mountain, Sun, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, PROGRAM, waLink, WA_MESSAGES } from "@/lib/content";
import { useLang } from "./language-context";
import { Reveal, SectionHeading, LotusDivider } from "./reveal";

const DUR_ICONS = [Moon, Mountain, Sun];

const DUR_NOTES = [
  { id: "Pengenalan singkat untuk reset energi", en: "A short introduction to reset your energy" },
  { id: "Immersion mendalam untuk kebiasaan baru", en: "Deep immersion to build new habits" },
  { id: "Transformasi penuh secara holistik", en: "A complete holistic transformation" },
];

export function Program() {
  const { lang, t } = useLang();
  const link = waLink(CONTACT.waMain, WA_MESSAGES.program[lang]);

  return (
    <section id="program" className="relative isolate overflow-hidden py-24 sm:py-28">
      <div className="grain-dark absolute inset-0 -z-10" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(PROGRAM.eyebrow)}
          title={t(PROGRAM.title)}
          desc={t(PROGRAM.desc)}
          dark
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <Reveal dir="right" className="relative">
            <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-cream/15 shadow-2xl">
              <Image
                src={PROGRAM.image}
                alt={t(PROGRAM.imageAlt)}
                width={600}
                height={400}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="h-[380px] w-full object-cover sm:h-[440px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-gold-500 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-950">
                {t(PROGRAM.badge)}
              </span>
            </div>
          </Reveal>

          {/* Duration cards */}
          <div>
            <Reveal dir="left">
              <LotusDivider />
              <p className="mt-4 text-[15px] leading-[1.9] text-mint-200/80">
                {lang === "id"
                  ? "Pilih durasi perjalananmu. Setiap paket mencakup penginapan, terapi, gerak tubuh & meditasi, serta workshop — dipandu tim profesional Shankara."
                  : "Choose your journey length. Every package covers accommodation, therapy, body movement & meditation, and workshops — guided by Shankara's professional team."}
              </p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {PROGRAM.durations.map((d, i) => {
                const Icon = DUR_ICONS[i];
                return (
                  <Reveal key={d.en} dir="left" delay={0.08 * i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-5 rounded-3xl border border-cream/12 bg-cream/[0.045] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/35 hover:bg-cream/[0.08] sm:p-6"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/30">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="flex-1">
                        <span className="font-display block text-lg text-cream">{t(d)}</span>
                        <span className="mt-1 block text-[13px] text-mint-200/60">{t(DUR_NOTES[i])}</span>
                      </span>
                      <span className="hidden items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-2 text-[12px] font-medium text-gold-300 transition-colors group-hover:border-gold-500/60 group-hover:bg-gold-500/20 sm:inline-flex">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        {t(PROGRAM.note)}
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </div>

            <Reveal dir="left" delay={0.28}>
              <Button
                asChild
                className="mt-8 w-full gap-2 rounded-full bg-gold-500 py-6 text-base font-bold text-forest-950 shadow-[0_18px_40px_-12px_rgba(196,162,101,0.45)] hover:bg-gold-400 sm:w-auto sm:px-10"
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  {t(PROGRAM.cta)}
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
