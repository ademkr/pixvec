"use client";

import { ArrowLeft, Zap } from "lucide-react";
import { VectorizeWorkspace } from "@/components/features/VectorizeWorkspace";
import Link from "next/link";

export default function ConvertPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-cyan">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground">Pixvec</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
        <VectorizeWorkspace />
      </main>
    </div>
  );
}
