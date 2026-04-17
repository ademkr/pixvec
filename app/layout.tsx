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
  title: {
    default: "Pixvec — AI-Powered Image Vectorization",
    template: "%s | Pixvec",
  },
  description:
    "Convert PNG, JPG images to SVG vectors instantly. Free browser preview, AI upscaling, multiple engines. No signup required.",
  keywords: [
    "image to svg",
    "png to vector",
    "vectorize image",
    "jpg to svg",
    "raster to vector",
    "ai vectorizer",
  ],
  authors: [{ name: "Pixvec" }],
  creator: "Pixvec",
  metadataBase: new URL("https://pixvec.co"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pixvec.co",
    title: "Pixvec — AI-Powered Image Vectorization",
    description:
      "Convert PNG, JPG images to SVG vectors instantly. Free browser preview, AI upscaling, multiple engines.",
    siteName: "Pixvec",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixvec — AI-Powered Image Vectorization",
    description:
      "Convert PNG, JPG images to SVG vectors instantly. Free browser preview, AI upscaling, multiple engines.",
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
