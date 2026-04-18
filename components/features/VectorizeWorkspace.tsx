"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, ImageIcon, X, Download, AlertCircle, Loader2 } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/bmp"];

type Status = "idle" | "processing" | "done" | "error";

interface Props {
  onClear?: () => void;
  initialFile?: File | null;
}

export function VectorizeWorkspace({ onClear, initialFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [largeFile, setLargeFile] = useState(false);

  const vectorize = useCallback(async (file: File, objectUrl: string) => {
    setStatus("processing");
    setErrorMsg(null);
    setSvgContent(null);
    setSvgUrl(null);
    setLargeFile(file.size > 1_000_000);

    try {
      const form = new FormData();
      form.append("file", file);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 120_000);

      const res = await fetch("/api/vectorize", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }

      const svg = await res.text();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      setSvgContent(svg);
      setSvgUrl(url);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }

    // keep objectUrl alive — cleaned up on next loadFile or unmount
    void objectUrl;
  }, []);

  const loadFile = useCallback((file: File) => {
    if (!ACCEPTED.includes(file.type)) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);
    setStatus("idle");
    setSvgContent(null);
    setSvgUrl(null);
    vectorize(file, url);
  }, [vectorize]);

  useEffect(() => {
    if (initialFile) loadFile(initialFile);
  }, [initialFile, loadFile]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }

  function handleDownload() {
    if (!svgContent || !fileName) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName.replace(/\.[^.]+$/, "") + ".svg";
    a.click();
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
            <p className="border-b border-border/50 px-3 py-2 text-xs font-medium text-muted-foreground">Original</p>
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

      {/* ── Right panel: result ── */}
      <div className="flex flex-1 items-center justify-center">

        {/* Idle — no file yet */}
        {status === "idle" && !originalSrc && (
          <p className="text-sm text-muted-foreground">Upload an image to get started.</p>
        )}

        {/* Processing */}
        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-brand-purple" />
            <p className="text-sm font-medium text-foreground">Vectorizing…</p>
            <p className="text-xs text-muted-foreground">
              {largeFile
                ? "Large image — processing may take up to a minute"
                : "This usually takes a few seconds"}
            </p>
          </motion.div>
        )}

        {/* Error */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center"
          >
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm font-medium text-destructive">Vectorization failed</p>
            <p className="max-w-xs text-xs text-muted-foreground">{errorMsg}</p>
            <button
              onClick={() => { if (inputRef.current) inputRef.current.click(); }}
              className="mt-1 rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-brand-purple/50 hover:text-foreground"
            >
              Try another image
            </button>
          </motion.div>
        )}

        {/* Done — before/after slider */}
        {status === "done" && originalSrc && svgUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Slider */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage src={originalSrc} alt="Original" style={{ objectFit: "contain" }} />
                }
                itemTwo={
                  <ReactCompareSliderImage src={svgUrl} alt="Vector SVG" style={{ objectFit: "contain" }} />
                }
                style={{ width: "100%", maxHeight: 480 }}
              />
            </div>

            {/* Labels + download */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/50" />
                  Original
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-brand-purple" />
                  Vector SVG
                </span>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download SVG
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
