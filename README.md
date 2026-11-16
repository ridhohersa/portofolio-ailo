# Ailo (React + Motion)

Status: dijalankan pengguna dengan `npm run dev`; hasil `npm run build` belum dikonfirmasi. Pembaruan terbaru (tema, navbar hamburger, highlight subjudul, Admin) belum diuji build di lingkungan penyusunnya karena dependency tidak bisa dipasang di sana: jalankan `npm install && npm run build` lebih dulu.

```
npm install
npm run dev      # jalankan lokal
npm run build    # cek build produksi
```

Versi HTML/CSS/JS lama yang sudah diuji ada di `legacy/` (salin `public/assets` ke `legacy/assets` untuk menjalankannya). `package-lock.json` akan dibuat otomatis oleh `npm install`.

## Transisi gallery ↔ detail project (shared element)

- `src/vt.js` — View Transitions API: menandai thumbnail, judul, dan label yang sama di kedua halaman dengan `view-transition-name` unik per project (`p0-thumb`, `p0-title`, ...), lalu menjalankan transisi.
- `src/App.jsx` — transisi dipicu dari perubahan lokasi (bukan klik), sehingga tombol Back/Forward browser dan URL tetap bekerja; arah balik (detail → gallery) berjalan terbalik dan mendarat di posisi scroll semula.
- Identitas per project ada di `FX` pada `src/data.js` (`dur`, `ease`, `kind` wipe/zoom/slide, `dir`, `lag`, `col`). Project baru tanpa entri otomatis mendapat identitas unik dari indeksnya.
- Browser tanpa View Transitions, atau pengguna dengan `prefers-reduced-motion`, memakai fallback Motion `layoutId` + fade seperti sebelumnya.

## Tema, navbar, highlight

- `src/theme.js` + skrip kecil di `index.html`: Light (Warm Paper) dan Dark. Pilihan manual disimpan di `localStorage` (`ailo-theme`); tanpa pilihan, ikut sistem. Token warna di `:root` / `:root[data-theme="dark"]` pada `src/index.css` (`--s-*` = permukaan kartu).
- `src/components/Nav.jsx`: desktop horizontal; tablet dan mobile (<= 1023px) hamburger. Tombol tema selalu di bar atas, di luar menu.
- `src/components/Hl.jsx`: garis highlight tulisan tangan untuk subjudul section. Bungkus teks subjudul dengan `<Hl>`.

## Admin Panel (`/admin/login`, `/admin`) — frontend saja, tanpa backend

Tahap ini **tidak memakai backend, database, Supabase, atau API**. Semuanya simulasi lokal:

- **Login demo**: `admin@ailo.demo` / `ailo-demo` (ditampilkan di halaman login). `src/admin/auth.jsx` hanya menyimpan penanda di `localStorage`. Ini **bukan autentikasi yang aman dan tidak boleh dipakai di produksi**.
- **Data**: berasal dari konten website (`src/data.js`, `src/html.js`) plus beberapa data demo bertanda "demo" (testimoni berstatus Pending/Approved/Rejected, satu project draf). Perubahan disimpan di `localStorage` browser ini (kunci berawalan `ailo-admin:v1:`) dan bertahan setelah refresh. Tombol **Reset Demo Data** ada di Settings.
- Admin belum memengaruhi halaman publik: pratinjau ada di dalam panel.

Struktur `src/admin/`:

```
auth.jsx            login simulasi + RequireAdmin (proteksi navigasi frontend)
AdminLayout.jsx     sidebar (collapse, drawer di mobile), topbar, tema
admin.css           semua gaya admin (kelas .adm-*), mengikuti token tema website
data/seed.js        data awal
data/repo.js        penyimpanan localStorage + hook useStore
data/api.js         layanan data (CRUD, urutan, aktivitas). SATU-SATUNYA yang dipanggil halaman
pages/              Dashboard, About, Skills, Projects, Testimonials, Blog, Contact, Settings, Login
ui/                 Sheet (modal/drawer), Feedback (toast + konfirmasi), DataTable, ItemForm (form berbasis konfigurasi), ManagedList, Bits, Icon
```

Untuk beralih ke backend nanti, ganti isi `data/repo.js` dan `data/api.js` (jadikan async/panggil API) dan `auth.jsx` dengan autentikasi sungguhan di server; halaman dan komponen UI tidak perlu diubah banyak. `src/lib/supabase.js` dan `supabase/*.sql` hanya dipakai papan testimoni publik bila `.env` diisi, dan tidak dipakai Admin.
