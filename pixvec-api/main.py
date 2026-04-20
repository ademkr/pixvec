from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import vtracer
import tempfile
import os
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
import io
from typing import Optional

# VTracer parameters per preset
PRESETS = {
    "logo":    dict(filter_speckle=4, color_precision=6, gradient_step=16, corner_threshold=60, segment_length=4.0, splice_threshold=45, path_precision=8, mode="spline"),
    "drawing": dict(filter_speckle=2, color_precision=8, gradient_step=8,  corner_threshold=45, segment_length=3.0, splice_threshold=30, path_precision=8, mode="spline"),
    "photo":   dict(filter_speckle=8, color_precision=4, gradient_step=32, corner_threshold=90, segment_length=6.0, splice_threshold=60, path_precision=6, mode="spline"),
    "bw":      dict(filter_speckle=4, color_precision=6, gradient_step=16, corner_threshold=60, segment_length=4.0, splice_threshold=45, path_precision=8, mode="spline"),
}

app = FastAPI(title="pixvec-api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://pixvec.co",
        "https://www.pixvec.co",
        "https://pixvec.vercel.app",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_BYTES = 10 * 1024 * 1024  # 10 MB
MAX_PX = 2000
ACCEPTED = {"image/png", "image/jpeg", "image/webp", "image/bmp"}



def to_rgb(img: Image.Image) -> Image.Image:
    """Flatten any alpha onto white, return RGB."""
    if img.mode in ("RGBA", "LA", "P"):
        if img.mode == "P":
            img = img.convert("RGBA")
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        return bg
    return img.convert("RGB") if img.mode != "RGB" else img


def preprocess(img: Image.Image, preset: str) -> Image.Image:
    img = to_rgb(img)

    if preset == "logo":
        img = ImageEnhance.Contrast(img).enhance(1.3)

    elif preset == "drawing":
        img = img.quantize(colors=8).convert("RGB")
        img = img.filter(ImageFilter.SHARPEN)

    elif preset == "photo":
        img = img.quantize(colors=16).convert("RGB")
        img = img.filter(ImageFilter.SMOOTH)

    elif preset == "bw":
        gray = img.convert("L")
        # Threshold at 128 → pure black/white, then back to RGB for vtracer color mode
        bw = gray.point(lambda px: 255 if px >= 128 else 0, "L")
        img = bw.convert("RGB")

    return img


@app.get("/")
def health():
    return {"status": "ok", "service": "pixvec-api"}


@app.post("/vectorize")
async def vectorize(file: UploadFile = File(...), preset: Optional[str] = Form("logo")):
    if file.content_type not in ACCEPTED:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    preset = preset if preset in PRESETS else "logo"
    p = PRESETS[preset]

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
        needs_preprocess = preset != "logo" or not is_png  # logo+PNG may still bypass if no bg issue
        bypass = is_png and not needs_resize and preset == "logo"

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            in_path = f.name

            if bypass:
                # Pure PNG logo under 2000px — skip all Pillow processing
                f.write(data)
            else:
                if is_jpeg:
                    img = ImageOps.exif_transpose(img)
                if needs_resize:
                    img.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)
                    w, h = img.size

                img = preprocess(img, preset)
                img.save(f, format="PNG", compress_level=0)

        print(f"[pixvec] preset={preset}, bypass={bypass}, resize={needs_resize}, format={original_format}, size={w}x{h}")

        with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as f:
            out_path = f.name

        vtracer.convert_image_to_svg_py(
            in_path, out_path,
            "color", "stacked", p["mode"],
            p["filter_speckle"], p["color_precision"], p["gradient_step"],
            p["corner_threshold"], p["segment_length"], 10,
            p["splice_threshold"], p["path_precision"],
        )

        with open(out_path, "r", encoding="utf-8") as f:
            svg = f.read()

        return Response(content=svg, media_type="image/svg+xml")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        for path in (in_path, out_path):
            if path and os.path.exists(path):
                os.unlink(path)
