"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark",  label: "Dark",  icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = options.find((o) => o.value === theme) ?? options[2];
  const Icon = mounted ? current.icon : Monitor;

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select theme"
        aria-expanded={open}
      >
        <Icon className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[130px] overflow-hidden rounded-xl border border-border bg-background/95 shadow-lg backdrop-blur-sm">
          {options.map(({ value, label, icon: OptionIcon }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted",
                theme === value ? "text-brand-purple font-medium" : "text-foreground"
              )}
            >
              <OptionIcon className="h-3.5 w-3.5 shrink-0" />
              {label}
              {mounted && theme === value && (
                <Check className="ml-auto h-3.5 w-3.5 text-brand-purple" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
