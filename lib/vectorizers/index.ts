// Vektörizasyon motor abstraction layer
// MVP: VTracer (sunucu taraflı) + ImageTracerJS
// V2: Potrace entegrasyonu

export type VectorizerEngine = 'vtracer' | 'imagetracerjs' | 'potrace';

export interface VectorizerOptions {
  engine: VectorizerEngine;
  colormode?: 'color' | 'bw';
  color_precision?: number;
  filter_speckle?: number;
  mode?: 'pixel' | 'polygon' | 'spline';
  preset?: string;
}

export interface VectorizerResult {
  svg: string;
  engine: VectorizerEngine;
  processingTime: number;
}
