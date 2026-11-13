# 🎀 Celenganku — Sweet & Coquette Savings Tracker 🦢✨

> *"Romanticize your savings journey. Sedikit demi sedikit, semua wishlist manis itu akan jadi milikmu."* 🌸

**Celenganku** adalah antarmuka web (*Front-end*) aplikasi pelacakan tabungan pribadi[cite: 6] yang dirancang ulang dengan estetika **Coquette Pastel**—memadukan palet warna *rose pink*, *soft blush*, aksen pita, serta tipografi klasik yang elegan dan menggemaskan.

Tidak hanya berfokus pada halaman **Riwayat & Laporan**, repositori ini kini hadir dengan **Dashboard Beranda** yang kaya fitur dan interaktif untuk menemani perjalanan menabungmu setiap hari. Dibangun murni menggunakan **HTML5**, **CSS3**, dan **Vanilla JavaScript** tanpa tambahan *framework* atau *library* eksternal[cite: 6].

---

## ✨ Fitur Utama (Coquette Redesign)

### 🌸 Halaman Beranda (`index.html`)
- **💌 Modal Setor Multi-Target Interaktif:** Fitur setor tabungan langsung dengan pratinjau saldo *real-time* yang berfungsi penuh untuk **Tabungan Umum**, **Dana Darurat**, maupun **Laptop Impian**.
- **📊 Dynamic Progress Bar:** Persentase dan *progress bar* pada kartu target otomatis bertambah secara *live* setiap kali setoran dikonfirmasi.
- **🍰 Sweet Weekly Bingo:** Tantangan menabung mingguan interaktif yang bisa diklik (*toggle*) untuk menjaga semangat menabung.
- **🦢 Daily Note & Saving Streak:** Widget afirmasi harian bergaya manis lengkap dengan pelacak konsistensi menabung (*streak badge*) dan daftar *Future Wishlist*.
- **📝 Live Recent Activity:** Setiap setoran baru akan langsung tercatat otomatis di daftar "Catatan Setoran Terakhir" tanpa perlu memuat ulang halaman.

### 🩰 Halaman Riwayat & Laporan (`riwayat.html`)
- **🌷 Ringkasan Arus Kas:** Menampilkan total setoran masuk, penarikan, dan arus kas bersih bulanan[cite: 6].
- **🍩 Visualisasi Alokasi Target:** Grafik donat (*donut chart*) estetis yang dibuat 100% menggunakan CSS murni (`conic-gradient`)[cite: 6].
- **📜 Daftar Transaksi Detail:** Menampilkan riwayat transaksi lengkap dengan ikon menggemaskan, status, dan waktu transaksi[cite: 6].

### 📱 Responsivitas & Navigasi
- **🍔 Mobile Hamburger Menu:** Navigasi otomatis berubah menjadi *dropdown hamburger menu* yang rapi dan mudah diakses saat dibuka melalui layar *handphone*.
- **💻 Desain Responsif Penuh:** Tata letak otomatis menyesuaikan ukuran layar (Desktop lebar, Tablet, hingga *Mobile*) menggunakan kombinasi CSS Grid & Flexbox[cite: 6].

---

## 🎨 Palet Warna & Tipografi

| Elemen | Detail |
| :--- | :--- |
| **Primary Rose Pink** | `#d86c8b` |
| **Soft Blush Pink** | `#fceef2` |
| **Pearl Cream Background** | `#fff9fb` |
| **Warm Cocoa Text** | `#4a353b` |
| **Font Judul (Serif)** | *Playfair Display* (Google Fonts) |
| **Font Utama (Sans-serif)** | *Quicksand* (Google Fonts) |

---

## 🛠️ Teknologi yang Digunakan

- **HTML5** — Struktur semantik modern & elemen `<dialog>` bawaan untuk *modal pop-up*[cite: 5, 6].
- **CSS3** — Variabel kustom (`--color`), Flexbox, CSS Grid, * radial-gradient polka dot pattern*, dan *Media Queries*[cite: 6].
- **JavaScript (Vanilla)** — Pengelolaan *state* tabungan, kalkulasi otomatis *progress bar*, manipulasi DOM *real-time*, dan kontrol menu *mobile*[cite: 6].

---

## 📂 Struktur File

```text
📦 celenganku
 ┣ 📜 index.html      # Halaman utama Dashboard, Target, Bingo & Modal Setor
 ┣ 📜 riwayat.html    # Halaman Riwayat Transaksi, Laporan & Grafik Alokasi
 ┣ 📜 style.css       # Styling utama bertema Coquette & aturan responsif/hamburger
 ┣ 📜 style2.css      # Styling khusus untuk komponen di halaman Riwayat
 ┣ 📜 script.js       # Logika interaktif setoran, bingo, & hamburger menu mobile
 ┗ 📜 README.md       # Dokumentasi proyek