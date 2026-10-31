"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CONTACT, CONTACT_SECTION, SERVICES, waLink } from "@/lib/content";
import { useLang } from "./language-context";
import { Reveal, SectionHeading } from "./reveal";

export function Contact() {
  const { lang, t } = useLang();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: lang === "id" ? "Nama wajib diisi" : "Name is required",
        description: lang === "id" ? "Silakan isi nama Anda dulu." : "Please fill in your name first.",
      });
      return;
    }
    setSending(true);
    const lines = [
      `${t(CONTACT_SECTION.waGreeting)} ${name.trim()}`,
      interest ? `${t(CONTACT_SECTION.waInterest)} ${interest}` : "",
      "",
      message.trim(),
    ].filter(Boolean);
    window.open(waLink(CONTACT.waMain, lines.join("\n")), "_blank", "noopener");
    setSending(false);
    toast({
      title: lang === "id" ? "Membuka WhatsApp…" : "Opening WhatsApp…",
      description:
        lang === "id"
          ? "Lanjutkan percakapan di WhatsApp untuk menyelesaikan booking."
          : "Continue the chat on WhatsApp to complete your booking.",
    });
  };

  const info = [
    {
      icon: Phone,
      label: t(CONTACT_SECTION.phoneLabel),
      value: CONTACT.phoneDisplay,
      href: `https://wa.me/${CONTACT.waMain}`,
    },
    {
      icon: MapPin,
      label: t(CONTACT_SECTION.addressLabel),
      value: CONTACT.address.line,
      href: CONTACT.mapsUrl,
    },
    {
      icon: Clock,
      label: t(CONTACT_SECTION.hoursLabel),
      value: `${t(CONTACT_SECTION.hours)}\n${t(CONTACT_SECTION.hoursNote)}`,
      href: undefined,
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-cream py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 h-96 w-96 rounded-full bg-mint-100 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(CONTACT_SECTION.eyebrow)}
          title={t(CONTACT_SECTION.title)}
          desc={t(CONTACT_SECTION.desc)}
          center={false}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Info cards */}
          <div className="space-y-5 lg:col-span-2">
            {info.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <div className="group flex items-start gap-5 rounded-3xl border border-forest-900/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-800 text-gold-300 transition-transform group-hover:-rotate-6">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="mt-1.5 block break-words text-[15px] font-medium leading-relaxed text-forest-900 underline-offset-4 hover:text-forest-600 hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-forest-900">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Map card */}
            <Reveal delay={0.24}>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-56 items-end overflow-hidden rounded-3xl shadow-lg ring-1 ring-forest-900/10"
                aria-label="Google Maps — Shankara Wellness & Sanctuary"
              >
                <div className="absolute inset-0 grain-dark" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(196,162,101,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(196,162,101,0.35) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                  }}
                />
                <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <span className="relative flex h-14 w-14 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-500/30" />
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-forest-950 shadow-xl">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </span>
                </span>
                <span className="relative m-5 rounded-2xl bg-cream/95 px-4 py-2.5 text-[13px] font-semibold text-forest-900 shadow-lg transition-transform group-hover:scale-[1.03]">
                  {lang === "id" ? "Lihat di Google Maps ↗" : "View on Google Maps ↗"}
                </span>
              </a>
            </Reveal>
          </div>

          {/* Form → WhatsApp */}
          <Reveal delay={0.12} className="lg:col-span-3">
            <form
              onSubmit={submit}
              className="relative h-full overflow-hidden rounded-[2rem] border border-forest-900/10 bg-white p-7 shadow-xl shadow-forest-900/8 sm:p-9"
            >
              <h3 className="font-display text-2xl text-forest-900">{t(CONTACT_SECTION.formTitle)}</h3>
              <p className="mt-2 text-[13.5px] text-muted-foreground">{t(CONTACT_SECTION.formDesc)}</p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name" className="text-[13px] font-semibold text-forest-900">
                    {t(CONTACT_SECTION.name)} <span className="text-gold-600">*</span>
                  </Label>
                  <Input
                    id="c-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t(CONTACT_SECTION.namePh)}
                    className="h-12 rounded-2xl bg-cream/60 focus-visible:ring-gold-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-interest" className="text-[13px] font-semibold text-forest-900">
                    {t(CONTACT_SECTION.interest)}
                  </Label>
                  <Select value={interest} onValueChange={setInterest}>
                    <SelectTrigger id="c-interest" className="h-12 rounded-2xl bg-cream/60 text-[15px] text-forest-900 data-[placeholder]:text-muted-foreground">
                      <SelectValue placeholder={lang === "id" ? "Pilih program…" : "Choose a program…"} />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={t(s.title)}>
                          {t(s.title)}
                        </SelectItem>
                      ))}
                      <SelectItem value={t({ id: "Self Transformation Program", en: "Self Transformation Program" })}>
                        {t({ id: "Self Transformation Program", en: "Self Transformation Program" })}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="c-msg" className="text-[13px] font-semibold text-forest-900">
                    {t(CONTACT_SECTION.message)}
                  </Label>
                  <Textarea
                    id="c-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t(CONTACT_SECTION.messagePh)}
                    rows={5}
                    className="resize-none rounded-2xl bg-cream/60 focus-visible:ring-gold-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="mt-7 w-full gap-2.5 rounded-full bg-forest-800 py-6 text-base font-bold hover:bg-forest-900 sm:w-auto sm:px-10"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4.5 w-4.5" aria-hidden="true" />
                )}
                {sending ? t(CONTACT_SECTION.sending) : t(CONTACT_SECTION.send)}
              </Button>
              <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                {lang === "id"
                  ? "* Formulir ini membuka WhatsApp dengan pesan yang sudah terisi — tanpa menyimpan data Anda di server."
                  : "* This form opens WhatsApp with a pre-filled message — no data is stored on our server."}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
