// Data portofolio: skills, proyek, testimoni, dan artikel blog.
// Edit file ini untuk mengganti konten tanpa menyentuh logika.
// SKILLS. Semua angka berasal dari data yang sudah ada; yang diturunkan diberi `basis` (tampil kecil di bawah bar) dan mudah diganti.
//  hard  = bidang keahlian: {n, p (persen), d (deskripsi), basis?}
//  soft  = [nama, persen]
//  tools = software & teknologi: {n, p, d, m (monogram), g (grup), icon? (path logo, opsional), basis?}
// Front-End Development belum punya angka sendiri: dihitung dari rata-rata HTML & CSS dan JavaScript. Ganti `p` bila punya nilai asli.
const WEB={html:65,js:50,php:50},FRONTEND=Math.round((WEB.html+WEB.js)/2),UIUX=80,GRAPHIC=75;
const SKILLS={
hard:[
{n:"Front-End Development",p:FRONTEND,d:"Membangun dan mengembangkan antarmuka website yang responsif dengan memperhatikan struktur, tampilan, dan pengalaman pengguna.",basis:"Rata-rata HTML & CSS dan JavaScript"},
{n:"UI/UX Design",p:UIUX,d:"Merancang wireframe, prototipe, dan antarmuka situs web serta aplikasi dengan fokus pada pengalaman pengguna."},
{n:"Graphic Design",p:GRAPHIC,d:"Membuat materi visual untuk kegiatan sekolah, organisasi, dan proyek desain."},
{n:"Photography",p:70,d:"Mendokumentasikan kegiatan sekolah dan organisasi lewat foto."},
{n:"Video Editing",p:65,d:"Menyunting video untuk kegiatan sekolah dan organisasi."}],
soft:[["Kreativitas",75],["Adaptabilitas",75],["Perhatian pada Detail",75],["Rasa Ingin Tahu",75]],
tools:[
{g:"Web & kode",n:"HTML & CSS",p:WEB.html,m:"</>",d:"Teknologi dasar untuk membangun struktur dan mengatur tampilan antarmuka website."},
{g:"Web & kode",n:"JavaScript",p:WEB.js,m:"JS",d:"Digunakan untuk menambahkan interaksi dan fungsionalitas pada website."},
{g:"Web & kode",n:"PHP & MySQL",p:WEB.php,m:"PHP",d:"Teknologi pendukung untuk pengembangan website dinamis dan pengelolaan basis data."},
{g:"Web & kode",n:"VS Code",p:FRONTEND,m:"VS",d:"Editor kode untuk mengembangkan dan mengelola proyek website.",basis:"Acuan: Front-End Development"},
{g:"Desain",n:"Figma",p:UIUX,m:"Fg",d:"Tool utama untuk membuat wireframe, prototype, dan desain antarmuka.",basis:"Acuan: UI/UX Design"},
{g:"Desain",n:"Adobe Photoshop",p:GRAPHIC,m:"Ps",d:"Pengolahan foto dan elemen visual, mendukung Graphic Design dan Photography.",basis:"Acuan: Graphic Design"},
{g:"Desain",n:"Adobe Illustrator",p:GRAPHIC,m:"Ai",d:"Ilustrasi vektor dan elemen visual, mendukung Graphic Design.",basis:"Acuan: Graphic Design"},
{g:"Desain",n:"Canva",p:GRAPHIC,m:"Cv",d:"Materi visual dan presentasi studi kasus, mendukung Graphic Design.",basis:"Acuan: Graphic Design"}]};
// ABOUT: semua isi halaman About.
const ABOUT={
intro:{facts:[["Nama","Muhammad Ridho Hersa"],["Peran","UI/UX Designer"],["Sekolah","SMKN 2 Banjarmasin · XII PPLG A"],["Bahasa","Indonesia, Inggris"]],
  goal:"Berniat masuk ke agensi kreatif, baik sebagai UI/UX designer maupun desainer grafis, dan terbuka untuk menjajal 3D meski bukan bidang utama."},
education:[
  {lv:"SD",kk:"Sekolah Dasar",n:"MI Innayah Thalibin II"},
  {lv:"SMP",kk:"Sekolah Menengah Pertama",n:"MTs Innayah Thalibin",focus:"Mengeksplorasi hal-hal baru dan mengembangkan pengalaman.",act:["Ekstrakurikuler Habsyi","Pidato bahasa Inggris"]},
  {lv:"SMK",kk:"Sekolah Menengah Kejuruan",now:true,n:"SMKN 2 Banjarmasin",p:"Juli 2024 – sekarang",t:"Program Keahlian Pengembangan Perangkat Lunak dan Gim (PPLG)",d:"Fokus pada desain UI/UX dan desain grafis, dengan dasar pengembangan web (HTML, CSS, JavaScript, PHP, MySQL), serta fotografi, desain grafis, dan penyuntingan video lewat kegiatan sekolah dan organisasi."}],
expertise:[["Desain UI/UX","Wireframe, prototipe, dan desain antarmuka di Figma."],["Desain grafis","Materi visual untuk sekolah, organisasi, dan proyek."],["Pengembangan web","HTML, CSS, JavaScript, PHP, dan MySQL."],["Fotografi & video","Dokumentasi dan penyuntingan untuk kegiatan sekolah dan organisasi."]],
experience:[{n:"Desainer UI/UX, Ailourus",p:"Juli – September 2026",d:"Merancang antarmuka dan pengalaman pengguna untuk proyek situs web, dengan wireframe, prototipe, dan desain UI di Figma."},
  {n:"Desainer UI/UX, Cloverdev",p:"Juli – September 2025",d:"Merancang antarmuka dan pengalaman pengguna untuk situs web dan aplikasi: wireframe, prototipe, dan desain UI di Figma."}],
organization:[{n:"OSIS SMKN 2 Banjarmasin",r:"Seksi Bidang IPTEK",d:"Aktif di kegiatan dan kepanitiaan sekolah, khususnya desain, dokumentasi, dan penyediaan materi visual."}],
// Sertifikat: `date` berformat "YYYY-MM" (tampil sebagai bulan dan tahun). `doc` = tautan dokumen, opsional (baris Dokumentasi hanya tampil bila ada).
certificates:[
  {n:"Business Model Canvas (BMC)",k:"Kompetisi",by:"Universitas Lambung Mangkurat",date:"2026-01"},
  {n:"DiBimbing",k:"Pelatihan",by:"DiBimbing",date:"2026-09"},
  {n:"TOEIC",k:"Bahasa Inggris",hi:"710",by:"Sekolah",date:"2026-05"}]};
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
${fig("/assets/images/memento/problem-and-principles.webp","Slide The Critique and Thesis: paradoks kelimpahan dan lima prinsip","02 / 04 · Kritik &amp; Tesis")}`,
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
${fig("/assets/images/memento/user-journey.webp","Slide The Cognitive Loop: enam tahap alur Memento dari Collect sampai Reinterpret","03 / 04 · Siklus Kognitif")}`,
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
<figure class="fig"><a href="/assets/images/memento/design-system.webp" target="_blank" rel="noopener"><img src="/assets/images/memento/design-system.webp" alt="Lembar design system dan spesifikasi visual Memento" loading="lazy" width="1440" height="2031"></a><figcaption>Lembar design system &amp; spesifikasi visual · klik untuk ukuran penuh</figcaption></figure>`,
"Project features":`<p>Navigasi dibuat seperti bagian dari arsip itu sendiri: tanpa tab bar konvensional, perilakunya seperti kompartemen map fisik yang bergeser di bawah kaca pembesar. Lima node arsip:</p>
<div class="pn">
<div><small>01 // Node_Arsip</small><h5>Archive</h5><em>Brankas fisik</em><ul><li>Feed kronologis</li><li>Peta sebaran spasial</li><li>Indeks pencarian dinamis</li><li>Pengaturan pemudaran</li></ul></div>
<div><small>02 // Node_Arsip</small><h5>Collect</h5><em>Input sensorik aktif</em><ul><li>Fragmen audio</li><li>Pelat ketik sensorik</li><li>Sensor udara sekitar</li><li>Pemindai tiket</li></ul></div>
<div><small>03 // Node_Arsip</small><h5>Explore</h5><em>Lapisan ingatan spasial</em><ul><li>Ping kedekatan</li><li>Konstruksi geofence</li><li>Serpihan sesama lokasi</li><li>Slider waktu</li></ul></div>
<div><small>04 // Node_Arsip</small><h5>Forgotten</h5><em>Folder kenangan yang terlupa</em><ul><li>Kolam kenangan tenggelam</li><li>Pemicu pemudaran manual</li><li>Paket penyelamat fragmen</li><li>Catatan tak tersegel</li></ul></div>
<div><small>05 // Node_Arsip</small><h5>Atelier &amp; Profil</h5><em>Kurasi dan ekspor</em><ul><li>Ekspor cetak biru buku</li><li>Kunci cadangan/segel</li><li>Pemilik bersama kenangan</li><li>Penyetelan akustik</li></ul></div>
</div>
${fig("/assets/images/memento/information-architecture.webp","Slide System Topology: lima node arsip dan fitur di dalamnya","04 / 04 · Topologi Sistem")}`
};
MEMENTO_SEC["Technology and implementation"]=`<p>Proyek ini dirancang menggunakan <strong>Figma</strong> dan <strong>Canva</strong>.</p>`;
const PROJECTS=[
{t:"Moku",c:"UI/UX Design",d:"Desain antarmuka mobile untuk penemuan makanan lokal yang ramah anggaran di Yogyakarta. Tagline: Good food, within reach.",tech:["Mobile UI"],img:"/assets/images/project-moku.jpg",full:"/assets/images/moku/case-study.webp",fullAlt:"Studi kasus Moku: design system, ikon, empat layar utama (Home, Explore, Saved, Profile), alur penemuan makanan, journal, dan halaman penutup"},
{t:"Memento",c:"UI/UX Design",d:"Sistem arsip spasial untuk kenangan yang tidak muat di dalam camera roll. Studi kasus desain sistem dan prototipe iOS: kenangan disimpan sebagai fragmen (suara, kutipan, koordinat) dan muncul kembali saat kamu berada di dekat tempatnya. Tagline: A spatial archive for memories that don't fit inside a camera roll.",tech:["Figma","Canva"],hide:["Demo and source code"],link:"https://www.figma.com/proto/wVYn2DSXyeMf6X49A0uaPm/MEMENTO-%E2%80%94-Product-Design?node-id=3-38&t=HZC0ZBWOaFy8wX6G-1&scaling=min-zoom&content-scaling=fixed&page-id=3%3A9&starting-point-node-id=3%3A21",linkLabel:"Buka prototipe di Figma",img:"/assets/images/memento/portfolio-hero.webp",pos:"50% 55%",sec:MEMENTO_SEC}];
// Transition identity per project (read by src/vt.js). Extra projects without an entry get a unique one derived from their index.
// kind: wipe | zoom | slide (how the cover is revealed) · dir: reveal direction · lag: ms the title trails the cover
const FX=[{col:"var(--sage)",ease:"cubic-bezier(.7,0,.2,1)",dur:".7s",kind:"wipe",dir:"up",lag:90},{col:"var(--grey)",ease:"cubic-bezier(.2,.9,.1,1)",dur:".55s",kind:"zoom",dir:"left",lag:0}];
PROJECTS.forEach((p,i)=>Object.assign(p,FX[i],{i}));
const TESTI=[{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Teacher",d:"2026-11-01",txt:"Placeholder: kutipan asli dari guru akan tampil di sini setelah kamu mendapatkannya.",status:"approved"},{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Supervisor",d:"2026-11-02",txt:"Placeholder: kutipan asli dari pembimbing atau atasan akan tampil di sini.",status:"approved"},{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Friend",d:"2026-11-03",txt:"Placeholder: kutipan asli dari teman akan tampil di sini.",status:"approved"},{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Classmate",d:"2026-11-04",txt:"Placeholder: kutipan asli dari teman sekelas akan tampil di sini.",status:"approved"},{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"Organization",d:"2026-11-05",txt:"Placeholder: kutipan asli dari rekan organisasi akan tampil di sini.",status:"approved"},{n:"Nama pemberi testimonial",rel:"Hubungan dengan saya",org:"Institusi atau organisasi",cat:"User",d:"2026-11-06",txt:"Placeholder: kutipan asli dari pengguna atau klien akan tampil di sini.",status:"approved"}];
const PROJECT_CATS=["UI/UX Design","Design Exploration","Frontend Development","Creative Coding","Learning Notes","Personal Insights","Sastra & Refleksi"];   // saran kategori project (Admin) dan data contoh lama di bawah
// Kategori blog = kategori di database (BlogCategorySeeder). Pewarnaan kartu mengikuti urutan ini.
const CATS=["Articles","Design Notes","Poetry"];
const CCOL=["var(--sage)","var(--grey)","var(--white)"];
const DEMO=[["h","Subjudul contoh"],["p","Placeholder: paragraf pembuka artikel. Ganti dengan tulisanmu sendiri."],["q","Placeholder kutipan."],["ul",["Poin pertama contoh","Poin kedua contoh"]],["img","Gambar pendukung"],["code","// contoh blok kode\nconst nama = 'Ailo';"]];
const POEM=[["poem", "Aku takut petir,\ntapi tetap kudengarkan gemuruh doanya.\nAda sesuatu yang ingin disampaikan langit\nmelalui suara yang selalu kuhindari."], ["poem", "Barangkali bukan amarah,\nbarangkali hanya rindu\nyang tak tahu bagaimana cara mengetuk."], ["poem", "Aku takut petir,\nnamun tak pernah benar-benar berlari dari hujan.\nSebab di antara kilat yang membelah gelap,\nada doa-doa yang jatuh\ntanpa sempat menjadi suara."], ["poem", "Dan jika malam ini langit kembali bergemuruh,\nbiarkan aku diam sebentar.\nBukan karena aku telah kehilangan takut,\nmelainkan karena aku ingin tahu\napa yang sedang disampaikan semesta."], ["sig", "— Muhammad Ridho Hersa"]];
const REF=[["p", "Aku rasa hampir setiap desainer pernah berada di fase ini: membuka Pinterest hanya untuk mencari satu referensi, lalu berakhir dengan puluhan tab yang terbuka."], ["p", "Satu desain menarik perhatian, kemudian desain lainnya terasa lebih menarik. Kita menyimpan banyak gambar, mengumpulkan warna, memperhatikan tipografi, hingga mencoba memahami bagaimana sebuah komposisi dibuat."], ["p", "Awalnya semua terasa seperti proses mencari inspirasi. Namun, terkadang tanpa disadari, kita justru semakin jauh dari ide kita sendiri."], ["h", "Ketika referensi mulai mengambil alih"], ["img", "Kumpulan moodboard, potongan poster, tipografi, dan referensi desain di meja.", "/assets/images/blog/referensi-moodboard.webp"], ["p", "Ada kalanya aku menemukan sebuah desain yang begitu menarik sampai muncul keinginan untuk membuat sesuatu yang serupa."], ["p", "Aku mulai memperhatikan detailnya. Bagaimana teks ditempatkan, bagaimana warna dipadukan, bagaimana ruang kosong digunakan, dan bagaimana setiap elemen saling berhubungan."], ["p", "Tidak ada yang salah dengan itu. Mengamati karya orang lain adalah salah satu cara untuk belajar."], ["p", "Namun, ada satu hal yang menurutku perlu diperhatikan: jangan sampai kita terlalu sibuk mengikuti apa yang sudah dibuat orang lain hingga lupa mempertanyakan apa yang sebenarnya ingin kita buat."], ["p", "Terkadang hasil akhirnya memang terlihat bagus, tetapi terasa seperti bukan milik kita sendiri."], ["h", "Referensi adalah titik awal, bukan tujuan"], ["img", "Buku sketsa, coretan ide, catatan kecil, dan eksplorasi layout.", "/assets/images/blog/referensi-inspirasi.webp"], ["p", "Aku mulai berpikir bahwa referensi seharusnya tidak selalu digunakan untuk menemukan jawaban. Terkadang, referensi justru membantu kita menemukan pertanyaan yang lebih baik."], ["p", "Alih-alih menyalin keseluruhan tampilan, kita bisa mencoba memahami alasan di balik keputusan desain tersebut."], ["p", "Mengapa warna itu dipilih? Mengapa komposisinya dibuat seperti itu? Apa yang membuat desain tersebut terasa menarik?"], ["p", "Dari sana, kita bisa mengambil sesuatu yang lebih mendasar: sebuah ide, pendekatan, atau prinsip visual."], ["p", "Kemudian mengolahnya kembali dengan cara kita sendiri."], ["p", "Bagiku, proses ini jauh lebih menarik daripada sekadar membuat sesuatu yang terlihat mirip dengan referensi."], ["h", "Menemukan bahasa visual sendiri"], ["img", "Tampilan desain di monitor dengan beberapa alternatif layout dan eksplorasi tipografi.", "/assets/images/blog/referensi-eksperimen-digital.webp"], ["p", "Aku tidak berpikir bahwa seorang desainer harus selalu menciptakan sesuatu yang sepenuhnya baru."], ["p", "Hampir semua hal yang kita buat mungkin memiliki pengaruh dari sesuatu yang pernah kita lihat, pelajari, atau alami sebelumnya."], ["p", "Dan mungkin memang seperti itu cara kreativitas bekerja."], ["p", "Yang membedakan bukan selalu dari mana sebuah ide berasal, melainkan bagaimana kita mengolahnya."], ["p", "Aku masih terus mencari gaya visual yang terasa paling dekat dengan diriku sendiri. Masih mencoba berbagai komposisi, warna, tipografi, dan pendekatan yang berbeda."], ["p", "Ada yang berhasil, ada juga yang akhirnya tidak digunakan."], ["p", "Namun, aku rasa tidak masalah. Sebab menemukan karakter sendiri bukan sesuatu yang bisa diselesaikan dalam satu malam."], ["h", "Pada akhirnya"], ["img", "Hasil visual akhir dari proses eksplorasi.", "/assets/images/blog/referensi-hasil-visual.webp"], ["p", "Aku tidak ingin berhenti mencari inspirasi. Aku hanya tidak ingin kehilangan diriku sendiri di antara begitu banyak karya yang kukagumi."], ["p", "Sebab bagiku, desain yang baik bukan hanya tentang seberapa menarik hasil akhirnya, tetapi juga tentang pemikiran dan keputusan yang membentuknya."], ["p", "Mungkin orisinalitas bukan tentang menjadi orang pertama yang melakukan sesuatu."], ["p", "Mungkin, orisinalitas adalah tentang menemukan cara sendiri untuk menceritakan sesuatu yang pernah kita lihat dengan sudut pandang yang berbeda."], ["p", "Dan aku masih dalam proses menemukannya."], ["p", "Catatan kecil dari proses belajar, mengamati, dan terus bereksperimen."], ["p", "— Muhammad Ridho Hersa"]];
const ART=[["contoh-artikel-ui-ux","Contoh artikel UI/UX",0,"2026-11-04",1],["contoh-eksplorasi-desain","Contoh eksplorasi desain",1,"2026-11-03"],["contoh-catatan-frontend","Contoh catatan frontend",2,"2026-11-02"],["contoh-catatan-belajar","Contoh catatan belajar",4,"2026-11-01"]].map(([slug,t,c,d,feat])=>({slug,t,cat:PROJECT_CATS[c],d,feat,ex:"Placeholder: ringkasan artikel. Ganti dengan tulisan asli.",author:"Muhammad Ridho Hersa",body:DEMO}))
// Artikel asli menggantikan contoh pertama. img = cover; kind = jenis tulisan (tampil di samping kategori).
.map(a=>a.slug!=="contoh-artikel-ui-ux"?a:{...a,slug:"gemuruh-doa",t:"Gemuruh Doa",cat:PROJECT_CATS[6],kind:"Puisi",d:"2026-11-14",img:"/assets/images/blog/gemuruh-doa.webp",ex:"Aku takut petir, tapi tetap kudengarkan gemuruh doanya.",body:POEM})
.map(a=>a.slug!=="contoh-eksplorasi-desain"?a:{...a,slug:"antara-referensi-dan-orisinalitas",t:"Antara Referensi dan Orisinalitas",cat:PROJECT_CATS[5],kind:"Design Notes",d:"2026-11-13",feat:0,img:"/assets/images/blog/referensi-moodboard.webp",ex:"Aku tidak ingin berhenti mencari inspirasi. Aku hanya tidak ingin kehilangan diriku sendiri di antara begitu banyak karya yang kukagumi.",body:REF});

export {SKILLS,ABOUT,PROJECTS,TESTI,CATS,PROJECT_CATS,CCOL,ART};
