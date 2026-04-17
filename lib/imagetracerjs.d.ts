declare module "imagetracerjs" {
  const ImageTracer: {
    imagedataToSVG(imageData: ImageData, options: unknown, callback: (svg: string) => void): void;
    imageToSVG(url: string, options: unknown, callback: (svg: string) => void): void;
    optionpresets: Record<string, unknown>;
  };
  export default ImageTracer;
  export = ImageTracer;
}
