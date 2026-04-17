"use client";

import { motion } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderHandle } from "react-compare-slider";
import { Shield } from "lucide-react";

// Gerçek görseller eklenince bu iki path'i değiştir:
const BEFORE_SRC = "/images/before-example.png";
const AFTER_SRC  = "/images/after-example.png";

function BeforePlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-200 dark:bg-zinc-800">
      <span className="text-5xl font-black tracking-widest text-zinc-400 dark:text-zinc-600">
        BEFORE
      </span>
      <span className="rounded-md bg-zinc-300/60 px-3 py-1 text-xs text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-400">
        Raster • 72×72px • Pixelated
      </span>
    </div>
  );
}

function AfterPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-purple to-brand-cyan">
      <span className="text-5xl font-black tracking-widest text-white/90">
        AFTER
      </span>
      <span className="rounded-md bg-white/20 px-3 py-1 text-xs text-white/80">
        Vector • SVG • Infinite Resolution
      </span>
    </div>
  );
}

export function BeforeAfterDemo() {
  // Gerçek görseller mevcut olduğunda bu flag'i true yap
  const USE_REAL_IMAGES = false;

  return (
    <section id="compare" className="py-20 sm:py-28 bg-muted/20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Live Comparison
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            See the{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
              Difference
            </span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Compare the original image with the vectorized result — pixel by pixel
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Slider */}
          <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
            <div className="relative">
              {/* Köşe etiketleri */}
              <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-between p-3">
                <span className="rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Original
                </span>
                <span className="rounded-lg bg-brand-purple/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Vector
                </span>
              </div>

              <ReactCompareSlider
                itemOne={
                  USE_REAL_IMAGES
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={BEFORE_SRC} alt="Before" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <BeforePlaceholder />
                }
                itemTwo={
                  USE_REAL_IMAGES
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={AFTER_SRC} alt="After" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <AfterPlaceholder />
                }
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      background: "linear-gradient(135deg,#6C63FF,#00D2FF)",
                      border: "none",
                      boxShadow: "0 0 0 3px rgba(108,99,255,0.4)",
                      width: 38,
                      height: 38,
                    }}
                    linesStyle={{ background: "#6C63FF", width: 2, opacity: 0.7 }}
                    style={{ color: "white" }}
                  />
                }
                style={{ width: "100%", aspectRatio: "16/9" }}
              />
            </div>
          </div>

          {/* Kalite badge'leri */}
          <div className="mt-3 flex justify-between px-1">
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              📷 Raster • 72×72 px
            </span>
            <span className="rounded-md bg-brand-purple/10 px-2.5 py-1 text-xs font-medium text-brand-purple">
              ✦ SVG — ∞ resolution
            </span>
          </div>

          {/* Gizlilik notu */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-brand-emerald" />
            Processed in your browser — your image never reaches our servers
          </div>
        </motion.div>
      </div>
    </section>
  );
}
