"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GALLERY } from "@/lib/content";
import { useLang } from "./language-context";
import { Reveal, SectionHeading } from "./reveal";
import { cn } from "@/lib/utils";

export function Gallery() {
  const { t } = useLang();
  const [sel, setSel] = useState<number | null>(null);

  return (
    <section id="gallery" className="bg-cream py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t(GALLERY.eyebrow)} title={t(GALLERY.title)} desc={t(GALLERY.desc)} />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {GALLERY.items.map((g, i) => (
            <Reveal
              key={g.src}
              delay={(i % 4) * 0.06}
              className={cn(
                // Feature spans for a lively grid
                i === 0 && "col-span-2 row-span-2",
                i === 5 && "md:col-span-2"
              )}
            >
              <button
                onClick={() => setSel(i)}
                className="group relative block h-full w-full overflow-hidden rounded-3xl focus-visible:ring-2 focus-visible:ring-gold-500"
                aria-label={`${t(GALLERY.eyebrow)}: ${t(g.alt)}`}
              >
                <Image
                  src={g.src}
                  alt={t(g.alt)}
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={cn(
                    "w-full object-cover transition-transform duration-700 group-hover:scale-105",
                    i === 0 ? "h-64 md:h-[416px]" : "h-32 md:h-[200px]"
                  )}
                />
                <span className="absolute inset-0 bg-forest-950/0 transition-colors duration-300 group-hover:bg-forest-950/45" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-forest-950 shadow-xl">
                    <Expand className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={sel !== null} onOpenChange={(v) => !v && setSel(null)}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-[1.75rem] border-0 bg-forest-950 p-0">
          {sel !== null && (
            <figure>
              <Image
                src={GALLERY.items[sel].src}
                alt={t(GALLERY.items[sel].alt)}
                width={600}
                height={400}
                className="h-auto max-h-[70vh] w-full object-contain"
              />
              <DialogTitle className="bg-forest-950 p-4 text-center text-sm text-cream/80">
                {t(GALLERY.items[sel].alt)}
              </DialogTitle>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
