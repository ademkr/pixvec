import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pixvec.co"),
  title: {
    default: "Pixvec — AI-Powered Image Vectorization",
    template: "%s | Pixvec",
  },
  description:
    "Convert PNG, JPG images to clean SVG vectors instantly. Free browser preview, AI upscaling, multiple engines. No signup required.",
  keywords: [
    "image to svg",
    "vectorize image",
    "png to vector",
    "jpg to svg",
    "raster to vector",
    "image vectorizer",
    "svg converter",
    "ai vectorization",
    "free vectorizer",
  ],
  authors: [{ name: "Pixvec" }],
  creator: "Pixvec",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pixvec.co",
    siteName: "Pixvec",
    title: "Pixvec — Pixel to Vector, in Seconds",
    description:
      "AI-powered image vectorization. Preview in your browser, high quality on our servers. Free — no signup required.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Pixvec - AI Image Vectorization" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixvec — Pixel to Vector, in Seconds",
    description:
      "AI-powered image vectorization. Free browser preview, multiple engines, no signup required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
