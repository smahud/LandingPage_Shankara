"use client";

import { MARQUEE } from "@/lib/content";
import { useLang } from "./language-context";

/** Decorative lotus dot between marquee words */
function Dot() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-gold-500" fill="currentColor" aria-hidden="true">
      <path d="M12 2c2.4 4 2.4 7.2 0 10.4C9.6 9.2 9.6 6 12 2Zm0 10.4c-4 1-7.2 3.2-9 6.4 4-1 7.2-3.2 9-6.4Zm0 0c4 1 7.2 3.2 9 6.4-4-1-7.2-3.2-9-6.4Z" />
    </svg>
  );
}

export function Marquee() {
  const { lang } = useLang();
  const words = MARQUEE.map((w) => (lang === "id" ? w.id : w.en));
  // Duplicate for a seamless loop
  const row = [...words, ...words];

  return (
    <div className="border-y border-gold-500/15 bg-forest-900 py-4" aria-hidden="true">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-8">
          {row.map((w, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="font-display whitespace-nowrap text-sm uppercase tracking-[0.24em] text-cream/75">
                {w}
              </span>
              <Dot />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
