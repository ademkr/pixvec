# 🚀 Pixvec — Proje Planlama Dokümanı

> **pixvec.co** — AI-Powered Image Vectorization Platform
> Tarih: 16 Nisan 2026 • Versiyon: 1.3

---

## 1. YÖNETİCİ ÖZETİ

**Pixvec** (pixvec.co), raster görüntüleri (PNG, JPG, WEBP, BMP, GIF) yüksek kaliteli vektör grafiklere (SVG, PDF, EPS, DXF) dönüştüren yapay zeka destekli bir web platformudur. Mevcut pazar lideri **Vectorizer.ai**'nin sunmadığı özelliklerle farklılaşarak, tasarımcılar, girişimciler, Etsy satıcıları ve geliştiriciler için tek durak çözüm olmayı hedefler.

### Vizyon

"Daha hızlı, daha akıllı, daha özgür vektörizasyon." Pixvec, açık kaynak motorların gücünü AI ile birleştirerek, kullanıcılara hem tarayıcıda anlık önizleme hem de sunucu taraflı yüksek kaliteli dönüştürme sunar. Ücretsiz tier ile giriş bariyerini ortadan kaldırır.

### Temel Farklılaşma Noktaları

- **Tarayıcı içi WASM önizleme** — Görsel sunucuya gönderilmeden sonuç görülür (gizlilik + hız avantajı)
- **AI Upscaling + Vectorization pipeline** — Düşük çözünürlüklü görseli önce büyüt, sonra vektörize et
- **Çoklu motor karşılaştırma** — VTracer, Potrace, ImageTracer sonuçlarını yan yana göster
- **Artistik modlar ve stil dönüşümleri** — posterized, curvy, sharp, artistic
- **Dahili SVG editör** — Renk değiştirme, katman yönetimi, path düzenleme
- **Ücretsiz plan** — Günde 1 dönüşüm, filigranlı indirme
- **Before/After interaktif slider** — Gerçek zamanlı karşılaştırma

---

## 2. PAZAR ANALİZİ

### 2.1 Vectorizer.ai Profili

| Metrik | Değer |
|--------|-------|
| Aylık Trafik | ~2.69M ziyaret (Mart 2026, Semrush) |
| Global Sıralama | ~21,939 |
| Ana Kitle | Brezilya, ABD, Meksika, Endonezya |
| Fiyatlandırma | Web App: $9.99/ay sınırsız • API: $9.99/ay 50 kredi |
| Bounce Rate | %18.53 (çok iyi kullanıcı tutma) |
| Sayfa/Ziyaret | 14.1 sayfa (yüksek etkileşim) |
| Güçlü Yönleri | 15 yıllık deneyim, kendi AI modeli, geometrik şekil tanıma |
| Zayıf Yönleri | Düzenleme yok, ücretsiz tier kısıtlı, artistik mod yok |

### 2.2 Rakip Haritası

| Rakip | Trafik/Ay | Fiyat | Güçlü Yön | Zayıf Yön |
|-------|-----------|-------|-----------|-----------|
| Vectorizer.ai | 2.69M | $9.99/ay | AI kalitesi, hız | Düzenleme yok, kısıtlı free |
| Vector Magic | 800K | $9.99/ay | Marka bilinirliği | Eski teknoloji |
| SVGConverter | 166K | Ücretsiz | Bedava | Düşük kalite |
| Recraft.ai | 4.3M | Freemium | AI üretim | Farklı segment |
| Vectorizer.io | 422K | $4.99-9.99 | Uygun fiyat | Sınırlı özellik |

---

## 3. ÖZELLİK MATRİSİ

