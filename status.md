# Pixvec — Proje Durumu

Son güncelleme: 2026-04-20

## Tamamlanan

### Altyapı
- Next.js 16 + React 19 + Tailwind CSS 4 kurulumu
- Vercel deploy (pixvec.co)
- Safari uyumluluk düzeltmeleri (`-webkit-backdrop-filter`)
- SEO metadata + OG image + sitemap + robots.txt

### Backend (pixvec-api — Render.com)
- FastAPI servisi — `POST /vectorize`, `GET /`
- Python 3.11 + VTracer 0.6.x (positional args — Python 3.14 SIGSEGV fix)
- EXIF rotation fix (JPEG portrait görseller)
- Pillow preprocessing pipeline:
  - PNG ≤2000px + logo preset → bypass (sıfır Pillow işlemi)
  - PNG >2000px → resize only (LANCZOS, compress_level=0)
  - JPEG/WEBP/BMP → EXIF rotate + RGB + compress_level=0
- 4 preset:
  - **Drawing** (varsayılan) — quantize(8) + SHARPEN
  - **Photo** — quantize(16) + SMOOTH
  - **B&W** — grayscale + threshold 128
  - **Logo** — contrast ×1.3 (arka plan temizleme kaldırıldı — siyah arka planlarda bozuyor)
- 120s timeout, 10MB limit
- CORS: localhost:3000, pixvec.co, pixvec.vercel.app

### Frontend (VectorizeWorkspace)
- Dosya yükleme + drag & drop
- Preset seçici (Drawing varsayılan)
- Preset değişince otomatik yeniden vektörize
- Before/after ReactCompareSlider
- Download SVG butonu
- Large file uyarısı (>1MB)
- NEXT_PUBLIC_API_URL env ile API URL ayarı

## Bilinen Sorunlar / Notlar
- Logo preset siyah arka planlı görsellerde zayıf (1/10)
- Portrait görsellerde slider'ın maxHeight=480 limiti var — kesilebilir
- `app/api/vectorize/route.ts` (Next.js route) sadece yedek, aktif değil

## Sonraki Adımlar (Öncelik Sırasına Göre)
1. Deploy güncel kodu Render.com'a push et (`git push`)
2. 4 preset ile production'da test et
3. Pricing sayfası içeriği
4. Auth / kullanıcı sistemi (opsiyonel, MVP sonrası)
5. Landing page "How It Works" bölümü güncelleme
