// VTracer WASM Loader — tarayıcı tarafında anlık önizleme
// WASM binary: public/wasm/vtracer_wasm.js (MVP sonrası eklenecek)

export interface VTracerOptions {
  colormode?: 'color' | 'bw';
  color_precision?: number;    // 1-8, default 6
  filter_speckle?: number;     // default 4
  corner_threshold?: number;   // default 60
  segment_length?: number;     // default 4
  splice_threshold?: number;   // default 45
  mode?: 'pixel' | 'polygon' | 'spline';
  preset?: 'bw' | 'poster' | 'photo';
}

let wasmModule: unknown = null;

export async function initVTracer() {
  if (!wasmModule) {
    // WASM binary yüklendiğinde bu satır aktif edilecek:
    // wasmModule = await import('/wasm/vtracer_wasm.js');
    // await (wasmModule as { default: () => Promise<void> }).default();
    throw new Error('VTracer WASM binary henüz yüklenmedi. Sunucu taraflı dönüşüm kullanılıyor.');
  }
  return wasmModule;
}

export async function vectorizeInBrowser(
  imageData: ImageData,
  options: VTracerOptions
): Promise<string> {
  const vtracer = await initVTracer() as Record<string, (data: Uint8ClampedArray, w: number, h: number, opts: string) => string>;
  return vtracer.convert(
    imageData.data,
    imageData.width,
    imageData.height,
    JSON.stringify(options)
  );
}
