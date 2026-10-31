"use client";

import { LangProvider } from "@/components/shankara/language-context";
import { Navbar } from "@/components/shankara/navbar";
import { Hero } from "@/components/shankara/hero";
import { Marquee } from "@/components/shankara/marquee";
import { About } from "@/components/shankara/about";
import { Services } from "@/components/shankara/services";
import { Program } from "@/components/shankara/program";
import { Gallery } from "@/components/shankara/gallery";
import { Faq } from "@/components/shankara/faq";
import { CtaBand } from "@/components/shankara/cta-band";
import { Contact } from "@/components/shankara/contact";
import { Footer, WhatsAppFab } from "@/components/shankara/footer";

export default function Page() {
  return (
    <LangProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          <Hero />
          <Marquee />
          <About />
          <Services />
          <Program />
          <Gallery />
          <Faq />
          <CtaBand />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    </LangProvider>
  );
}
