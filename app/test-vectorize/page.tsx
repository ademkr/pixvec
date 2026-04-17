"use client";

import { useRef, useState } from "react";
import { vectorize } from "@/lib/wasm/vtracer";

export default function TestVectorizePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSvgOutput(null);
    setElapsed(null);
    setError(null);
    setStatus("processing");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((res) => { img.onload = res; });

    const canvas = canvasRef.current!;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      const t0 = performance.now();
      const svg = await vectorize(imageData);
      setElapsed(Math.round(performance.now() - t0));
      setSvgOutput(svg);
      setStatus("done");
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "monospace" }}>
      <h1 style={{ marginBottom: 16 }}>VTracer WASM — Test Page</h1>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        style={{ marginBottom: 16, display: "block" }}
      />

      {status === "processing" && (
        <p style={{ color: "#6C63FF", marginBottom: 16 }}>⏳ Processing...</p>
      )}

      {status === "done" && elapsed !== null && (
        <p style={{ color: "green", marginBottom: 16 }}>
          ✓ Done in <strong>{elapsed} ms</strong>
        </p>
      )}

      {status === "error" && (
        <p style={{ color: "red", marginBottom: 16 }}>✗ Error: {error}</p>
      )}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Original */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: "bold" }}>Original</p>
          <canvas
            ref={canvasRef}
            style={{ maxWidth: 480, maxHeight: 480, border: "1px solid #ccc", display: "block" }}
          />
        </div>

        {/* SVG output */}
        {svgOutput && (
          <div>
            <p style={{ marginBottom: 8, fontWeight: "bold" }}>Vector (SVG)</p>
            <div
              style={{ maxWidth: 480, maxHeight: 480, border: "1px solid #ccc", overflow: "auto" }}
              dangerouslySetInnerHTML={{ __html: svgOutput }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
