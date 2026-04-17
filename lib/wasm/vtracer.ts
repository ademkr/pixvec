"use client";

let initialized = false;
let initPromise: Promise<void> | null = null;
let running = false;

async function init() {
  if (initialized) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const mod = await import("vtracer-wasm");
    await mod.default("/wasm/vtracer.wasm");
    initialized = true;
  })();
  return initPromise;
}

export interface VTracerConfig {
  binary?: boolean;
  hierarchical?: "stacked" | "cutout";
  mode?: "spline" | "polygon" | "pixel";
  filterSpeckle?: number;
  colorPrecision?: number;
  layerDifference?: number;
  cornerThreshold?: number;
  lengthThreshold?: number;
  maxIterations?: number;
  spliceThreshold?: number;
  pathPrecision?: number;
}

export async function vectorize(
  imageData: ImageData,
  config: VTracerConfig = {}
): Promise<string> {
  if (running) throw new Error("WASM busy: previous call still running");
  await init();
  const mod = await import("vtracer-wasm");

  const pixels = new Uint8Array(imageData.data.buffer);

  // Field names must be camelCase (serde rename_all = "camelCase")
  // binary: bool (not colormode string), maxIterations is required
  const cfg = {
    binary: config.binary ?? false,
    hierarchical: config.hierarchical ?? "stacked",
    mode: config.mode ?? "spline",
    filterSpeckle: Math.round(config.filterSpeckle ?? 2),
    colorPrecision: Math.round(config.colorPrecision ?? 8),
    layerDifference: Math.round(config.layerDifference ?? 16),
    cornerThreshold: config.cornerThreshold ?? 60,
    lengthThreshold: config.lengthThreshold ?? 4.0,
    maxIterations: Math.round(config.maxIterations ?? 10),
    spliceThreshold: config.spliceThreshold ?? 45,
    pathPrecision: Math.round(config.pathPrecision ?? 8),
  };

  console.log("WASM config:", JSON.stringify(cfg));
  console.log("ImageData:", imageData.width, "x", imageData.height, "pixels:", imageData.data.length);

  running = true;
  try {
    return mod.to_svg(pixels, imageData.width, imageData.height, cfg);
  } finally {
    running = false;
  }
}
