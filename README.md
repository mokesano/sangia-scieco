# Sangia Scieco – Platform Pengukuran Dampak Riset

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-18.2.0-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.3.3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/php-8.1+-777BB4.svg?logo=php)](https://php.net/)

Sangia Scieco adalah platform berbasis web yang dirancang untuk mengukur dan menganalisis dampak riset khususnya di Indonesia. Aplikasi ini menyediakan dashboard interaktif dengan visualisasi data seperti tren publikasi, peta kolaborasi peneliti, dan peringkat peneliti berdasarkan dampak riset.

> **Live Demo:** [wizdam.sangia.org](https://wizdam.sangia.org)

---

## 🚀 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard Interaktif** | Menampilkan ringkasan data dampak riset nasional secara visual. |
| **Analisis Tren** | Grafik publikasi dan sitasi dari waktu ke waktu. |
| **Peta Peneliti** | Visualisasi sebaran peneliti dan kolaborasi antar institusi/daerah. |
| **Peringkat Peneliti** | Daftar peneliti dengan dampak riset tertinggi. |
| **Dampak Artikel** | Analisis mendalam terhadap artikel ilmiah yang paling berpengaruh. |

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **PHP 8.1+** - Server-side runtime
- **MySQL/MariaDB** - Database
- **Composer** - PHP dependency manager

### Frontend
- **React 18** - UI library
- **React Router DOM 6** - Client-side routing
- **Recharts** - Data visualization
- **Tailwind CSS 3** - Utility-first CSS framework
- **Vite** - Build tool & dev server

---

## 📦 Instalasi & Menjalankan Aplikasi

### Prasyarat
- PHP 8.1 atau lebih baru
- MySQL/MariaDB database
- Node.js 18+ dan npm
- Composer

### Langkah-langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/mokesano/sangia-scieco.git
cd sangia-scieco

# 2. Salin file environment
cp .env.example .env

# 3. Edit file .env dengan konfigurasi database Anda
# DB_HOST=localhost
# DB_PORT=3306
# DB_DATABASE=sangia_scieco
# DB_USERNAME=root
# DB_PASSWORD=your_password

# 4. Instal PHP dependencies
composer install

# 5. Instal Node.js dependencies
npm install

# 6. Buat database MySQL
mysql -u root -p -e "CREATE DATABASE sangia_scieco CHARACTER SET utf8mb4;"

# 7. Import skema database
mysql -u root -p sangia_scieco < database/database_schema_full.sql

# 8. Buat direktori storage
mkdir -p storage/logs storage/cache
mkdir -p public/assets/images/resized
mkdir -p public/assets/pdf/compressed
```

### Menjalankan Aplikasi

**Opsi A: Development Mode (Recommended)**

```bash
# Terminal 1: Jalankan Vite dev server untuk React
npm run dev

# Terminal 2: Jalankan PHP built-in server
php -S localhost:8000 -t public/
```

Akses aplikasi di:
- **Frontend (React):** http://localhost:3000 (via Vite)
- **Backend API:** http://localhost:8000/api/v1

**Opsi B: Production Build**

```bash
# Build React untuk production
npm run build

# Jalankan PHP server
php -S localhost:8000 -t public/
```

Akses aplikasi di: http://localhost:8000

---

## 🔧 Konfigurasi Environment

Edit file `.env` untuk menyesuaikan konfigurasi:

```env
# Application
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=sangia_scieco
DB_USERNAME=root
DB_PASSWORD=

# ORCID OAuth
ORCID_CLIENT_ID=your_client_id
ORCID_CLIENT_SECRET=your_client_secret
ORCID_REDIRECT_URI=http://localhost:8000/auth/orcid-callback

# Sangia API (optional)
SANGIA_API_KEY=your_api_key
SANGIA_API_URL=https://api.sangia.org
```

---

## 📁 Struktur Proyek

```
sangia-scieco/
├── app/                    # PHP application logic
│   ├── Core/               # Application container
│   ├── Http/               # Request, Response, Router, Middleware
│   ├── Handlers/           # Request handlers
│   ├── Services/           # Business logic services
│   ├── Repositories/       # Database access layer
│   └── Models/             # Entity classes
├── src/                    # React frontend source
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components
│   ├── layouts/            # Layout components
│   ├── context/            # React Context for global state
│   ├── App.jsx             # Main app component & routing
│   └── main.jsx            # React entry point
├── config/                 # PHP configuration files
├── database/               # Database schemas
├── public/                 # Web server document root
│   ├── index.php           # PHP entry point
│   └── assets/             # Compiled assets
├── storage/                # Logs, cache, uploads
├── vendor/                 # PHP dependencies (Composer)
├── node_modules/           # JS dependencies (npm)
├── .env.example            # Environment template
├── composer.json           # PHP dependencies
├── package.json            # JS dependencies
└── vite.config.js          # Vite configuration
```

---

## 🌐 Routes & Endpoints

### Public Pages
- `/` - Homepage (Researcher List)
- `/researcher/{orcid}` - Researcher Profile
- `/institution/{id}` - Institution Profile
- `/journal/{issn}` - Journal Profile
- `/crawler` - SangiaCrawler Tool

### Authentication
- `/auth/login` - Login page
- `/auth/logout` - Logout
- `/auth/orcid-callback` - ORCID OAuth callback

### Private Pages (Requires Login)
- `/dashboard` - User Dashboard
- `/admin` - Admin Panel

### Tools
- `/tools/image-resizer` - Image Resizer Tool
- `/tools/pdf-compress` - PDF Compressor Tool

### API Endpoints (`/api/v1/*`)
- `/researchers` - List researchers
- `/researchers/top` - Top researchers
- `/researchers/{orcid}` - Get researcher by ORCID
- `/articles` - List articles
- `/articles/top` - Top articles
- `/articles/trends` - Publication trends
- `/institutions` - List institutions
- `/institutions/map` - Institution map data
- `/impact-scores/*` - Impact score calculations
- `/stats` - Dashboard statistics

---

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkap tentang cara berkontribusi, mulai dari melaporkan bug hingga mengirimkan pull request.

---

## 📞 Kontak

Dikembangkan oleh [@mokesano](https://github.com/mokesano)

- **Website:** [wizdam.sangia.org](https://wizdam.sangia.org)
- **Issues:** [GitHub Issues](https://github.com/mokesano/sangia-scieco/issues)
