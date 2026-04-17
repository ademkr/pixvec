"use client";

let initialized = false;

async function init() {
  if (initialized) return;
  const mod = await import("vtracer-wasm");
  await mod.default();
  initialized = true;
}

export interface VTracerConfig {
  colormode?: "color" | "binary";
  hierarchical?: "stacked" | "cutout";
  mode?: "spline" | "polygon" | "none";
  filter_speckle?: number;
  color_precision?: number;
  layer_difference?: number;
  corner_threshold?: number;
  length_threshold?: number;
  splice_threshold?: number;
  path_precision?: number;
}

export async function vectorize(
  imageData: ImageData,
  config: VTracerConfig = {}
): Promise<string> {
  await init();
  const mod = await import("vtracer-wasm");

  const pixels = new Uint8Array(imageData.data.buffer);

  const cfg = {
    colormode: config.colormode ?? "color",
    hierarchical: config.hierarchical ?? "stacked",
    mode: config.mode ?? "spline",
    filter_speckle: config.filter_speckle ?? 4,
    color_precision: config.color_precision ?? 6,
    layer_difference: config.layer_difference ?? 16,
    corner_threshold: config.corner_threshold ?? 60,
    length_threshold: config.length_threshold ?? 4.0,
    splice_threshold: config.splice_threshold ?? 45,
    path_precision: config.path_precision ?? 8,
  };

  return mod.to_svg(pixels, imageData.width, imageData.height, cfg);
}
