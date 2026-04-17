"use client";

// Single promise — ensures init runs exactly once, no race conditions
let initPromise: Promise<unknown> | null = null;

async function init() {
  if (!initPromise) {
    initPromise = import("vtracer-wasm").then((mod) =>
      mod.default("/wasm/vtracer.wasm")
    );
  }
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
  await init();
  const mod = await import("vtracer-wasm");

  const pixels = new Uint8Array(imageData.data.buffer);

  const cfg = {
    binary: config.binary ?? false,
    mode: config.mode ?? "spline",
    hierarchical: config.hierarchical ?? "stacked",
    cornerThreshold: config.cornerThreshold ?? 60,
    lengthThreshold: config.lengthThreshold ?? 4.0,
    maxIterations: Math.round(config.maxIterations ?? 10),
    spliceThreshold: config.spliceThreshold ?? 45,
    filterSpeckle: Math.round(config.filterSpeckle ?? 4),
    colorPrecision: Math.round(config.colorPrecision ?? 6),
    layerDifference: Math.round(config.layerDifference ?? 16),
    pathPrecision: Math.round(config.pathPrecision ?? 8),
  };

  return mod.to_svg(pixels, imageData.width, imageData.height, cfg);
}
