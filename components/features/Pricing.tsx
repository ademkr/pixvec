"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Code } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Ücretsiz",
    price: "₺0",
    description: "Üyelik gerekmez. Hemen dene.",
    icon: Zap,
    features: [
      "Günde 1 dönüşüm",
      "VTracer motoru",
      "SVG çıktı (filigranlı)",
      "Tarayıcıda anlık önizleme",
      "Sürükle & bırak yükleme",
    ],
    cta: "Hemen Dene",
    ctaHref: "#upload",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$7.99",
    period: "/ay",
    description: "Ciddi tasarımcılar için sınırsız erişim.",
    icon: Crown,
    features: [
      "Sınırsız dönüşüm",
      "Tüm vektörizasyon motorları",
      "AI Upscaling pipeline",
      "SVG, PDF, EPS, DXF çıktı",
      "Filigransız indirme",
      "Batch işlem (10 dosya/seferinde)",
      "Temel SVG editör",
      "E-posta desteği",
    ],
    cta: "Pro'ya Geç",
    ctaHref: "/app",
    highlighted: true,
    badge: "En Popüler",
  },
  {
    id: "api",
    name: "API",
    price: "$29.99",
    period: "/ay",
    description: "Geliştiriciler ve otomasyon için.",
    icon: Code,
    features: [
      "Tüm Pro özellikleri",
      "RESTful API erişimi",
      "1.000 kredi/ay",
      "Batch işlem (100 dosya/seferinde)",
      "Webhook desteği",
      "Öncelikli destek",
    ],
    cta: "API Dokümantasyonu",
    ctaHref: "/docs",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Fiyatlandırma
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Basit,{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
              şeffaf
            </span>{" "}
            fiyatlar
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Kredi kartı gerekmez. Üyeliksiz dene, beğenirsen yükselt.
          </p>
        </motion.div>

        {/* Plan kartları */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6 transition-all duration-200",
                  plan.highlighted
                    ? "border-brand-purple/60 bg-brand-purple/5 shadow-[0_0_40px_-8px_rgba(108,99,255,0.3)] dark:bg-brand-purple/10"
                    : "border-border bg-background/60 hover:border-border/80 dark:bg-card/60"
                )}
              >
                {/* En popüler badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-1 text-xs font-semibold text-white shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* İkon + İsim */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    plan.highlighted
                      ? "bg-gradient-to-br from-brand-purple to-brand-cyan"
                      : "bg-muted"
                  )}>
                    <Icon className={cn("h-4 w-4", plan.highlighted ? "text-white" : "text-muted-foreground")} />
                  </div>
                  <span className="font-semibold text-foreground">{plan.name}</span>
                </div>

                {/* Fiyat */}
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="mb-1 text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "mb-6 w-full justify-center text-center",
                    plan.highlighted
                      ? "bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:opacity-90 border-0"
                      : "border-border bg-transparent hover:bg-muted text-foreground"
                  )}
                >
                  {plan.cta}
                </Link>

                {/* Özellik listesi */}
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        plan.highlighted ? "text-brand-purple" : "text-brand-emerald"
                      )} />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Alt not */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center text-xs text-muted-foreground"
        >
          Tüm planlar aylık faturalandırılır. İstediğin zaman iptal edebilirsin.
        </motion.p>
      </div>
    </section>
  );
}
