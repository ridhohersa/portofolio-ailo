// Data portofolio: skills, proyek, testimoni, dan artikel journal.
// Edit file ini untuk mengganti konten tanpa menyentuh logika.
const SKILLS={hard:[["Desain UI/UX",80],["Desain grafis",75],["Fotografi",70],["Penyuntingan video",65],["HTML & CSS",65],["JavaScript",50],["PHP & MySQL",50]],soft:[["Kreativitas",75],["Adaptabilitas",75],["Perhatian pada detail",75],["Rasa ingin tahu",75]]};
// Konten detail proyek Memento (ringkasan dari slide case study dan design system sheet).
const fig=(src,alt,cap)=>`<figure class="fig"><img src="${src}" alt="${alt}" loading="lazy" width="1440" height="900"><figcaption>${cap}</figcaption></figure>`;
const MEMENTO_SEC={
"Project overview":`<p class="pq">Arsip spasial untuk kenangan yang tidak muat di dalam camera roll.</p>
<p>Memento adalah studi kasus desain sistem dan prototipe untuk aplikasi iOS yang memperlakukan kenangan sebagai fragmen: sepotong suara, kutipan, koordinat, atau tiket, bukan file foto 4K yang rata. Antarmukanya dirancang seperti laci arsip atmosferik, bukan feed.</p>
<dl class="pm-meta"><div><dt>Sektor</dt><dd>Arsip digital</dd></div><div><dt>Format</dt><dd>Spatial / iOS</dd></div><div><dt>Waktu</dt><dd>Musim gugur 2025</dd></div><div><dt>Kode sistem</dt><dd>MMNT-V1.0</dd></div></dl>`,
"Problem and objectives":`<p class="label">Paradoks kelimpahan</p>
<p class="pq">Belum pernah ada sebanyak ini cara menyimpan kenangan, namun sebagian besar justru hilang di dalam camera roll.</p>
<p>Feed foto modern mendorong produksi visual berlebihan, tetapi gagal menangkap fragmen sensorik, temporal, dan spasial yang membentuk arsip mental kita. Tujuan Memento adalah arsip yang aktif dan disengaja, yang memerlukan kurasi dan interaksi, dengan lima prinsip desain berikut.</p>
<ol class="pl">
<li><b>01</b><div><strong>Kenangan adalah fragmen</strong><span>Kita mengingat potongan sensorik, seperti tekstur, koordinat, atau waktu, bukan file 4K yang rata.</span></div></li>
<li><b>02</b><div><strong>Menyimpan bukan mengingat</strong><span>Pengarsipan harus aktif dan disengaja, dengan kurasi dan interaksi.</span></div></li>
<li><b>03</b><div><strong>Ketidaksempurnaan melahirkan karakter</strong><span>Rekaman yang aus atau kutipan yang sedikit keliru lebih membekas daripada metadata yang sempurna.</span></div></li>
<li><b>04</b><div><strong>Waktu mengubah makna</strong><span>Satu node spasial yang sama bisa memudar atau berubah seiring tahun-tahun yang menumpuk di belakangnya.</span></div></li>
<li><b>05</b><div><strong>Antarmuka terasa seperti sebuah tempat</strong><span>Tanpa lembar putih atau feed generik. Harus terasa seperti laci kenangan yang beratmosfer.</span></div></li>
</ol>
${fig("assets/images/memento/problem-and-principles.webp","Slide The Critique and Thesis: paradoks kelimpahan dan lima prinsip","02 / 04 · Kritik &amp; Tesis")}`,
"Design process":`<p class="label">Siklus Memento</p>
<p class="pq">Sebuah kenangan tidak pernah benar-benar selesai.</p>
<p>Alur inti dirancang sebagai siklus yang bisa dimasuki ulang: setiap kali kenangan dikunjungi lagi, ia mendapat artefak dan lapisan konteks baru.</p>
<ol class="loop">
<li><b>01 Collect</b><strong>Kumpulkan potongan</strong><span>Tangkapan sensorik: potongan suara mentah, lokasi, atau kalimat yang diketik.</span></li>
<li><b>02 Capture</b><strong>Cap waktu spasial</strong><span>Metadata lingkungan dicatat otomatis (ketinggian, tekanan udara, rute).</span></li>
<li><b>03 Compose</b><strong>Susun kolase</strong><span>Rangkai tiket digital, serpihan teks, dan koordinat suasana di halaman kertas spasial.</span></li>
<li><b>04 Preserve</b><strong>Simpan di arsip</strong><span>Kolase disegel dengan simulasi stempel fisik dan dienkripsi secara lokal.</span></li>
<li><b>05 Revisit</b><strong>Picu ingatan</strong><span>Ping spasial aktif: kenangan muncul saat kamu berada di dekat lokasinya.</span></li>
<li><b>06 Reinterpret</b><strong>Tambah lapisan konteks</strong><span>Beri catatan pada kenangan lama bertahun-tahun kemudian. Waktu tertulis di lapisan visual.</span></li>
</ol>
${fig("assets/images/memento/user-journey.webp","Slide The Cognitive Loop: enam tahap alur Memento dari Collect sampai Reinterpret","03 / 04 · Siklus Kognitif")}`,
"Final interface":`<p>Design system Memento (MMNT-V1.0) memakai palet kertas arsip yang hangat dengan tiga warna aksen bermakna, tipografi editorial serif dipadu sans dan mono untuk metadata, serta tulisan UX bernada arsip.</p>
<p class="label">Sistem warna</p>
<div class="sw">
<div style="background:#E8E1D5;color:#171615"><b>Kertas Arsip</b>Latar utama<code>#E8E1D5</code></div>
<div style="background:#171615;color:#E8E1D5"><b>Tinta</b>Teks utama<code>#171615</code></div>
<div style="background:#B7AEA0;color:#171615"><b>Debu</b>Sekunder / struktural<code>#B7AEA0</code></div>
<div style="background:#A74432;color:#fff"><b>Merah Oksida</b>Emosional / penting<code>#A74432</code></div>
<div style="background:#344F9E;color:#fff"><b>Ultramarine</b>Audio / suasana<code>#344F9E</code></div>
<div style="background:#68705A;color:#fff"><b>Lumut</b>Lokasi / alam<code>#68705A</code></div>
</div>
<p class="label">Tipografi</p>
<ul class="ty">
<li><span>Cormorant Garamond</span>Display XL 48 / L 36 / M 28: branding, lokasi geografis, kalimat editorial</li>
<li><span>IBM Plex Sans</span>Heading 20 &amp; 16 (Medium), Body 16 / 14 / 12, Caption 11</li>
<li><span>IBM Plex Mono</span>Metadata 11 dan Mono Label 10: cap waktu dan kode serial seperti FRAGMENT 014</li>
</ul>
<p class="label">Aturan dasar</p>
<ul class="ty">
<li><span>Jarak</span>4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 px</li>
<li><span>Radius</span>0 (tajam) · 2 · 4 · 8 · 999 (pil)</li>
<li><span>Garis tepi</span>Hairline 0,5px untuk garis bantu, 1px standar untuk tombol dan wadah, 1px aksen untuk state aktif</li>
<li><span>Grid</span>Viewport mobile 390px: margin 16px, 4 kolom, jarak 12px</li>
<li><span>Ikon</span>Tipis, editorial, geometris, humanis, minimal</li>
</ul>
<p class="label">Nada tulisan UX (teks asli di aplikasi, dicoret = yang dihindari)</p>
<div class="dd">
<p><b>Pakai</b>KEPT.<s>Memory successfully saved.</s></p>
<p><b>Pakai</b>COLLECT SOMETHING.<s>Create new memory.</s></p>
<p><b>Pakai</b>HOW DID IT FEEL?<s>Select an emotion.</s></p>
<p><b>Pakai</b>NOTHING HERE YET.<s>No memories found.</s></p>
<p><b>Pakai</b>LET THIS ONE GO?<s>Are you sure you want to delete?</s></p>
</div>
<figure class="fig"><a href="assets/images/memento/design-system.webp" target="_blank" rel="noopener"><img src="assets/images/memento/design-system.webp" alt="Lembar design system dan spesifikasi visual Memento" loading="lazy" width="1440" height="2031"></a><figcaption>Lembar design system &amp; spesifikasi visual · klik untuk ukuran penuh</figcaption></figure>`,
"Project features":`<p>Navigasi dibuat seperti bagian dari arsip itu sendiri: tanpa tab bar konvensional, perilakunya seperti kompartemen map fisik yang bergeser di bawah kaca pembesar. Lima node arsip:</p>
<div class="pn">
<div><small>01 // Node_Arsip</small><h5>Archive</h5><em>Brankas fisik</em><ul><li>Feed kronologis</li><li>Peta sebaran spasial</li><li>Indeks pencarian dinamis</li><li>Pengaturan pemudaran</li></ul></div>
<div><small>02 // Node_Arsip</small><h5>Collect</h5><em>Input sensorik aktif</em><ul><li>Fragmen audio</li><li>Pelat ketik sensorik</li><li>Sensor udara sekitar</li><li>Pemindai tiket</li></ul></div>
<div><small>03 // Node_Arsip</small><h5>Explore</h5><em>Lapisan ingatan spasial</em><ul><li>Ping kedekatan</li><li>Konstruksi geofence</li><li>Serpihan sesama lokasi</li><li>Slider waktu</li></ul></div>
<div><small>04 // Node_Arsip</small><h5>Forgotten</h5><em>Folder kenangan yang terlupa</em><ul><li>Kolam kenangan tenggelam</li><li>Pemicu pemudaran manual</li><li>Paket penyelamat fragmen</li><li>Catatan tak tersegel</li></ul></div>
<div><small>05 // Node_Arsip</small><h5>Atelier &amp; Profil</h5><em>Kurasi dan ekspor</em><ul><li>Ekspor cetak biru buku</li><li>Kunci cadangan/segel</li><li>Pemilik bersama kenangan</li><li>Penyetelan akustik</li></ul></div>
</div>
${fig("assets/images/memento/information-architecture.webp","Slide System Topology: lima node arsip dan fitur di dalamnya","04 / 04 · Topologi Sistem")}`
};
MEMENTO_SEC["Technology and implementation"]=`<p>Proyek ini dirancang menggunakan <strong>Figma</strong> dan <strong>Canva</strong>.</p>`;
const PROJECTS=[
{t:"Moku",c:"UI/UX Design",d:"Desain antarmuka mobile untuk penemuan makanan lokal yang ramah anggaran di Yogyakarta. Tagline: Good food, within reach.",tech:["Mobile UI"],img:"assets/images/project-moku.jpg",full:"assets/images/moku/case-study.webp",fullAlt:"Studi kasus Moku: design system, ikon, empat layar utama (Home, Explore, Saved, Profile), alur penemuan makanan, journal, dan halaman penutup"},
{t:"Memento",c:"UI/UX Design",d:"Sistem arsip spasial untuk kenangan yang tidak muat di dalam camera roll. Studi kasus desain sistem dan prototipe iOS: kenangan disimpan sebagai fragmen (suara, kutipan, koordinat) dan muncul kembali saat kamu berada di dekat tempatnya. Tagline: A spatial archive for memories that don't fit inside a camera roll.",tech:["Figma","Canva"],hide:["Demo and source code"],img:"assets/images/memento/portfolio-hero.webp",pos:"50% 55%",sec:MEMENTO_SEC}];
const FX=[{col:"var(--sage)",ease:"cubic-bezier(.7,0,.2,1)",dur:".7s"},{col:"var(--grey)",ease:"cubic-bezier(.2,.9,.1,1)",dur:".55s"}];
PROJECTS.forEach((p,i)=>Object.assign(p,FX[i],{i}));
const TESTI=[{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Teacher",d:"2026-11-01",txt:"Placeholder: kutipan asli dari guru akan tampil di sini setelah kamu mendapatkannya.",status:"approved"},{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Supervisor",d:"2026-11-02",txt:"Placeholder: kutipan asli dari pembimbing atau atasan akan tampil di sini.",status:"approved"},{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Friend",d:"2026-11-03",txt:"Placeholder: kutipan asli dari teman akan tampil di sini.",status:"approved"}];
const CATS=["UI/UX Design","Design Exploration","Frontend Development","Creative Coding","Learning Notes","Personal Insights"];
const CCOL=["var(--sage)","var(--grey)","var(--white)","var(--sage)","var(--grey)","var(--white)"];
const DEMO=[["h","Subjudul contoh"],["p","Placeholder: paragraf pembuka artikel. Ganti dengan tulisanmu sendiri."],["q","Placeholder kutipan."],["ul",["Poin pertama contoh","Poin kedua contoh"]],["img","Gambar pendukung"],["code","// contoh blok kode\nconst nama = 'Ailo';"]];
const ART=[["contoh-artikel-ui-ux","Contoh artikel UI/UX",0,"2026-11-04",1],["contoh-eksplorasi-desain","Contoh eksplorasi desain",1,"2026-11-03"],["contoh-catatan-frontend","Contoh catatan frontend",2,"2026-11-02"],["contoh-catatan-belajar","Contoh catatan belajar",4,"2026-11-01"]].map(([slug,t,c,d,feat])=>({slug,t,cat:CATS[c],d,feat,ex:"Placeholder: ringkasan artikel. Ganti dengan tulisan asli.",author:"Muhammad Ridho Hersa",body:DEMO}));