Durum kodları: **VAR** (Vectorizer.ai'de mevcut), **YOK** (mevcut değil), **MVP** (ilk sürümde), **V2** (ikinci sürümde), **V3** (üçüncü sürümde)

### 3.1 Temel Vektörizasyon

| Özellik | Açıklama | Vec.ai | Pixvec |
|---------|----------|--------|-------|
| Raster → SVG dönüşüm | PNG/JPG/WEBP/BMP/GIF giriş | VAR | MVP |
| Çoklu çıkış formatı | SVG, PDF, EPS, DXF, PNG | VAR | MVP |
| Tam renkli izleme | 32-bit ARGB + alfa kanalı | VAR | MVP |
| Geometrik şekil tanıma | Daire, elips, dikdörtgen, yıldız | VAR | V2 |
| Simetri algılama | Ayna ve dönel simetri modelleme | VAR | V2 |
| Sub-pixel hassasiyet | Piksel altı sınır algılama | VAR | V2 |
| Köşe temizleme | Vektör köşeleri optimize etme | VAR | MVP |
| Eğri desteği | Düz çizgi, dairesel/eliptik yay, Bézier | VAR | MVP |
| Adaptif sadeleştirme | Karmaşıklığa göre otomatik ayar | VAR | MVP |
| Palet kontrolü | Renk sayısı ve renk düzenleme | VAR | MVP |
| Gap-filling | Boşluk doldurma seçenekleri | VAR | V2 |
| Adobe uyumluluk modu | SVG çıktı Adobe ile uyumlu | VAR | MVP |

### 3.2 Pixvec'e Özel Yeni Özellikler (Farklılaşma)

| Özellik | Açıklama | Vec.ai | Pixvec |
|---------|----------|--------|-------|
| WASM tarayıcı önizleme | Sunucuya yüklemeden anlık sonuç | YOK | MVP |
| Çoklu motor karşılaştırma | VTracer/Potrace/ImageTracer yan yana | YOK | MVP |
| AI Upscaling pipeline | Düşük çöz. görseli büyütüp vektörize | YOK | MVP |
| Artistik modlar | Posterized, curvy, sharp, artistic stiller | YOK | MVP |
| Before/After slider | Orijinal vs vektör gerçek zamanlı | YOK | MVP |
| Dahili SVG editör | Renk, katman, path düzenleme | YOK | V2 |
| Batch processing + ZIP | Toplu dönüştürme ve tek ZIP indirme | YOK | MVP |
| Ücretsiz günlük kullanım | Günde 1 dönüşüm ücretsiz | YOK | MVP |
| Drag & Drop çoklu dosya | Birden fazla dosya sürükle bırak | YOK | MVP |
| Dönüşüm geçmişi | Son dönüşümleri görüntüleme | YOK | V2 |
| Figma/Canva plugin | Doğrudan tasarım araçlarıyla entegrasyon | YOK | V3 |
| API erişimi | RESTful API + dokümantasyon | VAR | V2 |
| Webhook desteği | Dönüşüm tamamlandığında bildirim | YOK | V3 |
| Beyaz etiket API | Markalı çözüm sunma | YOK | V3 |
| Smart crop | Otomatik alan algılama ve kırpma | YOK | V2 |
| Renk paleti çıkarma | Görsel renk analizi ve önerisi | YOK | V2 |
| SVG optimizasyonu | SVGO entegrasyonu, dosya küçültme | YOK | MVP |
| Karanlık/Aydınlık mod | Kullanıcı tercihine göre tema | YOK | MVP |
| Çoklu dil desteği | TR, EN, ES, PT, DE başlangıç | VAR | V2 |
| PWA desteği | Mobilde uygulama gibi çalışma | YOK | V2 |

---

## 4. TEKNİK MİMARİ

### 4.1 Sistem Mimarisi

| Katman | Teknoloji + Açıklama |
|--------|---------------------|
| **Frontend** | Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4. WASM modülleri (VTracer) tarayıcıda çalışır. Shadcn/ui bileşen kütüphanesi. |
| **Backend API** | Node.js (Fastify) veya Python (FastAPI). Görsel işleme, format dönüşümü, AI upscaling endpoint'leri. Rate limiting + JWT auth. |
| **Vektörizasyon Motorları** | VTracer (Rust/WASM): Ana motor, O(n) performans. Potrace: Siyah-beyaz optimizasyonu. ImageTracerJS: Artistik modlar ve stil presetleri. |
| **AI Pipeline** | Real-ESRGAN veya SwinIR modeli: Görsel upscaling. Opsiyonel: Background removal (rembg). Opsiyonel: Edge detection ön işleme. |
| **Veritabanı** | PostgreSQL (kullanıcılar, abonelikler) + Redis (session, rate limit, kuyruk). S3-uyumlu object storage (görseller). |
| **Altyapı** | Vercel (frontend) + Railway/Fly.io (backend) veya VPS. Cloudflare CDN + DDoS koruması. Docker containerlar. |
| **Ödeme** | Stripe (abonelik + tek seferlik) veya LemonSqueezy. Webhook ile otomatik plan yönetimi. |
| **İzleme** | Sentry (hata takibi) + PostHog (analitik) + Uptime Robot. Google Analytics 4 + reklam dönüşüm takibi. |

### 4.2 Vektörizasyon Motor Detayları

#### VTracer (Ana Motor)
Rust ile yazılmış, WebAssembly desteği olan açık kaynak motor. Renkli görüntüleri destekler, O(n) algoritma karmaşıklığı ile çok hızlıdır. Potrace'e kıyasla çok daha kompakt çıktı üretir (daha az shape, delik yerine stacking stratejisi). Python ve WASM binding'leri mevcuttur.

- **Kullanım:** Logolar, ikonlar, çizimler, taramalar, fotoğraflar
- **Preset'ler:** bw, poster, photo
- **Modlar:** pixel, polygon, spline
- **WASM versiyonu** tarayıcıda çalışarak anlık önizleme sağlar — hem hız hem gizlilik avantajı

#### ImageTracerJS (Artistik Motor)
JavaScript ile yazılmış, tarayıcıda ve Node.js'te çalışır. Public Domain lisanslı. Zengin preset kütüphanesi:
`posterized1-3`, `curvy`, `sharp`, `detailed`, `smoothed`, `grayscale`, `artistic1-4`, `randomsampling1-2`

- **Kullanım:** Artistik stil dönüşümleri, kreatif efektler
- **Fark:** Vectorizer.ai'de bu tür artistik modlar bulunmaz — önemli farklılaşma noktası

#### Potrace (Siyah-Beyaz Uzmanı)
Klasik ve kanıtlanmış motor. Siyah-beyaz görüntülerde mükemmel sonuç verir. GPL lisanslı — sunucu tarafında kullanılabilir, dağıtımda lisans koşullarına dikkat.

### 4.3 AI Upscaling Pipeline

En güçlü farklılaşma noktalarından biri: düşük çözünürlüklü görselleri önce AI ile büyütüp sonra vektörize etme.

1. Kullanıcı düşük çözünürlüklü görsel yükler (örn. 200x200px logo)
2. AI modeli (Real-ESRGAN / SwinIR) görseli 4x büyütür (800x800px)
3. Büyütülmüş görsel VTracer ile vektörize edilir
4. Sonuç, doğrudan düşük çözünürlükten vektörize etmeye kıyasla çok daha temiz ve detaylı olur

### 4.4 Veri Akışı

1. Kullanıcı görseli sürükle-bırak veya dosya seçici ile yükler
2. Tarayıcıda WASM (VTracer) ile anlık önizleme oluşturulur (düşük kalite, hızlı)
3. Kullanıcı parametreleri ayarlar (renk sayısı, mod, stil preset'i)
4. "Yüksek Kalite" butonuna basınca görsel sunucuya gönderilir
5. Sunucu: AI upscaling (opsiyonel) → VTracer/Potrace işleme → SVG optimizasyonu (SVGO)
6. Sonuç kullanıcıya döner, Before/After slider ile karşılaştırma
7. Kullanıcı SVG/PDF/EPS/DXF formatında indirir

---

## 5. TASARIM SİSTEMİ — 2026 TRENDLERİ

Tasarım sistemi, 2026'nın öne çıkan trendlerini harmanlayarak oluşturulmuştur: Pantone 2026 rengi Cloud Dancer'ın sıcak nötr tonları, dark mode-first yaklaşım, sinematik gradyanlar ve "barely-there UI" minimalizmi.

### 5.1 Renk Paleti

| Renk Adı | HEX | Kullanım | Trend Referansı |
|----------|-----|----------|----------------|
| Deep Navy | `#1A1A2E` | Ana arka plan (dark mode) | Dark mode-first, premium his |
| Electric Purple | `#6C63FF` | Ana aksiyonlar, CTA butonlar | Neon-minimal aksanlar |
| Cyan Glow | `#00D2FF` | İkincil aksanlar, hover | AI/tech iridescent paleti |
| Cloud Base | `#F0EEE9` | Light mode arka plan | Pantone Cloud Dancer adaptasyonu |
| Warm Paper | `#F8F7F4` | Kart arka planları | Elevated neutrals trendi |
| Soft Zinc | `#D4D4D8` | Border, ayırıcılar | Barely-there UI, sade çizgiler |
| Emerald | `#10B981` | Başarı, tamamlandı | Doğal, güven veren tonlar |
| Amber | `#F59E0B` | Uyarı, önemli bilgi | Enerji ve dikkat çekme |
| Teal | `#0D9488` | İkincil başlıklar | WGSN Transformative Teal 2026 |
| Pure White Text | `#FAFAFA` | Metin (dark mode) | Göz yormayan saf beyaz yerine |

### 5.2 Tipografi

- **Ana Font:** Inter — Modern, okunabilir, Google Fonts'te ücretsiz. Sistem fontu his verir.
- **Başlık Font (opsiyonel):** Space Grotesk veya Outfit — Geometrik, tech hissi veren display font. Hero section'da kullanılır.
- **Mono Font:** JetBrains Mono — Kod blokları, API dokümentasyonu, teknik detaylar için.

### 5.3 UI Bileşenleri

#### Buton Stilleri
- **Primary CTA:** Gradient arka plan (Electric Purple → Cyan Glow), `border-radius: 12px`, hafif gölge. Hover'da `scale(1.02)` animasyonu. 2026'nın "cinematic gradient" trendi.
- **Secondary:** Ghost/outline stil. 1px border, transparan arka plan. Hover'da hafif arka plan dolgusu.
- **Destructive:** Kırmızı tonlu, dikkatli kullanım.

#### Kartlar ve Yüzeyler
- **Dark mode:** Glassmorphism efekti (`backdrop-filter: blur` + yarı saydam arka plan)
- **Light mode:** Beyaz kart üzerine çok hafif gölge (`shadow-sm`)
- Tüm kartlarda `16px padding`, `12px border-radius`
- 2026'nın "frosted glass" ve "digital texture" trendleriyle uyumlu

#### Animasyonlar
- **Mikro etkileşimler:** Buton hover, dosya yükleme progress, dönüşüm durumu
- **Scroll-triggered:** Özellik kartları yumuşak fade-in
- **Lottie:** Loading durumları, boş durumlar
- **Framer Motion:** Sayfa geçişleri, modal açılış/kapanış
- 2026 trendi: "Her animasyonun bir amacı olmalı — dekoratif değil, bilgilendirici."

### 5.4 Sayfa Yapısı

#### Landing Page (Ana Sayfa)
- **Hero Section:** Büyük başlık + alt başlık + CTA butonu + demo alanı (doğrudan dosya yükleme). Arka planda hafif gradient mesh veya subtle particle efekti.
- **Social Proof:** Kullanıcı sayısı, dönüşüm sayısı, müşteri logoları.
- **Özellikler Grid:** 3 sütunlu bento grid. Her özellik kartı ikon + başlık + kısa açıklama.
- **Karşılaştırma:** Before/After interaktif slider ile canlı demo.
- **Motor Karşılaştırma:** 3 motor sonuçlarını gösteren interaktif section.
- **Fiyatlandırma:** 3 plan kartı (Free, Pro, Enterprise).
- **Footer:** Linkler, sosyal medya, newsletter signup.

#### App Sayfası (Dönüştürme Arayüzü)
- **Sol panel:** Orijinal görsel + ayarlar (motor seçimi, renk sayısı, mod, preset)
- **Sağ panel:** Vektör sonucu + Before/After slider
- **Alt bar:** İndirme formatı seçimi + indirme butonu
- **Sağ üst:** Motor karşılaştırma toggle'ı

---

## 6. FİYATLANDIRMA STRATEJİSİ

| | Free | Pro ($7.99/ay) | Enterprise ($24.99/ay) |
|---|------|----------------|----------------------|
| Dönüşüm | 1/gün | Sınırsız | Sınırsız |
| Motorlar | VTracer | Tüm motorlar | Tüm motorlar |
| AI Upscaling | Yok | Var | Var |
| Batch İşlem | Yok | 10 dosya/seferde | 100 dosya/seferde |
| Çıkış Formatı | SVG (filigranlı) | SVG, PDF, EPS, DXF | SVG, PDF, EPS, DXF |
| SVG Editör | Yok | Temel | Gelişmiş |
| API Erişimi | Yok | Yok | Var (1000 kredi/ay) |
| Filigran | Var | Yok | Yok |
| Destek | Topluluk | E-posta | Öncelikli + canlı |

**Strateji notu:** Vectorizer.ai $9.99/ay ile sınırsız web kullanım sunuyor. Biz $7.99/ay ile daha uygun fiyata daha fazla özellik sunarak fiyat avantajı yaratıyoruz. Ücretsiz plan ise kullanıcı çekme ve organik büyüme için kritik — Vectorizer.ai'de ücretsiz indirme yok.

---

## 7. REKLAM VE PAZARLAMA STRATEJİSİ

### 7.1 Google Ads

- **Arama Kampanyaları:** "image to svg converter", "png to vector", "vectorize image online", "jpg to svg", "raster to vector" gibi yüksek intent anahtar kelimeler. Vectorizer.ai'nin ana trafik kaynağı organik arama (%19.8 Google) — buraya reklam vererek onların organik trafiğini yakalayabiliriz.
- **Rakip Hedefleme:** "vectorizer.ai alternative", "vectorizer.ai free", "better than vectorizer" gibi rakip odaklı aramalar.
- **Display Kampanyaları:** Tasarım sitelerinde (Dribbble, Behance, Creative Bloq) banner reklamlar. Before/After görselleri ile dikkat çekici kreatifler.

### 7.2 Meta Ads (Facebook + Instagram)

- **Hedef Kitle:** Grafik tasarımcılar, Etsy satıcıları, logo tasarımcıları, baskı/kesim işi yapanlar, web geliştiriciler. İlgi alanları: Adobe Illustrator, Canva, Figma, Etsy, Cricut, Silhouette Cameo.
- **Kreatif Stratejisi:** Video: 15 saniyelik before/after dönüşüm videosu. Carousel: Farklı kullanım senaryoları. Story/Reels: Hızlı dönüşüm demosu + "ücretsiz dene" CTA.
- **Dönüşüm Optimizasyonu:** Landing page → ücretsiz dönüşüm deneyimi → Pro plan teklifi. Facebook Pixel + Conversion API entegrasyonu. Lookalike audience oluşturma.

### 7.3 Organik Büyüme

- **SEO:** Blog içerikleri ("How to vectorize an image", "SVG vs PNG", "Best free vectorizer 2026")
- **YouTube:** Tutorial ve karşılaştırma videoları
- **Product Hunt** lansmanı
- **Reddit/Designer** toplulukları
- **Affiliate program** (V3)

---

## 8. YOL HARİTASI (ROADMAP)

| Faz | Süre | Odak | Hedef |
|-----|------|------|-------|
| **MVP** | 4–6 hafta | Temel dönüşüm + WASM önizleme + landing page | İlk kullanıcılar ve feedback |
| **V1.1** | +2 hafta | Batch processing + ücretsiz plan + Stripe entegrasyonu | Gelir başlangıcı |
| **V2** | +4–6 hafta | SVG editör + API + AI upscaling + çoklu dil | Büyüme ve genişleme |
| **V3** | +6–8 hafta | Figma plugin + webhook + beyaz etiket + affiliate | Platform olgunluğu |

### 8.1 MVP Detaylı Görev Listesi (Claude Code için)

1. Next.js projesi oluştur (App Router, TypeScript, Tailwind CSS 4, Shadcn/ui)
2. Landing page: Hero + özellikler grid + before/after slider + fiyatlandırma
3. VTracer WASM modülünü entegre et (tarayıcı tarafında önizleme)
4. ImageTracerJS entegre et (artistik modlar)
5. Dosya yükleme sistemi (drag & drop, çoklu dosya, format kontrolü)
6. Dönüşüm arayüzü: Motor seçimi, parametre ayarları, gerçek zamanlı önizleme
7. Çoklu motor karşılaştırma görünümü (split view)
8. SVG/PDF indirme sistemi
9. Dark/Light mode toggle
10. Backend: Fastify/FastAPI sunucu, VTracer Python binding, SVGO optimizasyonu
11. Günlük ücretsiz limit sistemi (IP/cookie bazlı, MVP için basit)
12. Responsive tasarım (mobil uyum)
13. SEO meta tag'lar, Open Graph, yapısal veri
14. Google Analytics 4 + Facebook Pixel entegrasyonu
15. Performans optimizasyonu (Core Web Vitals)

---

## 9. CLAUDE CODE İÇİN TEKNİK NOTLAR

### 9.1 Dosya Yapısı (Önerilen)

```
pixvec/
├── app/                    # Next.js App Router sayfa dosyaları
│   ├── page.tsx            # Landing page
│   ├── app/page.tsx        # Dönüştürme arayüzü
│   ├── pricing/page.tsx    # Fiyatlandırma
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Shadcn/ui bileşenleri
│   ├── layout/             # Header, Footer, Navigation
│   └── features/           # Hero, BeforeAfter, EngineCompare, FileUpload
├── lib/
│   ├── wasm/               # VTracer WASM loader ve wrapper
│   ├── vectorizers/        # Motor abstraction layer
│   ├── utils.ts            # Yardımcı fonksiyonlar
│   └── api.ts              # API client
├── public/
│   ├── wasm/               # VTracer WASM binary
│   └── images/             # Statik görseller
├── styles/
│   └── globals.css         # Tailwind + custom CSS
├── server/                 # Backend API (ayrı repo veya monorepo)
│   ├── routes/
│   ├── services/
│   └── index.ts
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### 9.2 Kritik Bağımlılıklar

| Paket | Versiyon | Amaç |
|-------|----------|------|
| next | 15.x | React framework (App Router) |
| react | 19.x | UI kütüphanesi |
| tailwindcss | 4.x | Utility-first CSS |
| @shadcn/ui | latest | Bileşen kütüphanesi (Radix tabanlı) |
| vtracer-wasm | npm/custom | Tarayıcı tarafı vektörizasyon |
| imagetracerjs | 1.2.6 | Artistik vektörizasyon modları |
| framer-motion | 11.x | Animasyon kütüphanesi |
| svgo | 3.x | SVG optimizasyonu |
| stripe | latest | Ödeme sistemi |
| next-themes | latest | Dark/Light mode |
| lucide-react | latest | İkon seti |
| react-compare-slider | latest | Before/After slider bileşeni |

### 9.3 Tailwind CSS Renk Konfigürasyonu

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1A1A2E',
          purple: '#6C63FF',
          cyan: '#00D2FF',
          cloud: '#F0EEE9',
          paper: '#F8F7F4',
          zinc: '#D4D4D8',
          emerald: '#10B981',
          amber: '#F59E0B',
          teal: '#0D9488',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
}
```

### 9.4 VTracer WASM Entegrasyonu (Örnek)

```typescript
// lib/wasm/vtracer.ts
let wasmModule: any = null;

export async function initVTracer() {
  if (!wasmModule) {
    wasmModule = await import('/wasm/vtracer_wasm.js');
    await wasmModule.default();
  }
  return wasmModule;
}

export async function vectorizeInBrowser(
  imageData: ImageData,
  options: VTracerOptions
): Promise<string> {
  const vtracer = await initVTracer();
  const svgString = vtracer.convert(
    imageData.data,
    imageData.width,
    imageData.height,
    JSON.stringify(options)
  );
  return svgString;
}

interface VTracerOptions {
  colormode?: 'color' | 'bw';
  color_precision?: number;      // 1-8, default 6
  filter_speckle?: number;       // default 4
  corner_threshold?: number;     // default 60
  segment_length?: number;       // default 4
  splice_threshold?: number;     // default 45
  mode?: 'pixel' | 'polygon' | 'spline';
  preset?: 'bw' | 'poster' | 'photo';
}
```

### 9.5 Performans Hedefleri

- Lighthouse skoru: 90+ (tüm kategoriler)
- LCP (Largest Contentful Paint): < 2.5 saniye
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- WASM önizleme süresi: < 3 saniye (ortalama görsel)
- Sunucu taraflı dönüşüm: < 10 saniye (yüksek kalite)

---

## 10. SONUÇ VE SONRAKI ADIMLAR

Pixvec, açık kaynak motorların gücünü modern web teknolojileri ve AI ile birleştirerek Vectorizer.ai'ye güçlü bir rakip olma potansiyeline sahiptir. Artistik modlar, WASM önizleme ve çoklu motor karşılaştırma gibi benzersiz özellikler, kullanıcıların ilgisini çekecektir.

- **Proje Adı:** Pixvec
- **Domain:** pixvec.co
- **Anlam:** Pixel → Vector (tam olarak ne yaptığını özetliyor)

---

## 11. CLAUDE CODE SKILL KURULUM REHBERİ (OPSİYONEL)

Claude Code, doküman bazlı çalışırken bile mükemmel kod üretir. Bu doküman yeterince detaylıdır. **Skill yüklemek opsiyoneldir** — ama istersen projeyi daha da güçlendirebilir.

### 11.1 Önemli: Doğru Komut Sözdizimi

Claude Code'un kendi komut sistemi var. Komutlar **slash (`/`) ile** başlar ve **Claude Code chat kutusuna** yazılır, terminale değil. Kurulum için 3 yol var:

**Yöntem A — Etkileşimli Menü (En Kolay)**

Claude Code chat kutusunda:

```
/plugin
```

Açılan menüde:
- **Discover** sekmesi: Mevcut skill'leri gör
- **Marketplaces** sekmesi: Yeni marketplace ekle
- **Installed** sekmesi: Yüklü skill'leri yönet

**Yöntem B — Doğrudan Komut**

```
/plugin marketplace add alirezarezvani/claude-skills
/plugin install senior-frontend@claude-code-skills
/reload-plugins
```

### 11.2 Önerilen Skill'ler

Pixvec MVP'si için tek bir skill yeterli:

#### `senior-frontend` (Opsiyonel ama faydalı)

React, Next.js, TypeScript, Tailwind CSS için kapsamlı frontend skill'i. Component scaffolding, performans optimizasyonu ve UI best practice'leri içerir.

**Kurulum:**

```
/plugin marketplace add alirezarezvani/claude-skills
```

Ardından:

```
/plugin install senior-frontend@claude-code-skills
```

Son olarak:

```
/reload-plugins
```

### 11.3 Skill Yüklemeden Başlamak (TAVSİYE EDİLEN)

**Dürüst öneri:** Bu doküman yeterince detaylı. Tasarım sistemi, renk paleti, teknik mimari, dosya yapısı hepsi yazılı. Skill yüklemeden başlayıp, ilerledikçe ihtiyaç hissedersen eklemek daha verimli bir yaklaşım.

### 11.4 Pixvec Geliştirmeye Başlama

Claude Code'a bu `.md` dosyasını ver (drag & drop veya `@` ile referans göster) ve şu talimatı yaz:

```
Bu dokümanı dikkatli oku. Pixvec projesinin MVP'sini geliştireceğiz.
Bölüm 8.1'deki MVP görev listesindeki 1. maddeden başla.

Domain: pixvec.co
Bölüm 5'teki tasarım sistemini ve renk paletini kullan.
Bölüm 9'daki teknik notlara ve dosya yapısına uy.

Her adımda bana ilerlemeyi göster ve onay al.
```

Sonraki görevler için:

```
MVP görev listesindeki 2. maddeye geç: Landing page oluştur.
```

Bu şekilde adım adım ilerleyebilirsin.

---

## 12. HEMEN YAPILACAKLAR

1. ✅ Proje adı kesinleşti: **Pixvec** (pixvec.co)
2. ⬜ Domain'i satın al (pixvec.co)
3. ⬜ Claude Code'a bu `.md` dosyasını ver ve MVP'ye başla (Bölüm 11.4)
4. ⬜ (Opsiyonel) İlerledikçe ihtiyaç hissedersen skill yükle (Bölüm 11.2)
5. ⬜ Google Ads ve Meta Ads hesaplarını hazırla
6. ⬜ Reklam kreatiflerini tasarla (before/after görseller ve videolar)
