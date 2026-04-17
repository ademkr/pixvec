"use client";

import { useRef, useState } from "react";
import { vectorize } from "@/lib/wasm/vtracer";

type Engine = "vtracer" | "imagetracer";

const IMAGETRACER_MAX = 200;

function resizeImageData(src: ImageData, maxSize: number): ImageData {
  const scale = Math.min(1, maxSize / Math.max(src.width, src.height));
  const w = Math.round(src.width * scale);
  const h = Math.round(src.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  // draw src via OffscreenCanvas trick: put pixels then drawImage
  const tmp = document.createElement("canvas");
  tmp.width = src.width;
  tmp.height = src.height;
  tmp.getContext("2d")!.putImageData(src, 0, 0);
  ctx.drawImage(tmp, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

async function runImageTracer(imageData: ImageData): Promise<string> {
  const resized = resizeImageData(imageData, IMAGETRACER_MAX);
  console.log("ImageTracer starting...", resized.width, resized.height);
  const mod = await import("imagetracerjs");
  const it = mod.default ?? mod;
  const result = await Promise.race([
    new Promise<string>((resolve) => {
      it.imagedataToSVG(resized, "posterized2", (svg: string) => {
        console.log("ImageTracer complete");
        resolve(svg);
      });
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout: görsel çok büyük, küçültmeyi deneyin")), 30000)
    ),
  ]);
  return result;
}

export default function TestVectorizePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  const [engine, setEngine] = useState<Engine>("vtracer");
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function run(imgData: ImageData, eng: Engine) {
    setSvgOutput(null);
    setElapsed(null);
    setError(null);
    setStatus("processing");
    try {
      const t0 = performance.now();
      const svg = eng === "vtracer"
        ? await vectorize(imgData)
        : await runImageTracer(imgData);
      setElapsed(Math.round(performance.now() - t0));
      setSvgOutput(svg);
      setStatus("done");
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((res) => { img.onload = res; });

    const canvas = canvasRef.current!;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imageDataRef.current = imgData;
    run(imgData, engine);
  }

  function handleEngineChange(eng: Engine) {
    setEngine(eng);
    if (imageDataRef.current) run(imageDataRef.current, eng);
  }

  function downloadSvg() {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `output-${engine}.svg`;
    a.click();
  }

  return (
    <div style={{ padding: 24, fontFamily: "monospace" }}>
      <h1 style={{ marginBottom: 16 }}>Vectorization Engine Test</h1>

      <div style={{ display: "flex", gap: 24, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Engine:
          <select
            value={engine}
            onChange={(e) => handleEngineChange(e.target.value as Engine)}
            style={{ padding: "4px 8px", fontFamily: "monospace" }}
          >
            <option value="vtracer">VTracer (WASM)</option>
            <option value="imagetracer">ImageTracer (JS)</option>
          </select>
        </label>
      </div>

      {status === "processing" && (
        <p style={{ color: "#6C63FF", marginBottom: 12 }}>⏳ Processing with {engine}...</p>
      )}
      {status === "done" && elapsed !== null && (
        <p style={{ color: "green", marginBottom: 12 }}>
          ✓ {engine} — done in <strong>{elapsed} ms</strong>
          <button onClick={downloadSvg} style={{ marginLeft: 12, cursor: "pointer", padding: "2px 10px" }}>
            Download SVG
          </button>
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "red", marginBottom: 12 }}>✗ Error: {error}</p>
      )}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <p style={{ marginBottom: 8, fontWeight: "bold" }}>Original</p>
          <canvas ref={canvasRef} style={{ maxWidth: 480, border: "1px solid #ccc", display: "block" }} />
        </div>

        {svgOutput && (
          <div>
            <p style={{ marginBottom: 8, fontWeight: "bold" }}>Vector — {engine}</p>
            <div
              style={{ maxWidth: 480, border: "1px solid #ccc", overflow: "auto" }}
              dangerouslySetInnerHTML={{ __html: svgOutput }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
