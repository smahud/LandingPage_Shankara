"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, CTA_BAND, UI, waLink, WA_MESSAGES } from "@/lib/content";
import { useLang } from "./language-context";

export function CtaBand() {
  const { lang, t } = useLang();
  const link = waLink(CONTACT.waMain, WA_MESSAGES.general[lang]);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Perf: background statis — dulu zoom-in framer saat in-view; kini tampil
          langsung (nol JS, tidak menunggu observer). */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/tent-lounge.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest-950/85" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-28">
        <h2 className="font-display text-balance text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
          {t(CTA_BAND.title)}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-mint-200/75 sm:text-base">
          {t(CTA_BAND.desc)}
        </p>
        <Button
          asChild
          size="lg"
          className="group mt-10 h-14 gap-2.5 rounded-full bg-gold-500 px-9 text-base font-bold text-forest-950 shadow-2xl transition-all hover:bg-gold-400"
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
            {t(UI.book)}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
