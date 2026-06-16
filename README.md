# RoadWatch — Panduan Setup & Deploy
Platform Pelaporan Kerusakan Infrastruktur Jalan | UAS Web Programming

---

## Struktur Folder

```
roadwatch/
├── index.html              ← Halaman utama / beranda
├── css/
│   └── style.css           ← Global stylesheet
├── js/
│   ├── auth.js             ← Sistem login, register, session
│   └── data.js             ← CRUD laporan, filter, search
└── pages/
    ├── login.html          ← Halaman login
    ├── register.html       ← Halaman register
    ├── lapor.html          ← Form buat laporan (Kamera + GPS + Filter)
    ├── peta.html           ← Peta interaktif semua laporan
    ├── dashboard.html      ← Dashboard petugas (kelola laporan)
    └── riwayat.html        ← Riwayat laporan warga
```

---

## Akun Demo

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Petugas | petugas@roadwatch.id   | petugas123 |
| Warga   | warga@roadwatch.id     | warga123   |

---

## Fitur yang Diimplementasi

✅ Multi-user Login & Role (Warga vs Petugas)
✅ Camera Access & Image Upload (getUserMedia API)
✅ Image Processing / Filter Effects (Canvas API - grayscale, brightness, contrast, gelap)
✅ GPS Location & Interactive Maps (Leaflet.js + navigator.geolocation)
✅ Smart Search & Filtering (real-time filter by keyword, kategori, status, urgensi)
✅ API Integration (OpenWeatherMap)
✅ Responsive UI (Bootstrap 5)
✅ Automated Email Service (EmailJS)
✅ Cloud Hosting (Netlify)

---

## Setup EmailJS (Wajib untuk notifikasi email)

1. Daftar di https://www.emailjs.com (gratis, 200 email/bulan)
2. Buat **Email Service** (sambungkan ke Gmail)
3. Buat **Email Template** dengan variabel:
   - `{{to_name}}` — Nama warga
   - `{{kategori}}` — Kategori laporan
   - `{{alamat}}` — Alamat lokasi
   - `{{status_baru}}` — Status terbaru
   - `{{catatan}}` — Catatan petugas
   - `{{tanggal}}` — Waktu update
4. Copy **Service ID**, **Template ID**, **Public Key**
5. Buka `pages/dashboard.html`, ganti:
   ```js
   const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← ganti ini
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← ganti ini
   const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← ganti ini
   ```

---

## Setup API Cuaca (OpenWeatherMap)

1. Daftar di https://openweathermap.org (gratis, 1000 call/hari)
2. Ambil API Key dari dashboard
3. Buka `pages/dashboard.html`, ganti:
   ```js
   const WEATHER_API_KEY = 'YOUR_OPENWEATHER_KEY'; // ← ganti ini
   ```

---

## Deploy ke Netlify (Gratis)

### Cara paling mudah (drag & drop):
1. Buka https://netlify.com → Login / Daftar
2. Klik **"Add new site"** → **"Deploy manually"**
3. Drag seluruh folder `roadwatch/` ke area upload
4. Tunggu beberapa detik — langsung dapat URL HTTPS!

### Alternatif via GitHub:
1. Upload folder ke GitHub repository
2. Di Netlify → "Import from Git" → pilih repo
3. Build command: kosongkan | Publish directory: `.`
4. Deploy!

---

## Catatan Penting

- **localStorage** digunakan sebagai database — data tersimpan di browser
- Data tidak hilang saat refresh, tapi hilang jika browser di-clear
- Untuk demo UAS: data bisa ditambahkan manual lewat form laporan
- Kamera hanya bekerja di HTTPS atau localhost (bukan file://)
- Jalankan lewat Live Server (VS Code extension) saat development

---

## Tips Presentasi

1. **Tunjukkan flow lengkap**: Register → Login Warga → Buat Laporan → Logout → Login Petugas → Update Status
2. **Demo kamera**: buka di HP atau lewat kamera laptop
3. **Demo GPS**: klik "Gunakan GPS Saya" di halaman lapor
4. **Demo filter gambar**: upload foto lalu coba filter grayscale/kontras
5. **Demo peta**: tunjukkan pin berwarna di halaman peta + filter real-time
6. **Demo email**: update status laporan dengan email aktif

---

*Dibuat untuk UAS Web Programming — RoadWatch 2025*
