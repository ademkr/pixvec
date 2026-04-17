import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pixvec - AI Image Vectorization";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#1A1A2E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #6C63FF, #00D2FF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "800",
            color: "white",
            letterSpacing: "-2px",
          }}
        >
          Pixvec
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: "400",
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
          }}
        >
          Pixel to Vector, in Seconds
        </div>

        {/* Gradient underline */}
        <div
          style={{
            width: "120px",
            height: "4px",
            borderRadius: "2px",
            background: "linear-gradient(90deg, #6C63FF, #00D2FF)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
