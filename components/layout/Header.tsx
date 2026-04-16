"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-cyan">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
            Pixvec
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Özellikler
          </Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">
            Fiyatlandırma
          </Link>
          <Link href="/app" className="hover:text-foreground transition-colors">
            Giriş
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="#upload"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:opacity-90 transition-opacity border-0"
            )}
          >
            Ücretsiz Dene
          </Link>
        </div>
      </div>
    </header>
  );
}
