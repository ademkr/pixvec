"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatProps {
  end: number;
  suffix: string;
  label: string;
  duration?: number;
}

function AnimatedStat({ end, suffix, label, duration = 1.8 }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent text-4xl font-bold tracking-tight sm:text-5xl">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

const STATS: StatProps[] = [
  { end: 12400,  suffix: "+", label: "Images Converted" },
  { end: 98,     suffix: "%", label: "Satisfaction Rate" },
  { end: 3,      suffix: "s",  label: "Avg. Processing Time" },
  { end: 4,      suffix: "x",  label: "AI Upscaling Factor" },
];


export function SocialProof() {
  return (
    <section className="border-y border-border/50 bg-muted/30 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
