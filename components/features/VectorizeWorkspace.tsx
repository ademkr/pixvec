"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, ImageIcon, X, Sparkles, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/bmp"];

interface Props {
  onClear?: () => void;
  initialFile?: File | null;
}

export function VectorizeWorkspace({ onClear, initialFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const loadFile = useCallback((file: File) => {
    if (!ACCEPTED.includes(file.type)) return;
    setFileName(file.name);
    setOriginalSrc(URL.createObjectURL(file));
  }, []);

  useEffect(() => {
    if (initialFile) loadFile(initialFile);
  }, [initialFile, loadFile]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">

      {/* ── Left panel: upload + preview ── */}
      <div className="flex flex-col gap-4 lg:w-80 lg:flex-shrink-0">

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200",
            "bg-background/60 backdrop-blur-sm",
            dragOver
              ? "border-brand-purple bg-brand-purple/10 scale-[1.01]"
              : "border-border hover:border-brand-purple/50 hover:bg-brand-purple/5"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
          />
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20">
            {originalSrc ? <ImageIcon className="h-5 w-5 text-brand-purple" /> : <Upload className="h-5 w-5 text-brand-purple" />}
          </div>
          {originalSrc ? (
            <>
              <p className="truncate text-sm font-medium text-foreground">{fileName}</p>
              <p className="mt-1 text-xs text-muted-foreground">Click to replace</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">Drop image here</p>
              <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {["PNG", "JPG", "WEBP", "BMP"].map((f) => (
                  <span key={f} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{f}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Original preview */}
        {originalSrc && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border border-border bg-card/60">
            <p className="border-b border-border/50 px-3 py-2 text-xs font-medium text-muted-foreground">Your image</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalSrc} alt="Uploaded" className="w-full object-contain" style={{ maxHeight: 200 }} />
          </motion.div>
        )}

        {/* Clear button */}
        {onClear && originalSrc && (
          <button onClick={onClear}
            className="flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive">
            <X className="h-4 w-4" />
            New Image
          </button>
        )}
      </div>

      {/* ── Right panel: coming soon ── */}
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-8 text-center"
        >
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20">
            <Sparkles className="h-6 w-6 text-brand-purple" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Vectorization Engine Coming Soon
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            We&apos;re building a high-quality server-side vectorization engine.
            Sign up to get early access when it launches.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-emerald/20">
                <Bell className="h-5 w-5 text-brand-emerald" />
              </div>
              <p className="text-sm font-medium text-foreground">You&apos;re on the list!</p>
              <p className="text-xs text-muted-foreground">We&apos;ll notify you at <span className="text-foreground">{email}</span></p>
            </motion.div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                Notify Me
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            No spam, unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
