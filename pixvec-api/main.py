from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import vtracer
import tempfile
import os
from PIL import Image, ImageOps
import io

app = FastAPI(title="pixvec-api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://pixvec.co",
        "https://pixvec.vercel.app",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_BYTES = 10 * 1024 * 1024  # 10 MB
MAX_PX = 2000
ACCEPTED = {"image/png", "image/jpeg", "image/webp", "image/bmp"}


@app.get("/")
def health():
    return {"status": "ok", "service": "pixvec-api"}


@app.post("/vectorize")
async def vectorize(file: UploadFile = File(...)):
    if file.content_type not in ACCEPTED:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 10 MB)")

    in_path: str | None = None
    out_path: str | None = None

    try:
        original_format = file.content_type
        img = Image.open(io.BytesIO(data))
        w, h = img.size
        is_png = original_format == "image/png"
        is_jpeg = original_format == "image/jpeg"
        needs_resize = w > MAX_PX or h > MAX_PX
        bypass = is_png and not needs_resize
        resized = False

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            in_path = f.name

            if bypass:
                # PNG under 2000px — zero Pillow processing
                f.write(data)

            elif is_png and needs_resize:
                # PNG over 2000px — resize only, no format conversion
                img.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)
                resized = True
                w, h = img.size
                img.save(f, format="PNG", compress_level=0)

            else:
                # JPEG / WEBP / BMP — convert to lossless PNG
                if is_jpeg:
                    img = ImageOps.exif_transpose(img)
                if img.mode != "RGB":
                    if img.mode in ("RGBA", "LA", "P"):
                        if img.mode == "P":
                            img = img.convert("RGBA")
                        bg = Image.new("RGB", img.size, (255, 255, 255))
                        bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
                        img = bg
                    else:
                        img = img.convert("RGB")
                if needs_resize:
                    img.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)
                    resized = True
                    w, h = img.size
                img.save(f, format="PNG", compress_level=0)

        print(f"[pixvec] bypass={bypass}, resize={resized}, format={original_format}, size={w}x{h}")

        with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as f:
            out_path = f.name

        # Positional args required — keyword args cause SIGSEGV on some Python builds
        vtracer.convert_image_to_svg_py(
            in_path, out_path,
            "color", "stacked", "spline",
            4, 6, 16, 60, 4.0, 10, 45, 8,
        )

        with open(out_path, "r", encoding="utf-8") as f:
            svg = f.read()

        return Response(content=svg, media_type="image/svg+xml")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        for p in (in_path, out_path):
            if p and os.path.exists(p):
                os.unlink(p)
