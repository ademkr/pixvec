"use client";

import { motion } from "framer-motion";
import {
  Zap,
  GitCompare,
  Sparkles,
  Palette,
  FileDown,
  Files,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
  detail?: string;
  wide?: boolean;
  accent?: "purple" | "cyan" | "teal" | "emerald" | "amber";
}

const FEATURES: FeatureCard[] = [
  {
    icon: Zap,
    title: "Instant Browser Preview",
    description:
      "See the result before sending anything to a server — privacy and speed combined.",
    detail: "100% local processing via WebAssembly",
    wide: true,
    accent: "purple",
  },
  {
    icon: GitCompare,
    title: "3 Results, 1 Click",
    description:
      "Run the same image through 3 different algorithms — pick the result you like best.",
    accent: "cyan",
  },
  {
    icon: Sparkles,
    title: "AI Upscaling + Vectorize",
    description:
      "We upscale low-resolution images with AI first, then vectorize for cleaner results.",
    accent: "purple",
  },
  {
    icon: Palette,
    title: "Artistic Modes",
    description: "Posterize, curvy, sharp, artistic — 10+ style presets for creative conversions.",
    accent: "teal",
  },
  {
    icon: FileDown,
    title: "Multiple Formats",
    description: "SVG, PDF, EPS, DXF — download in any format with a single click.",
    accent: "emerald",
  },
  {
    icon: Files,
    title: "Batch Processing",
    description: "Upload 10+ files at once and download them all as a single ZIP.",
    detail: "Up to 100 files per batch on Pro",
    wide: true,
    accent: "cyan",
  },
];

const ACCENT_CLASSES = {
  purple:  { icon: "text-brand-purple", glow: "from-brand-purple/20 to-brand-purple/5",  border: "hover:border-brand-purple/40" },
  cyan:    { icon: "text-brand-cyan",   glow: "from-brand-cyan/20 to-brand-cyan/5",      border: "hover:border-brand-cyan/40"   },
  teal:    { icon: "text-brand-teal",   glow: "from-brand-teal/20 to-brand-teal/5",      border: "hover:border-brand-teal/40"   },
  emerald: { icon: "text-brand-emerald",glow: "from-brand-emerald/20 to-brand-emerald/5",border: "hover:border-brand-emerald/40"},
  amber:   { icon: "text-brand-amber",  glow: "from-brand-amber/20 to-brand-amber/5",    border: "hover:border-brand-amber/40"  },
};

function FeatureCardItem({ card, index }: { card: FeatureCard; index: number }) {
  const accent = ACCENT_CLASSES[card.accent ?? "purple"];
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border p-6 transition-colors duration-200",
        "bg-background/60 backdrop-blur-sm dark:bg-card/60",
        accent.border,
        card.wide ? "md:col-span-2" : ""
      )}
    >
      {/* Glow arka plan */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          accent.glow
        )}
      />

      {/* İkon */}
      <div className={cn(
        "mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted",
        "group-hover:bg-background transition-colors"
      )}>
        <Icon className={cn("h-5 w-5", accent.icon)} />
      </div>

      {/* İçerik */}
      <h3 className="mb-2 font-semibold text-foreground">{card.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>

      {card.detail && (
        <p className={cn("mt-3 text-xs font-medium", accent.icon)}>
          {card.detail}
        </p>
      )}

      {/* Glassmorphism overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent" />
    </motion.div>
  );
}

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28">
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
            Features
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Why{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
              Pixvec?
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Beyond traditional vectorization tools — browser-side preview,
            artistic modes, and AI upscaling for a next-generation experience.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((card, i) => (
            <FeatureCardItem key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
