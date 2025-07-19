# OperAja - Food Sharing & Donation Platform

OperAja adalah platform berbagi makanan berbasis web yang memungkinkan pengguna untuk:
- **Mendonasi** makanan berlebih dari perorangan/bisnis rumahan/warung UMKM (semua entitas yang belum memiliki izin berjualan) ke pengguna sekitar
- **Negosiasi harga** untuk makanan donasi
- **Memesan** makanan donasi/jualan dari pengguna lain
- **Mendaftar sebagai donatur bisnis** (resto/katering/cafe/lainnya) untuk berbagi atau menjual makanan
- **Menjual** makanan dengan harga terjangkau
- **Melihat riwayat transaksi** dan statistik kontribusi (penghematan & pengurangan sampah makanan)

Sistem ini dibangun dengan **Next.js** (React) dan menggunakan **MySQL** sebagai database utama.

---

## Fitur Utama

- **Autentikasi**: Signup, login, dan update profil
- **Upload & Donasi/Jualan Makanan**: Unggah makanan, pilih tipe (donasi/jualan), dan atur detail
- **Order & Negosiasi**: Pesan makanan, negosiasi harga (untuk donasi), dan konfirmasi pembayaran
- **Manajemen Donatur Bisnis**: Daftar sebagai UMKM/warung, kelola info bisnis
- **Statistik Kontribusi**: Lihat penghematan dan pengurangan sampah makanan
- **API RESTful**: Endpoint CRUD untuk makanan, order, user, dan bisnis

---

## Cara Menjalankan Project

### 1. Prasyarat

- **Node.js** & **npm** terinstal
- **XAMPP** (atau MySQL server lokal) aktif

### 2. Setup Database

1. **Jalankan XAMPP** dan aktifkan service **MySQL**
2. Buka [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Tidak perlu membuat database manual, aplikasi akan otomatis membuat database `operaja_db` dan tabel-tabel yang dibutuhkan saat dijalankan pertama kali.

> **Catatan:**  
> Default MySQL credentials (XAMPP):  
> - Host: `localhost`  
> - Port: `3306`  
> - Username: `root`  
> - Password: *(kosong)*

### 3. Install Dependency

```bash
cd ta
npm install
```

### 4. Jalankan Server Development

```bash
npm run dev
```

Akses aplikasi di [http://localhost:3000](http://localhost:3000)

### 5. (Opsional) Seed Data & Test Koneksi

- Buka [http://localhost:3000/test-db](http://localhost:3000/test-db)
- Klik **Test Connection** untuk cek koneksi database
- Klik **Seed Database** untuk mengisi data dummy makanan

---

## Struktur Database (Ringkas)

- **food_items**: Data makanan (nama, harga, status, gambar, lokasi, dsb)
- **users**: Data user (nama, email, avatar, rating, dsb)
- **orders**: Data pemesanan makanan (status, user, makanan, dsb)
- **info_bisnis**: Data donatur bisnis/UMKM

---

## API Endpoint Penting

- `POST /api/auth/signup` - Daftar user baru
- `POST /api/auth/login` - Login user
- `GET /api/food-items` - List makanan tersedia
- `POST /api/food-items` - Upload makanan baru
- `POST /api/orders` - Buat order/negosiasi makanan
- `POST /api/business-donor/register` - Daftar sebagai donatur bisnis

---

## Catatan Keamanan

- **JANGAN** gunakan kredensial default untuk production
- Gunakan environment variable untuk konfigurasi sensitif
- Implementasikan autentikasi & otorisasi yang baik untuk deployment publik

---

## Kontribusi / Kerja Sama
- Saya sangat memahami besarnya potensi dari proyek ini. Namun, saya juga memahami banyaknya kekurangan dari prototipe sistem ini.
- Jika anda tertarik untuk memberikan masukan / berkontribusi dalam bentuk apapun untuk mengembangkan ide ini, saya sangat terbuka untuk komunikasi lebih lanjut. Hubungi saya melalui email josua.sinabutar@gmail.com

---

> **Dibuat sebagai prototipe sistem untuk Tugas Akhir Sarjana Program Studi Sistem dan Teknologi Informasi Institut Teknologi Bandung**
