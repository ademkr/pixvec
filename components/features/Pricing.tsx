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
    name: "Free",
    price: "$0",
    description: "No signup required. Try right now.",
    icon: Zap,
    features: [
      "1 conversion per day",
      "VTracer engine",
      "SVG output (watermarked)",
      "Instant browser preview",
      "Drag & drop upload",
    ],
    cta: "Try Now",
    ctaHref: "#upload",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$7.99",
    period: "/mo",
    description: "Unlimited access for serious designers.",
    icon: Crown,
    features: [
      "Unlimited conversions",
      "All vectorization engines",
      "AI Upscaling pipeline",
      "SVG, PDF, EPS, DXF output",
      "No watermark",
      "Batch processing (10 files at once)",
      "Basic SVG editor",
      "Email support",
    ],
    cta: "Go Pro",
    ctaHref: "/app",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "api",
    name: "API",
    price: "$29.99",
    period: "/mo",
    description: "For developers and automation.",
    icon: Code,
    features: [
      "All Pro features",
      "RESTful API access",
      "1,000 credits/month",
      "Batch processing (100 files at once)",
      "Webhook support",
      "Priority support",
    ],
    cta: "API Documentation",
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
            Pricing
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple,{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            No credit card required. Try free, upgrade when you&apos;re ready.
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
          All plans are billed monthly. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}
