# Panduan Instalasi Sangia Scieco

## Instalasi Cepat (Tanpa Script)

Aplikasi Sangia Scieco dirancang untuk dapat langsung digunakan setelah konfigurasi database. Tidak diperlukan script instalasi khusus.

### Langkah-langkah Instalasi Manual:

1. **Clone atau Upload Repository**
   ```bash
   git clone https://github.com/mokesano/sangia-scieco.git
   cd sangia-scieco
   ```

2. **Konfigurasi Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit file `.env` dengan konfigurasi database Anda:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=sangia_scieco
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

3. **Instal Dependencies**
   ```bash
   # PHP dependencies
   composer install
   
   # Node.js dependencies
   npm install
   ```

4. **Setup Database**
   ```bash
   # Buat database
   mysql -u root -p -e "CREATE DATABASE sangia_scieco CHARACTER SET utf8mb4;"
   
   # Import skema
   mysql -u root -p sangia_scieco < database/database_schema_full.sql
   ```

5. **Buat Direktori Storage**
   ```bash
   mkdir -p storage/logs storage/cache
   mkdir -p public/assets/images/resized
   mkdir -p public/assets/pdf/compressed
   ```

6. **Jalankan Aplikasi**
   
   **Development Mode:**
   ```bash
   # Terminal 1: Vite dev server
   npm run dev
   
   # Terminal 2: PHP server
   php -S localhost:8000 -t public/
   ```
   
   **Production Mode:**
   ```bash
   # Build React
   npm run build
   
   # Jalankan PHP server
   php -S localhost:8000 -t public/
   ```

7. **Akses Aplikasi**
   - Development: http://localhost:3000 (Vite) atau http://localhost:8000 (PHP)
   - Production: http://localhost:8000

---

## Struktur Aplikasi

```
/workspace
├── app/                   # Logika bisnis aplikasi
│   ├── Core/              # Container
│   ├── Http/              # Request, Response, Router, Middleware
│   ├── Handlers/          # Request handlers
│   ├── Services/          # Service layer (API client, dll)
│   ├── Repositories/      # Database access layer
│   └── Models/            # Entity/DTO classes
├── src/                   # React frontend source
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components
│   ├── layouts/           # Layout components
│   ├── context/           # React Context for global state
│   ├── App.jsx            # Main app component & routing
│   └── main.jsx           # React entry point
├── library/               # Library kustom (bukan vendor)
├── config/                # File konfigurasi
├── database/              # Skema database
├── public/                # File publik (document root)
│   ├── index.php          # Entry point aplikasi
│   └── assets/            # Compiled assets
├── storage/               # Logs, cache, uploads
├── vendor/                # Composer dependencies
└── node_modules/          # npm dependencies
```

## Konfigurasi Pasca Instalasi

### 1. Dashboard Admin
Setelah login sebagai admin, Anda dapat:
- Mengelola pengguna (peneliti, institusi)
- Membuat dan mengelola API keys
- Memantau job queue (crawling, analysis)
- Melihat statistik dan visualisasi GeoIP

### 2. Integrasi Sangia API
- Kunjungi `https://developers.sangia.org` untuk dokumentasi API
- Buat API key baru dari dashboard admin
- Konfigurasi endpoint API di pengaturan

### 3. Fitur Utama
- **Researcher Profile**: Peneliti dapat mengelola profil, publikasi, dan metrik
- **Sangia Impact Score**: Analisis dampak penelitian berbasis SDGs
- **Crawling Otomatis**: Fetching data dari Sinta, Scopus, ORCID, dll
- **GeoIP Mapping**: Visualisasi lokasi peneliti dan institusi
- **Multi-tier Subscription**: Free, Pro, Enterprise

## Troubleshooting

### Error: "Database connection failed"
- Periksa kredensial database di file `.env`
- Pastikan database user memiliki hak akses yang sesuai
- Cek apakah host database benar (biasanya `localhost`)

### Error: "Permission denied"
- Set chmod 755 atau 777 untuk folder storage
- Periksa ownership folder

### Error: "npm run dev tidak berjalan"
- Pastikan Node.js versi 18+ terinstal
- Hapus `node_modules` dan jalankan `npm install` ulang

### Error: "Composer tidak menemukan dependencies"
- Pastikan PHP 8.1+ terinstal
- Hapus `vendor` dan jalankan `composer install` ulang

## Dukungan

Untuk bantuan lebih lanjut:
- Dokumentasi API: https://developers.sangia.org
- Email support: support@sangia.org

---

**Catatan Penting**:
- Aplikasi tidak memerlukan script instalasi khusus
- Cukup konfigurasi `.env` dan database, aplikasi langsung aktif
- Backup database secara berkala
