# Pixvec — Proje Durumu

> Bu dosya her önemli değişiklikten sonra güncellenir.
> Yeni bir Claude sohbeti başlatıyorsan buradan bağlamı al.

Son güncelleme: 2026-04-20

---

## Proje Nedir?

Pixvec (pixvec.co) — raster görüntüleri (PNG/JPG/WEBP/BMP) vektör SVG'ye dönüştüren SaaS.
- Frontend: **Vercel** (Next.js)
- Backend: **Render.com** (Python FastAPI + VTracer)

---

## Klasör Yapısı

```
pixvec/
├── app/                          # Next.js App Router sayfaları
│   ├── page.tsx                  # Landing page (/)
│   ├── layout.tsx                # Root layout + SEO metadata
│   ├── globals.css               # Tailwind + Safari webkit fix
│   ├── opengraph-image.tsx       # Dinamik OG image (Edge runtime)
│   ├── sitemap.ts                # /sitemap.xml
│   ├── app/
│   │   └── page.tsx              # /app sayfası — standalone VectorizeWorkspace
│   └── api/
│       └── vectorize/
│           └── route.ts          # Next.js API route — KULLANILMIYOR, sadece yedek
│
├── components/
│   ├── features/
│   │   ├── VectorizeWorkspace.tsx  # ⭐ Ana bileşen: yükleme + preset + slider + download
│   │   ├── Hero.tsx               # Landing hero: copy + upload zone → workspace geçişi
│   │   ├── BeforeAfterDemo.tsx    # Landing "nasıl çalışır" demo slider
│   │   ├── FeaturesGrid.tsx       # Landing özellikler grid
│   │   ├── Pricing.tsx            # Pricing bölümü (içerik placeholder)
│   │   └── SocialProof.tsx        # Sosyal kanıt bölümü
│   ├── layout/
│   │   ├── Header.tsx             # Sticky nav
│   │   ├── Footer.tsx             # Footer
│   │   └── ThemeToggle.tsx        # Dark/light mode
│   └── ui/                        # shadcn/ui bileşenleri (button, card, vb.)
│
├── pixvec-api/                    # ⭐ Python backend (Render.com'da deploy)
│   ├── main.py                    # FastAPI app — POST /vectorize, GET /
│   ├── requirements.txt           # fastapi, uvicorn, vtracer, Pillow, python-multipart
│   ├── Dockerfile                 # python:3.11-slim, shell form CMD (PORT env)
│   └── railway.json               # Railway config (Railway'e geçilmedi, Render kullanılıyor)
│
├── scripts/
│   └── vectorize.py               # Lokal test scripti — Next.js API route için kullanılıyordu
│                                  # Artık aktif değil, yedek olarak duruyor
│
├── lib/
│   ├── wasm/vtracer.ts            # VTracer WASM loader — KULLANILMIYOR (kalite yetersizdi)
│   ├── vectorizers/index.ts       # Eski WASM vektörizasyon — KULLANILMIYOR
│   └── utils.ts                   # cn() helper
│
├── public/
│   ├── images/                    # before-example.png, after-example.png (demo görseller)
│   ├── wasm/vtracer.wasm          # WASM binary — KULLANILMIYOR
│   └── robots.txt
│
├── .env.local                     # NEXT_PUBLIC_API_URL=https://pixvec-api.onrender.com
├── next.config.ts                 # serverExternalPackages: ["vtracer-wasm"]
└── status.md                      # Bu dosya
```

---

## Tamamlanan Özellikler

### Landing Page (/)
- Hero: copy + upload zone → VectorizeWorkspace geçişi (AnimatePresence)
- Before/After demo slider (ReactCompareSlider)
- Features grid, Social proof, Pricing bölümleri
- Header (sticky) + Footer + dark/light mode toggle
- SEO: metadata, OG image, sitemap, robots.txt

### VectorizeWorkspace Bileşeni
- Drag & drop + click to browse dosya yükleme
- **4 preset** (sol panel, seçilince otomatik yeniden vektörize):
  - **Drawing** (varsayılan) — quantize(8 renk) + SHARPEN
  - **Photo** — quantize(16 renk) + SMOOTH
  - **B&W** — grayscale + threshold 128 → siyah/beyaz
  - **Logo** — contrast ×1.3 (sadece)
- Before/after ReactCompareSlider (orijinal vs SVG)
- Download SVG butonu
- Spinner + "Large image" uyarısı (>1MB)
- Hata mesajı + retry

### Backend API (pixvec-api/main.py)
- `POST /vectorize` — FormData: `file` + `preset`
- `GET /` → `{"status": "ok", "service": "pixvec-api"}`
- CORS: localhost:3000, pixvec.co, pixvec.vercel.app
- 10MB limit, 120s timeout
- Pillow preprocessing pipeline (preset'e göre)
- VTracer positional args (SIGSEGV fix)
- EXIF rotation fix (JPEG portrait)

---

## Şu An Nerede

Son yapılan: preset preprocessing + Drawing varsayılan + B&W preset eklendi.
Lokal `.env.local` Render URL'ine güncellendi ve test edildi — çalışıyor.

Commit edilmemiş değişiklikler olabilir — `git status` ile kontrol et.

---

## Sonraki Adımlar (Öncelik Sırasına Göre)

1. `git add -A && git commit && git push` — son değişiklikleri deploy et
2. Render.com'da 4 preset ile production testi
3. Pricing sayfası içeriği (şu an placeholder)
4. Landing page "How It Works" bölümü güncelleme (gerçek flow ile)
5. Auth / kullanıcı sistemi (MVP sonrası)

---

## Önemli Teknik Kararlar

| Karar | Neden |
|---|---|
| VTracer WASM → Python backend | WASM kalitesi çok kötüydü; Python vtracer mükemmel sonuç veriyor |
| Python 3.11 (Dockerfile) | Python 3.14'te keyword args → SIGSEGV crash; 3.11'de sorun yok |
| Positional args (vtracer çağrısı) | Keyword args Python 3.14'te SIGSEGV yapıyor, 3.11'de de riskli |
| Pillow bypass (PNG ≤2000px, logo) | Pillow format dönüşümü kalite kaybına yol açıyordu; bypass ile en iyi kalite |
| compress_level=0 | Pillow PNG sıkıştırması renk bilgisini etkiliyordu |
| Railway → Render.com | Railway CLI multi-service sorunları yaşandı |
| Next.js API route yedekte | Render down olursa fallback olarak kullanılabilir (şu an pasif) |
| Drawing varsayılan preset | Test sonuçları: Drawing en dengeli (7-8/10), Logo en kötü (siyah bg'de 1/10) |
| Logo arka plan temizleme kaldırıldı | Köşe piksel tespiti siyah arka planlı görselleri mahvediyordu |
