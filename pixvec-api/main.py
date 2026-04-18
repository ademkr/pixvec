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
        # Open with Pillow, apply EXIF orientation, resize if needed
        img = Image.open(io.BytesIO(data))
        img = ImageOps.exif_transpose(img)  # apply EXIF rotation

        if img.width > MAX_PX or img.height > MAX_PX:
            img.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)

        # Convert to RGB PNG (vtracer expects non-transparent for color mode)
        if img.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "P":
                img = img.convert("RGBA")
            bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # Write PNG to temp file
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            in_path = f.name
            img.save(f, format="PNG")

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
