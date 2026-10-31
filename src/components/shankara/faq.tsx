"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/content";
import { useLang } from "./language-context";
import { Reveal, SectionHeading } from "./reveal";

export function Faq() {
  const { t } = useLang();

  return (
    <section id="faq" className="bg-cream-dark/40 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t(FAQ.eyebrow)} title={t(FAQ.title)} />

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-12 space-y-3.5">
            {FAQ.items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border border-forest-900/10 bg-white px-6 shadow-sm transition-shadow data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="gap-4 py-5 text-left font-display text-[16px] leading-snug text-forest-900 hover:no-underline [&>svg]:text-gold-600">
                  {t(item.q)}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-[14px] leading-[1.85] text-muted-foreground">
                  {t(item.a)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
