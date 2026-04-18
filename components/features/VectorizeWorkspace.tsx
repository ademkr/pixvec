"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactCompareSlider } from "react-compare-slider";
import { Upload, Download, ImageIcon, Loader2, X } from "lucide-react";
import { vectorize } from "@/lib/wasm/vtracer";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/bmp"];

type Status = "idle" | "processing" | "done" | "error";
type PresetKey = "logo" | "drawing" | "photo" | "custom";

interface VConfig {
  filterSpeckle: number;
  colorPrecision: number;
  cornerThreshold: number;
  lengthThreshold: number;
  spliceThreshold: number;
  maxIterations: number;
  mode: "spline" | "polygon";
  pathPrecision: number;
  layerDifference: number;
}

// Base config confirmed working (matches the debug session that returned SVG in 24ms).
// Only filterSpeckle varies between presets — other params kept at safe values.
const BASE: Omit<VConfig, "filterSpeckle"> = {
  colorPrecision: 6, cornerThreshold: 60, lengthThreshold: 4,
  spliceThreshold: 45, maxIterations: 10,
  mode: "polygon", pathPrecision: 8, layerDifference: 16,
};

const PRESETS: Record<Exclude<PresetKey, "custom">, VConfig> = {
  logo:    { ...BASE, filterSpeckle: 1 }, // max detail
  drawing: { ...BASE, filterSpeckle: 2 },
  photo:   { ...BASE, filterSpeckle: 4 }, // more noise reduction
};

interface Props {
  onClear?: () => void;
  initialFile?: File | null;
}

export function VectorizeWorkspace({ onClear, initialFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [svgBlob, setSvgBlob] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [preset, setPreset] = useState<PresetKey>("logo");
  const [cfg, setCfg] = useState<VConfig>({ ...PRESETS.logo });

  const runVectorize = useCallback(async (imgData: ImageData, config: VConfig) => {
    setSvgOutput(null);
    setSvgBlob(null);
    setError(null);
    setStatus("processing");
    try {
      const t0 = performance.now();
      const svg = await vectorize(imgData, config);
      setElapsed(Math.round(performance.now() - t0));
      setSvgOutput(svg);
      setSvgBlob(URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })));
      setStatus("done");
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  }, []);

  const loadFile = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) return;
    setFileName(file.name);
    const objUrl = URL.createObjectURL(file);
    setOriginalSrc(objUrl);

    const img = new Image();
    img.src = objUrl;
    await new Promise((res) => { img.onload = res; });

    const canvas = canvasRef.current!;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Always use 2d context with willReadFrequently for pixel extraction.
    // For JPEG (no alpha), canvas.getImageData still produces RGBA with alpha=255 — correct for VTracer.
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    // Fill white background first so transparent PNGs don't produce alpha=0 pixels
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    console.log("[Pixvec] File type:", file.type);
    console.log("[Pixvec] Canvas size:", canvas.width, "x", canvas.height);
    console.log("[Pixvec] ImageData bytes:", imgData.data.length, "(expected:", canvas.width * canvas.height * 4, ")");
    console.log("[Pixvec] First 8 pixels (RGBA):", Array.from(imgData.data.slice(0, 32)));

    imageDataRef.current = imgData;
    runVectorize(imgData, cfg);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runVectorize]); // cfg intentionally excluded — uses latest on drop

  useEffect(() => {
    if (initialFile) loadFile(initialFile);
  }, [initialFile, loadFile]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }

  function applyPreset(key: Exclude<PresetKey, "custom">) {
    const next = PRESETS[key];
    setPreset(key);
    setCfg(next);
    if (imageDataRef.current) runVectorize(imageDataRef.current, next);
  }

  function handleSpeckleChange(val: number) {
    const next = { ...cfg, filterSpeckle: val };
    setCfg(next);
    setPreset("custom");
    if (imageDataRef.current) runVectorize(imageDataRef.current, next);
  }

  function handleModeChange(m: "spline" | "polygon") {
    const next = { ...cfg, mode: m };
    setCfg(next);
    setPreset("custom");
    if (imageDataRef.current) runVectorize(imageDataRef.current, next);
  }

  function downloadSvg() {
    if (!svgOutput) return;
    const a = document.createElement("a");
    const base = fileName ? fileName.replace(/\.[^.]+$/, "") : "output";
    a.href = URL.createObjectURL(new Blob([svgOutput], { type: "image/svg+xml" }));
    a.download = `${base}.svg`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      {/* Hidden canvas for pixel extraction */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Left panel ── */}
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
            <img src={originalSrc} alt="Original" className="w-full object-contain" style={{ maxHeight: 160 }} />
          </motion.div>
        )}

        {/* Settings */}
        {originalSrc && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-xl border border-border bg-card/60 p-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Settings</p>
            <div className="flex flex-col gap-4">

              {/* Presets */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm text-foreground">Preset</label>
                  {preset === "custom" && (
                    <span className="text-xs text-muted-foreground">Custom</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["logo", "drawing", "photo"] as const).map((p) => (
                    <button key={p} onClick={() => applyPreset(p)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                        preset === p
                          ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                          : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                      )}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail level */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm text-foreground">Detail level</label>
                  <span className="text-xs text-muted-foreground">{cfg.filterSpeckle}</span>
                </div>
                <input type="range" min={0} max={10} value={cfg.filterSpeckle}
                  onChange={(e) => setCfg((c) => ({ ...c, filterSpeckle: +e.target.value }))}
                  onPointerUp={(e) => handleSpeckleChange(+(e.target as HTMLInputElement).value)}
                  className="w-full accent-[#6C63FF]" />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>More detail</span><span>Less noise</span>
                </div>
              </div>

              {/* Path style */}
              <div>
                <label className="mb-1.5 block text-sm text-foreground">Path style</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["spline", "polygon"] as const).map((m) => (
                    <button key={m} onClick={() => handleModeChange(m)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                        cfg.mode === m
                          ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                          : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                      )}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Clear / new image button */}
        {onClear && originalSrc && (
          <button onClick={onClear}
            className="flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive">
            <X className="h-4 w-4" />
            New Image
          </button>
        )}
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm" style={{ minHeight: 360 }}>

          {status === "idle" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Upload an image to get started</p>
            </div>
          )}

          <AnimatePresence>
            {status === "processing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
                <p className="text-sm text-muted-foreground">Vectorizing...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {status === "error" && (
            <div className="p-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {status === "done" && originalSrc && svgBlob && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full">
              <ReactCompareSlider
                itemOne={
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={originalSrc} alt="Original" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                }
                itemTwo={
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={svgBlob} alt="Vector" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                }
                handle={
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg,#6C63FF,#00D2FF)",
                    boxShadow: "0 0 0 3px rgba(108,99,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: 14, fontWeight: "bold", cursor: "col-resize",
                    userSelect: "none",
                  }}>⇔</div>
                }
                style={{ width: "100%", height: "100%" }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-3">
                <span className="rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">Original</span>
                <span className="rounded-lg bg-brand-purple/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">Vector</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom bar */}
        {status === "done" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-brand-purple/30 bg-brand-purple/10 px-3 py-1.5">
                <span className="text-xs font-semibold text-brand-purple">SVG</span>
              </div>
              {elapsed !== null && (
                <span className="text-xs text-muted-foreground">
                  Generated in <span className="font-medium text-foreground">{elapsed} ms</span>
                </span>
              )}
            </div>
            <button onClick={downloadSvg}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
                "bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 hover:scale-[1.02]"
              )}>
              <Download className="h-4 w-4" />
              Download SVG
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
