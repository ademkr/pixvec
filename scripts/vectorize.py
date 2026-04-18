#!/usr/bin/env python3
"""
Vectorize an image file using vtracer.
Usage: python3 vectorize.py <image_path> <output_svg_path>
Writes SVG to output_svg_path, prints "ok" to stdout on success.
"""
import sys
import os
import vtracer  # noqa

def main():
    if len(sys.argv) < 3:
        print("Usage: vectorize.py <image_path> <output_svg_path>", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]
    out_path = sys.argv[2]

    if not os.path.isfile(image_path):
        print(f"File not found: {image_path}", file=sys.stderr)
        sys.exit(1)

    # Positional args required — keyword args cause SIGSEGV on Python 3.14
    vtracer.convert_image_to_svg_py(
        image_path, out_path,
        "color", "stacked", "spline",
        4, 6, 16, 60, 4.0, 10, 45, 8,
    )
    print("ok")
    os._exit(0)  # bypass Python 3.14 shutdown crash with vtracer

if __name__ == "__main__":
    import os as _os_import  # noqa: ensure os is imported before main runs
    main()
