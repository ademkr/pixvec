"use client";

import { useRef, useState, useCallback } from "react";
import { vectorize } from "@/lib/wasm/vtracer";

type Mode = "spline" | "polygon" | "pixel";

export default function TestVectorizePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const [filterSpeckle, setFilterSpeckle] = useState(2);
  const [colorPrecision, setColorPrecision] = useState(8);
  const [mode, setMode] = useState<Mode>("spline");

  const runVectorize = useCallback(async (
    imgData: ImageData,
    fs: number,
    cp: number,
    m: Mode,
  ) => {
    setSvgOutput(null);
    setError(null);
    setStatus("processing");
    try {
      const t0 = performance.now();
      const svg = await vectorize(imgData, { filterSpeckle: fs, colorPrecision: cp, mode: m });
      setElapsed(Math.round(performance.now() - t0));
      setSvgOutput(svg);
      setStatus("done");
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  }, []);

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
    runVectorize(imgData, filterSpeckle, colorPrecision, mode);
  }

  function handleParamChange(
    fs: number,
    cp: number,
    m: Mode,
  ) {
    setFilterSpeckle(fs);
    setColorPrecision(cp);
    setMode(m);
    if (imageDataRef.current) {
      runVectorize(imageDataRef.current, fs, cp, m);
    }
  }

  function downloadSvg() {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: 24, fontFamily: "monospace", maxWidth: 1200 }}>
      <h1 style={{ marginBottom: 16 }}>VTracer WASM — Test Page</h1>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        style={{ marginBottom: 16, display: "block" }}
      />

      {/* Controls */}
      <div style={{ display: "flex", gap: 32, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          filterSpeckle: <strong>{filterSpeckle}</strong>
          <input
            type="range" min={0} max={10} value={filterSpeckle}
            onChange={(e) => handleParamChange(+e.target.value, colorPrecision, mode)}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          colorPrecision: <strong>{colorPrecision}</strong>
          <input
            type="range" min={1} max={8} value={colorPrecision}
            onChange={(e) => handleParamChange(filterSpeckle, +e.target.value, mode)}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          mode:
          <select
            value={mode}
            onChange={(e) => handleParamChange(filterSpeckle, colorPrecision, e.target.value as Mode)}
            style={{ padding: "4px 8px" }}
          >
            <option value="spline">spline</option>
            <option value="polygon">polygon</option>
            <option value="pixel">pixel</option>
          </select>
        </label>
      </div>

      {/* Status */}
      {status === "processing" && (
        <p style={{ color: "#6C63FF", marginBottom: 12 }}>⏳ Processing...</p>
      )}
      {status === "done" && elapsed !== null && (
        <p style={{ color: "green", marginBottom: 12 }}>
          ✓ Done in <strong>{elapsed} ms</strong>
          {" "}
          <button onClick={downloadSvg} style={{ marginLeft: 12, cursor: "pointer", padding: "2px 10px" }}>
            Download SVG
          </button>
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "red", marginBottom: 12 }}>✗ Error: {error}</p>
      )}

      {/* Output */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <p style={{ marginBottom: 8, fontWeight: "bold" }}>Original</p>
          <canvas
            ref={canvasRef}
            style={{ maxWidth: 480, maxHeight: 480, border: "1px solid #ccc", display: "block" }}
          />
        </div>

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
