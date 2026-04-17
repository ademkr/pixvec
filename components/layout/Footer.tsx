"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Share2, Camera, Play, GitFork, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  {
    heading: "Ürün",
    links: [
      { label: "Özellikler",         href: "#features"     },
      { label: "Fiyatlandırma",      href: "#pricing"      },
      { label: "API Dokümantasyonu", href: "/docs"         },
      { label: "Değişiklik Günlüğü", href: "/changelog"    },
    ],
  },
  {
    heading: "Kaynaklar",
    links: [
      { label: "Blog",          href: "/blog"          },
      { label: "Nasıl Çalışır", href: "/how-it-works"  },
      { label: "SSS",           href: "/faq"           },
      { label: "Destek",        href: "/support"       },
    ],
  },
  {
    heading: "Yasal",
    links: [
      { label: "Gizlilik Politikası", href: "/privacy"  },
      { label: "Kullanım Şartları",   href: "/terms"    },
      { label: "Çerez Politikası",    href: "/cookies"  },
      { label: "KVKK / GDPR",         href: "/gdpr"     },
    ],
  },
];

const SOCIALS = [
  { icon: Share2,  label: "Twitter/X", href: "https://twitter.com/pixvec"   },
  { icon: Camera,  label: "Instagram", href: "https://instagram.com/pixvec"  },
  { icon: Play,    label: "YouTube",   href: "https://youtube.com/@pixvec"   },
  { icon: GitFork, label: "GitHub",    href: "https://github.com/pixvec"    },
];

// ---------------------------------------------------------------------------
// Newsletter CTA Banner
// ---------------------------------------------------------------------------
function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Backend V2'de eklenecek
    setSubmitted(true);
  }

  return (
    <div className="border-t border-border/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 px-6 py-8 dark:bg-brand-purple/10 sm:px-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
            {/* Metin — min-w-0 Safari flex collapse fix */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h3 className="mb-1 text-lg font-semibold text-foreground">
                Pixvec&apos;ten haberdar ol
              </h3>
              <p className="text-sm text-muted-foreground">
                Yeni özellikler, ipuçları ve güncellemeler — haftada en fazla bir e-posta.
              </p>
            </div>

            {/* Form */}
            <div className="w-full max-w-sm flex-shrink-0">
              {submitted ? (
                <p className="rounded-xl bg-brand-emerald/10 px-4 py-3 text-center text-sm font-medium text-brand-emerald">
                  Teşekkürler! Listeye eklendin 🎉
                </p>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@adresin.com"
                      required
                      className="h-9 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                    />
                    <button
                      type="submit"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "shrink-0 bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:opacity-90 border-0 gap-1"
                      )}
                    >
                      Abone Ol
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                  <p className="mt-2 text-center text-xs text-muted-foreground sm:text-left">
                    Spam yok. İstediğin zaman çık.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-brand-cloud/40 dark:bg-[#13122a]">
      <NewsletterBanner />

      {/* 4 sütunlu grid */}
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-2 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Sütun 1 — Marka: mobil+tablet tam genişlik, lg'de 1 sütun */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="mb-3 flex items-center gap-2 font-bold text-lg">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-cyan">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
                Pixvec
              </span>
            </Link>
            <p className="mb-5 text-sm text-muted-foreground">
              Pixel&apos;den vektöre, saniyeler içinde.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand-purple/40 hover:text-brand-purple"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Sütunlar 2-4 */}
          {NAV.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand-purple"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt çizgi */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Pixvec. Tüm hakları saklıdır.</span>
          <span>
            pixvec.co ile{" "}
            <span className="text-red-400">❤️</span>{" "}
            yapıldı
          </span>
        </div>
      </div>
    </footer>
  );
}
