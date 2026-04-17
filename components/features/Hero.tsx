"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Hero() {
  const [dragOver, setDragOver] = useState(false);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    // Navigation handled by Link — user uploads on /app
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-28">
      {/* Gradient mesh arka plan */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-purple/20 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-brand-cyan/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-brand-teal/10 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:gap-16">
          {/* Sol: Metin */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-4 py-1.5 text-sm text-brand-purple"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Vectorization
            </motion.div>

            {/* Başlık */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Pixel to{" "}
              <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
                Vector
              </span>
              ,<br />
              in Seconds
            </motion.h1>

            {/* Alt başlık */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0"
            >
              AI-powered vectorization. Preview in your browser, high quality on
              our servers. Start free — no signup required.
            </motion.p>

            {/* CTA Butonlar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Link
                href="/app"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:opacity-90 transition-all hover:scale-[1.02] border-0 gap-2"
                )}
              >
                Try Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Button variant="ghost" size="lg" className="gap-2" onClick={() => {
                document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" });
              }}>
                <Play className="h-4 w-4" />
                How It Works
              </Button>
            </motion.div>

            {/* Küçük sosyal kanıt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-xs text-muted-foreground"
            >
              No credit card · No signup · Try instantly
            </motion.p>
          </div>

          {/* Sağ: Upload alanı */}
          <motion.div
            id="upload"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md flex-shrink-0"
          >
            <Link
              href="/app"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { onDrop(e); }}
              className={[
                "relative block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
                "bg-background/60 backdrop-blur-sm",
                dragOver
                  ? "border-brand-purple bg-brand-purple/10 scale-[1.01]"
                  : "border-border hover:border-brand-purple/50 hover:bg-brand-purple/5 hover:scale-[1.01]",
              ].join(" ")}
            >

              {/* İkon */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20">
                <Upload className="h-7 w-7 text-brand-purple" />
              </div>

              <p className="mb-1 text-sm font-semibold text-foreground">
                Drag &amp; drop your image
              </p>
              <p className="mb-4 text-xs text-muted-foreground">
                or click to open converter
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["PNG", "JPG", "WEBP", "BMP", "GIF"].map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {fmt}
                  </span>
                ))}
              </div>

              {/* Glassmorphism iç glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent" />
            </Link>

            {/* Alt bilgi */}
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Max 10 MB · Preview generated locally — your image never leaves your browser
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
