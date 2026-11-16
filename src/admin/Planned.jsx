// Kerangka untuk bagian dashboard yang belum diimplementasikan. Ini bukan formulir palsu: tidak ada yang bisa disimpan di sini.
const PLAN={
  about:{t:"About",items:["Profil dan biografi","Pendidikan","Pengalaman","Organisasi","Sertifikat"],tables:"about_profile, education, experience, organizations, certificates"},
  skills:{t:"Skills",items:["Hard Skills, Soft Skills, Tools","Persentase dan deskripsi","Urutan otomatis berdasarkan persentase"],tables:"skills (kolom: kategori, nama, persen, deskripsi)"},
  projects:{t:"Projects",items:["Proyek, kategori, dan deskripsi","Gambar sampul dan galeri","Detail studi kasus"],tables:"projects, plus bucket Storage untuk gambar"},
  blog:{t:"Blog",items:["Artikel, kategori, dan konten","Gambar","Status draf dan terbit"],tables:"articles, plus bucket Storage untuk gambar"},
  contact:{t:"Contact",items:["Email","Tautan media sosial"],tables:"site_settings (atau contact_links)"},
  settings:{t:"Pengaturan konten",items:["Teks hero dan footer","Berkas CV","Pengaturan situs lainnya"],tables:"site_settings, plus bucket Storage untuk CV"},
};
export default function Planned({id}){
  const p=PLAN[id];
  return <div className="ad-planned">
    <h3>{p.t}</h3>
    <p className="ad-note"><strong>Belum aktif.</strong> Pengelolaan {p.t} dikerjakan di tahap berikutnya. Konten bagian ini untuk sementara masih dibaca dari <code>src/data.js</code>.</p>
    <p className="label">Akan mendukung tambah, ubah, dan hapus untuk:</p>
    <ul>{p.items.map(i=><li key={i}>{i}</li>)}</ul>
    <p className="label">Tabel yang dibutuhkan: {p.tables}. Tabel baru dibuat bersama RLS yang sama dengan testimonials (publik hanya baca, admin penuh).</p>
  </div>;
}
