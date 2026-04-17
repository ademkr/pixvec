"use client";

import { useRef, useState } from "react";

// Hardcoded exact config matching Rust struct fields (camelCase via serde rename_all)
// Config { binary, mode, hierarchical, cornerThreshold, lengthThreshold,
//          maxIterations, spliceThreshold, filterSpeckle, colorPrecision,
//          layerDifference, pathPrecision }
const HARDCODED_CONFIG = {
  binary: false,
  mode: "spline",
  hierarchical: "stacked",
  cornerThreshold: 60,
  lengthThreshold: 4.0,
  maxIterations: 10,
  spliceThreshold: 45,
  filterSpeckle: 4,
  colorPrecision: 6,
  layerDifference: 16,
  pathPrecision: 8,
};

export default function TestVectorizePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");

  function addLog(msg: string) {
    setLog((prev) => [...prev, msg]);
    console.log(msg);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSvgOutput(null);
    setLog([]);
    setStatus("processing");

    // Draw image to canvas
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((res) => { img.onload = res; });

    const canvas = canvasRef.current!;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    addLog(`ImageData: ${imageData.width} x ${imageData.height}, bytes: ${imageData.data.length}`);

    try {
      // Step 1: import and init
      addLog("Importing vtracer-wasm...");
      const mod = await import("vtracer-wasm");
      addLog(`Module keys: ${Object.keys(mod).join(", ")}`);
      addLog(`to_svg type: ${typeof mod.to_svg}, length: ${mod.to_svg?.length}`);

      addLog("Calling mod.default() to init WASM...");
      await mod.default("/wasm/vtracer.wasm");
      addLog("WASM init complete");

      // Step 2: call to_svg
      const pixels = new Uint8Array(imageData.data.buffer);
      addLog(`pixels length: ${pixels.length}`);
      addLog(`Config: ${JSON.stringify(HARDCODED_CONFIG)}`);

      const t0 = performance.now();
      const svg = mod.to_svg(pixels, imageData.width, imageData.height, HARDCODED_CONFIG);
      const elapsed = Math.round(performance.now() - t0);

      addLog(`✓ Done in ${elapsed}ms, SVG length: ${svg.length}`);
      setSvgOutput(svg);
      setStatus("done");
    } catch (err) {
      addLog(`✗ Error: ${String(err)}`);
      setStatus("error");
    }
  }

  function downloadSvg() {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "output.svg";
    a.click();
  }

  return (
    <div style={{ padding: 24, fontFamily: "monospace" }}>
      <h1 style={{ marginBottom: 16 }}>VTracer WASM — Minimum Test</h1>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        style={{ marginBottom: 16, display: "block" }}
      />

      {/* Log output */}
      {log.length > 0 && (
        <pre style={{
          background: "#111", color: "#0f0", padding: 12,
          borderRadius: 4, marginBottom: 16, fontSize: 12,
          whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto"
        }}>
          {log.join("\n")}
        </pre>
      )}

      {status === "done" && (
        <button onClick={downloadSvg} style={{ marginBottom: 16, cursor: "pointer", padding: "4px 12px" }}>
          Download SVG
        </button>
      )}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <p style={{ marginBottom: 8, fontWeight: "bold" }}>Original</p>
          <canvas ref={canvasRef} style={{ maxWidth: 480, border: "1px solid #ccc", display: "block" }} />
        </div>

        {svgOutput && (
          <div>
            <p style={{ marginBottom: 8, fontWeight: "bold" }}>Vector (SVG)</p>
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
