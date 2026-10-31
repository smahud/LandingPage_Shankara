"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Perf 2026-10-31: framer-motion DIHAPUS total dari project ini.
   Animasi masuk kini CSS murni — hero paint sebelum hydration (LCP),
   reveal di bawah fold via IntersectionObserver + transisi CSS.
   Tidak ada JS animation library lagi di bundle. */

const DIR_CLASS: Record<"up" | "left" | "right" | "none", string> = {
  up: "reveal-up",
  left: "reveal-left",
  right: "reveal-right",
  none: "",
};

/**
 * IntersectionObserver hook — true sekali saja saat elemen masuk viewport.
 * (Pengganti useInView dari framer-motion; dipakai juga oleh StatCounter.)
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(rootMargin = "-40px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

export function Reveal({
  children,
  className,
  delay = 0,
  dir = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  dir?: "up" | "left" | "right" | "none";
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>("0px 0px -60px 0px");

  return (
    <div
      ref={ref}
      className={cn("reveal", DIR_CLASS[dir], inView && "reveal-in", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/** Section eyebrow label + heading used across the site */
export function SectionHeading({
  eyebrow,
  title,
  desc,
  center = true,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <Reveal dir="none">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em]",
            dark
              ? "border-gold-500/30 bg-gold-500/10 text-gold-400"
              : "border-sage-600/25 bg-mint-50 text-forest-600"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-gold-400" : "bg-gold-500")} />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "font-display mt-5 text-balance text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]",
            dark ? "text-cream" : "text-forest-900"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {desc ? (
        <Reveal delay={0.16}>
          <p className={cn("mt-4 text-base leading-relaxed", dark ? "text-mint-200/75" : "text-muted-foreground")}>
            {desc}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Decorative lotus divider */
export function LotusDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-28 text-gold-500", className)}
    >
      <path
        d="M2 14c10 0 14-8 18-8s5 6 10 6c4 0 6-6 10-6s5 8 18 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M60 2c3 5 3 9 0 13-3-4-3-9 0-13Zm0 13c-5 1-9 4-11 8 5-1 9-3 11-8Zm0 0c5 1 9 4 11 8-5-1-9-3-11-8Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
