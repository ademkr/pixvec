"use client";

let initialized = false;

async function init() {
  if (initialized) return;
  const mod = await import("vtracer-wasm");
  // Pass the public URL so Turbopack doesn't try to bundle the .wasm file
  await mod.default("/wasm/vtracer.wasm");
  initialized = true;
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

  // Field names must be camelCase (serde rename_all = "camelCase")
  // binary: bool (not colormode string), maxIterations is required
  const cfg = {
    binary: config.binary ?? false,
    hierarchical: config.hierarchical ?? "stacked",
    mode: config.mode ?? "spline",
    filterSpeckle: config.filterSpeckle ?? 4,
    colorPrecision: config.colorPrecision ?? 6,
    layerDifference: config.layerDifference ?? 16,
    cornerThreshold: config.cornerThreshold ?? 60,
    lengthThreshold: config.lengthThreshold ?? 4.0,
    maxIterations: config.maxIterations ?? 10,
    spliceThreshold: config.spliceThreshold ?? 45,
    pathPrecision: config.pathPrecision ?? 8,
  };

  return mod.to_svg(pixels, imageData.width, imageData.height, cfg);
}
