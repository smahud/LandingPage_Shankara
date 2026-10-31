"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, Phone, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CONTACT,
  NAV,
  UI,
  waLink,
  WA_MESSAGES,
} from "@/lib/content";
import { useLang } from "./language-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { lang, t, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the section in view for the active nav state
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const bookLink = waLink(CONTACT.waMain, WA_MESSAGES.general[lang]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-forest-900/10 bg-cream/90 shadow-[0_8px_30px_-12px_rgba(18,40,30,0.25)] backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-cream"
      >
        {lang === "id" ? "Lewati ke konten" : "Skip to content"}
      </a>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={() => go("home")}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Shankara Wellness & Sanctuary — home"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-forest-900 ring-1 ring-gold-500/40">
            <Image
              src="/images/logo-lotus.webp"
              alt=""
              width={26}
              height={26}
              className="object-contain"
              priority
            />
          </span>
          <span
            className={cn(
              "font-display text-left text-[15px] leading-tight transition-colors sm:text-base",
              scrolled ? "text-forest-900" : "text-cream"
            )}
          >
            Shankara
            <span className="block text-[10px] font-normal uppercase tracking-[0.28em] opacity-70">
              Wellness & Sanctuary
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    scrolled
                      ? active === item.id
                        ? "text-forest-900"
                        : "text-forest-900/60 hover:text-forest-900"
                      : active === item.id
                        ? "text-gold-300"
                        : "text-cream/70 hover:text-cream"
                  )}
                >
                  {t(item.label)}
                  <span
                    className={cn(
                      "absolute inset-x-4 -bottom-px h-0.5 origin-left rounded-full bg-gold-500 transition-transform duration-300",
                      active === item.id ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold uppercase tracking-wider transition-colors",
              scrolled
                ? "border-forest-900/15 text-forest-900/80 hover:bg-forest-900/5"
                : "border-cream/25 text-cream/85 hover:bg-cream/10"
            )}
            aria-label={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
          >
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            {lang === "id" ? "EN" : "ID"}
          </button>

          <Button
            asChild
            size="sm"
            className={cn(
              "hidden gap-2 rounded-full px-5 font-semibold shadow-lg md:inline-flex",
              scrolled
                ? "bg-forest-800 text-cream hover:bg-forest-900"
                : "bg-gold-500 text-forest-950 hover:bg-gold-400"
            )}
          >
            <a href={bookLink} target="_blank" rel="noopener noreferrer">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {t(UI.book)}
            </a>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden",
                  scrolled ? "border-forest-900/15 text-forest-900" : "border-cream/25 text-cream"
                )}
                aria-label={lang === "id" ? "Buka menu" : "Open menu"}
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-0 bg-forest-900 p-0 text-cream">
              <SheetHeader className="border-b border-cream/10 p-5">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-gold-500/40">
                    <Image src="/images/logo-lotus.webp" alt="" width={24} height={24} className="object-contain" />
                  </span>
                  <span className="font-display text-base">
                    Shankara
                    <span className="block text-[9px] font-normal uppercase tracking-[0.3em] opacity-60">
                      Wellness & Sanctuary
                    </span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="p-3">
                <ul>
                  {NAV.map((item, i) => (
                    <li key={item.id}>
                      <button
                        onClick={() => go(item.id)}
                        className="w-full rounded-xl px-4 py-3 text-left text-[15px] text-cream/85 transition-colors hover:bg-cream/10 hover:text-gold-300"
                      >
                        <span className="mr-3 text-xs text-gold-500/70">0{i + 1}</span>
                        {t(item.label)}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
                <Button
                  asChild
                  className="w-full gap-2 rounded-full bg-gold-500 py-6 font-semibold text-forest-950 hover:bg-gold-400"
                >
                  <a href={bookLink} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {t(UI.book)}
                  </a>
                </Button>
                <p className="text-center text-xs text-cream/50">{CONTACT.phoneDisplay}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
