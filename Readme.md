# TukangGercep — Platform Pemesanan Jasa Tukang

TukangGercep adalah aplikasi web berbasis **on-demand service** yang membantu pelanggan mencari dan memesan jasa tukang bangunan sesuai kebutuhan. Penyedia jasa dapat mengelola layanan yang ditawarkan, sedangkan pelanggan dapat melihat detail layanan dan memantau pesanan.

## Tujuan Project

Project ini dikembangkan sebagai Pair Project Hacktiv8 untuk menerapkan konsep backend JavaScript, Express, Sequelize, relasi database, autentikasi, dan operasi CRUD dalam aplikasi jasa konstruksi.

## Fitur Utama

### Pelanggan (`buyer`)
- Membuat akun, login, dan logout.
- Melihat daftar layanan jasa tukang.
- Mencari layanan berdasarkan nama dan memfilter berdasarkan kategori.
- Mengurutkan layanan berdasarkan harga.
- Melihat detail jasa dan informasi penyedia.
- Membuat pesanan dengan alamat pengerjaan.
- Mengunggah foto kondisi bangunan saat membuat pesanan.
- Melihat pesanan sendiri dan membatalkan pesanan yang masih berstatus `pending`.

### Penyedia Jasa (`seller`)
- Membuat akun penyedia jasa.
- Menambahkan layanan baru.
- Melihat, mengubah, dan menghapus layanan miliknya.
- Mengatur ketersediaan layanan.

## Teknologi

- **Node.js** — runtime JavaScript.
- **Express.js** — routing dan server web.
- **EJS** — template halaman.
- **Sequelize** — ORM untuk mengakses database.
- **PostgreSQL** — database relasional.
- **express-session** — pengelolaan session login.
- **bcryptjs** — hashing password.
- **Multer** — menangani upload foto kondisi bangunan.

## Rancangan Database

| Tabel | Fungsi |
|---|---|
| `Users` | Akun pengguna, email, password hash, dan role (`buyer` atau `seller`). |
| `ProviderProfiles` | Informasi tambahan penyedia jasa. |
| `Categories` | Kategori pekerjaan, seperti pengecatan, pemasangan keramik, listrik, dan renovasi. |
| `Items` | Daftar jasa, deskripsi, harga, gambar, kategori, penyedia, dan ketersediaan. |
| `Bookings` | Data utama pesanan pelanggan, alamat, status, total harga, dan foto kondisi bangunan jika ada. |
| `BookingItems` | Rincian jasa yang termasuk dalam suatu pesanan. |

### Relasi Database

- **One-to-One:** `Users` dan `ProviderProfiles`.
- **One-to-Many:** `Users` dan `Items` — satu penyedia dapat menawarkan banyak layanan.
- **One-to-Many:** `Categories` dan `Items` — satu kategori dapat memiliki banyak layanan.
- **One-to-Many:** `Users` dan `Bookings` — satu pelanggan dapat membuat banyak pesanan.
- **Many-to-Many:** `Bookings` dan `Items` melalui `BookingItems` — satu pesanan dapat memuat beberapa layanan, dan satu layanan dapat tercantum di banyak pesanan.

## Routing Utama

| Method | Route | Kegunaan |
|---|---|---|
| `GET` | `/` | Landing page dan daftar layanan unggulan. |
| `GET` | `/items` | Daftar layanan, pencarian, filter, dan pengurutan. |
| `GET` | `/items/:id` | Detail layanan dan form pemesanan. |
| `GET` | `/register` | Form registrasi. |
| `POST` | `/register` | Memproses registrasi. |
| `GET` | `/login` | Form login. |
| `POST` | `/login` | Memproses login. |
| `POST` | `/logout` | Mengakhiri session pengguna. |
| `GET` | `/seller/items` | Daftar layanan milik seller. |
| `POST` | `/seller/items` | Menambahkan layanan. |
| `GET` | `/seller/items/:id/edit` | Form edit layanan. |
| `POST` | `/seller/items/:id/update` | Memperbarui layanan. |
| `POST` | `/seller/items/:id/delete` | Menghapus layanan. |
| `GET` | `/bookings` | Melihat pesanan milik pengguna yang login. |
| `POST` | `/bookings` | Membuat pesanan baru. |
| `POST` | `/bookings/:id/cancel` | Membatalkan pesanan berstatus `pending`. |

## Requirement Pair Project

Implementasi project ditujukan untuk mencakup:

- Model, migration, migration tambahan, dan seeder.
- Relasi One-to-One, One-to-Many, dan Many-to-Many.
- Autentikasi dengan middleware, session, serta bcryptjs.
- CRUD menggunakan Sequelize dan validasi data.
- Search atau sort menggunakan operator Sequelize `Op`.
- Static method, getter atau instance method, hooks, dan helper.
- Eager loading untuk menampilkan data dari dua tabel atau lebih.
- Promise chaining `.then()` dan `.catch()` pada proses penghapusan beserta notifikasi hasilnya.
- Fitur MVP berupa upload foto kondisi bangunan menggunakan Multer, jika package ini disetujui instruktur sebagai package yang belum dibahas di kelas.

## Persiapan Menjalankan Project

### 1. Prasyarat

Pastikan Node.js, npm, dan PostgreSQL tersedia di komputer.

### 2. Buat Database

```sql
CREATE DATABASE tukangercep;
```

### 3. Konfigurasi Environment

Buat file `.env` di root project dan sesuaikan nilainya dengan konfigurasi PostgreSQL lokal.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tukangercep
DB_USER=postgres
DB_PASSWORD=isi_password_postgres_anda
SESSION_SECRET=ganti_dengan_secret_acak_yang_kuat
NODE_ENV=development
```

Jangan mengunggah file `.env` yang berisi password atau secret ke repository publik.

### 4. Instal Dependency

Dari terminal pada folder project, jalankan:

```bash
npm install
```

Pastikan dependency yang digunakan dan script migration/seeder sudah tercantum di `package.json` sesuai konfigurasi project.

### 5. Jalankan Migration, Seeder, dan Aplikasi

Jalankan migration dan seeder memakai script yang tersedia di `package.json`. Setelah database siap, jalankan server menggunakan script start project, kemudian buka:

`http://localhost:3000`

## Catatan Pengembangan

- Nama database pada README ini adalah `tukangercep`; sesuaikan konfigurasi Sequelize bila project menggunakan nama database lain.
- Pastikan relasi Sequelize, migration, nama field, dan form EJS konsisten satu sama lain.
- Validasi akses perlu memastikan buyer hanya mengakses pesanan miliknya dan seller hanya mengelola layanan miliknya.
- Untuk deployment, gunakan session store yang persisten, proteksi CSRF, rate limiting, pemeriksaan konten file upload, dan kebijakan penyimpanan file yang aman.
- Fitur upload foto menggunakan Multer perlu membatasi ukuran dan jenis file serta memvalidasi isi file, bukan hanya ekstensi atau MIME yang dikirim pengguna.
- Pastikan fitur MVP memenuhi persyaratan instruktur mengenai package yang belum dibahas saat lecture.

---

**TukangGercep — Cari Tukang, Kerjaan Gercep.**
Created By :
1. Muhammad Arief Fathansyah
2. Rizki Apriadi