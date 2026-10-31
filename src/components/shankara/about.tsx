"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BadgeCheck, Leaf, Users, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABOUT, CONTACT, UI, waLink, WA_MESSAGES } from "@/lib/content";
import { useLang } from "./language-context";
import { Reveal, SectionHeading, LotusDivider, useInViewOnce } from "./reveal";

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>("0px 0px -40px 0px");
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      // easeOutCubic
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(e * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl text-gold-300 sm:text-6xl">
      {n}
      {suffix}
    </span>
  );
}

const WHY_POINTS = [
  {
    icon: Leaf,
    title: { id: "Pendekatan Ilmiah & Alami", en: "Scientific & Natural" },
    desc: {
      id: "Menggabungkan pendekatan ilmiah dan praktik kesehatan alami.",
      en: "Combining a scientific approach with natural health practices.",
    },
  },
  {
    icon: Users,
    title: { id: "Tim Profesional", en: "Professional Team" },
    desc: {
      id: "Ilmuwan, praktisi kesehatan, dan trainer berpengalaman.",
      en: "Scientists, health practitioners, and experienced trainers.",
    },
  },
  {
    icon: HeartHandshake,
    title: { id: "Personal & Holistik", en: "Personal & Holistic" },
    desc: {
      id: "Program menyesuaikan kebutuhan unik setiap individu.",
      en: "Programs tailored to each individual's unique needs.",
    },
  },
  {
    icon: BadgeCheck,
    title: { id: "Hasil Nyata", en: "Tangible Results" },
    desc: {
      id: "Transformasi yang terukur, bukan sekadar pengalaman sesaat.",
      en: "Measurable transformation, not just a passing experience.",
    },
  },
];

export function About() {
  const { lang, t } = useLang();
  const bookLink = waLink(CONTACT.waMain, WA_MESSAGES.general[lang]);

  return (
    <section id="about" className="relative overflow-hidden bg-cream py-24 sm:py-28">
      {/* soft decorative blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-mint-100 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(ABOUT.eyebrow)}
          title={t(ABOUT.title)}
          center={false}
        />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: text + images */}
          <div>
            <Reveal>
              <h3 className="font-display text-2xl leading-snug text-forest-900 sm:text-[1.7rem]">
                {t(ABOUT.subtitle)}
              </h3>
              <LotusDivider className="mt-5" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[15px] leading-[1.9] text-muted-foreground">{t(ABOUT.body1)}</p>
            </Reveal>

            <Reveal delay={0.16} className="relative mt-8">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <div className="group relative overflow-hidden rounded-3xl shadow-lg shadow-forest-900/10 ring-1 ring-forest-900/10">
                  <Image
                    src="/images/garden-path.webp"
                    alt={lang === "id" ? "Jalan setapak taman Shankara" : "Shankara garden path"}
                    width={600}
                    height={400}
                    sizes="(max-width: 1024px) 50vw, 300px"
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-60"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-forest-950/70 px-3 py-1 text-[11px] font-medium text-cream backdrop-blur-sm">
                    {lang === "id" ? "Jalan Taman" : "Garden Path"}
                  </span>
                </div>
                <div className="group relative mt-10 overflow-hidden rounded-3xl shadow-lg shadow-forest-900/10 ring-1 ring-forest-900/10">
                  <Image
                    src="/images/meditation.webp"
                    alt={lang === "id" ? "Meditasi di taman Shankara" : "Meditating in the Shankara garden"}
                    width={600}
                    height={400}
                    sizes="(max-width: 1024px) 50vw, 300px"
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-60"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-forest-950/70 px-3 py-1 text-[11px] font-medium text-cream backdrop-blur-sm">
                    {lang === "id" ? "Area Meditasi" : "Meditation Lawn"}
                  </span>
                </div>
              </div>
              {/* decorative quote connecting the images */}
              <p
                aria-hidden="true"
                className="mt-6 flex items-center gap-3 text-[13px] italic text-forest-600"
              >
                <span className="h-px flex-1 bg-forest-900/15" />
                {lang === "id"
                  ? "Suasana alam yang menenangkan di setiap sudut"
                  : "A calming natural atmosphere in every corner"}
                <span className="h-px flex-1 bg-forest-900/15" />
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <h4 className="font-display mt-12 text-xl text-forest-900">{t(ABOUT.storyTitle)}</h4>
              <p className="mt-4 text-[15px] leading-[1.9] text-muted-foreground">{t(ABOUT.story1)}</p>
              <p className="mt-4 text-[15px] leading-[1.9] text-muted-foreground">{t(ABOUT.story2)}</p>
              <p className="mt-4 text-[15px] font-medium leading-[1.9] text-forest-800">{t(ABOUT.story3)}</p>
            </Reveal>
          </div>

          {/* Right: stats card + why choose */}
          <div className="lg:sticky lg:top-24">
            <Reveal dir="left">
              <div className="grain-dark relative overflow-hidden rounded-[2rem] p-8 text-cream shadow-2xl shadow-forest-900/25 sm:p-10">
                <LotusDivider />
                <div className="mt-2 space-y-9">
                  {ABOUT.stats.map((s) => (
                    <div key={s.title.en} className="flex items-start gap-5">
                      <StatCounter value={s.value} suffix={s.suffix} />
                      <div className="pt-1.5">
                        <p className="font-display text-base leading-snug text-cream">{t(s.title)}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-mint-200/70">{t(s.desc)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal dir="left" delay={0.12}>
              <div className="mt-8 rounded-[2rem] border border-forest-900/10 bg-white p-8 shadow-lg shadow-forest-900/5 sm:p-10">
                <h4 className="font-display text-xl text-forest-900">{t(ABOUT.whyTitle)}</h4>
                <p className="mt-3 text-[14px] leading-[1.85] text-muted-foreground">{t(ABOUT.whyBody)}</p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {WHY_POINTS.map((p) => (
                    <li key={p.title.en} className="flex items-start gap-3 rounded-2xl bg-mint-50 p-4">
                      <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-forest-900">{t(p.title)}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(p.desc)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-7 w-full gap-2 rounded-full bg-forest-800 py-6 font-semibold hover:bg-forest-900"
                >
                  <a href={bookLink} target="_blank" rel="noopener noreferrer">
                    {t(UI.book)}
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
