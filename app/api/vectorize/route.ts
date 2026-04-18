import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { writeFile, readFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import os from "os";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

const ACCEPTED_MIME = new Set(["image/png", "image/jpeg", "image/webp", "image/bmp"]);

export async function POST(req: NextRequest) {
  let inPath: string | null = null;
  let outPath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mime = file.type;
    if (!ACCEPTED_MIME.has(mime)) {
      return NextResponse.json({ error: `Unsupported file type: ${mime}` }, { status: 400 });
    }

    const id = randomUUID();
    outPath = path.join(os.tmpdir(), `pixvec-${id}.svg`);

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Resize if either dimension exceeds 2000px (keeps aspect ratio)
    const MAX_PX = 2000;
    const meta = await sharp(inputBuffer).metadata();
    const needsResize = (meta.width ?? 0) > MAX_PX || (meta.height ?? 0) > MAX_PX;
    // rotate() with no args applies EXIF orientation then strips the tag —
    // critical for portrait JPEGs that store rotation in metadata
    const pipeline = sharp(inputBuffer).rotate();
    const imageBuffer = needsResize
      ? await pipeline
          .resize(MAX_PX, MAX_PX, { fit: "inside", withoutEnlargement: true })
          .png()
          .toBuffer()
      : await pipeline.png().toBuffer();

    // Log final dimensions for debugging
    const finalMeta = await sharp(imageBuffer).metadata();
    console.log(`[vectorize] input: ${meta.width}x${meta.height} → output: ${finalMeta.width}x${finalMeta.height}`);

    // Always write as PNG so vtracer gets a lossless input
    inPath = path.join(os.tmpdir(), `pixvec-${id}.png`);
    await writeFile(inPath, imageBuffer);

    const scriptPath = path.join(process.cwd(), "scripts", "vectorize.py");
    await execFileAsync("python3", [scriptPath, inPath, outPath], { timeout: 120_000 });

    const svg = await readFile(outPath, "utf8");

    return new NextResponse(svg, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[vectorize] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    for (const p of [inPath, outPath]) {
      if (p) unlink(p).catch(() => undefined);
    }
  }
}
