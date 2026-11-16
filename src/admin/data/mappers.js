// Penerjemah bentuk data: Admin Panel (singkatan seperti n, p, d) <-> API Laravel (kolom database).
// Fungsi murni tanpa efek samping, supaya mudah diuji. toAdmin(barisApi) -> baris untuk UI; toApi(barisUI, urutan) -> body request.
export const splitList=s=>String(s||"").split(",").map(x=>x.trim()).filter(Boolean);
const nz=v=>(v===""||v==null?null:v);          // string kosong -> null
const MONTHS=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const LEVEL_NAME={SD:"Sekolah Dasar",SMP:"Sekolah Menengah Pertama",SMA:"Sekolah Menengah Atas",SMK:"Sekolah Menengah Kejuruan"};

// "Juli 2024 – sekarang", "Juli – September 2026", "Juli 2025 – Juni 2026". Dipakai bila period_label belum diisi.
export function periodFromDates(start,end,current){
  const d=x=>{const m=String(x||"").match(/^(\d{4})-(\d{2})/);return m?{y:+m[1],m:+m[2]-1}:null};
  const a=d(start),b=d(end);if(!a)return "";
  if(current||!b)return `${MONTHS[a.m]} ${a.y}${current?" – sekarang":""}`;
  if(a.y===b.y)return a.m===b.m?`${MONTHS[a.m]} ${a.y}`:`${MONTHS[a.m]} – ${MONTHS[b.m]} ${a.y}`;
  return `${MONTHS[a.m]} ${a.y} – ${MONTHS[b.m]} ${b.y}`;
}
const period=r=>r.period_label||periodFromDates(r.start_date,r.end_date,r.is_current);
const firstSentence=t=>{const m=String(t||"").match(/^(.+?\.)(\s|$)/);return (m?m[1]:String(t||"")).slice(0,300)};

// "2026-09-30T00:00:00.000000Z" (tengah malam UTC = tanggal tanpa jam) -> "2026-09-30"; selain itu pakai tanggal lokal browser.
export function localDate(iso){
  if(!iso)return "";
  const s=String(iso);if(/T00:00:00(\.0+)?Z?$/.test(s)||/^\d{4}-\d{2}-\d{2}$/.test(s))return s.slice(0,10);
  const d=new Date(s);if(Number.isNaN(+d))return s.slice(0,10);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
const todayLocal=()=>localDate(new Date().toISOString());

// ---------- koleksi: path API + penerjemah ----------
export const EDUCATION={
  path:"educations",sortable:true,
  toAdmin:r=>({id:r.id,_so:r.sort_order,lv:r.level||"",kk:r.level_name||LEVEL_NAME[r.level]||"",n:r.institution,p:period(r),t:r.degree||"",d:r.description||"",
    focus:r.focus||"",act:(r.activities||[]).join(", "),now:!!r.is_current}),
  toApi:(v,so)=>({institution:v.n,level:nz(v.lv),level_name:nz(v.kk),degree:nz(v.t),description:nz(v.d),focus:nz(v.focus),activities:splitList(v.act),
    period_label:nz(v.p),is_current:!!v.now,sort_order:so}),
};
export const EXPERTISE={
  path:"expertises",sortable:true,
  toAdmin:r=>({id:r.id,_so:r.sort_order,t:r.title,d:r.description||""}),
  toApi:(v,so)=>({title:v.t,description:nz(v.d),sort_order:so}),
};
// Admin menyatukan "Peran, Tempat" dalam satu kolom n; di database dipisah menjadi position dan company (pada koma terakhir).
export const EXPERIENCE={
  path:"experiences",sortable:true,
  toAdmin:r=>({id:r.id,_so:r.sort_order,n:[r.position,r.company].filter(Boolean).join(", "),p:period(r),d:r.description||""}),
  toApi:(v,so)=>{
    const n=String(v.n||"").trim(),i=n.lastIndexOf(",");
    return {position:i>0?n.slice(0,i).trim():n,company:i>0?nz(n.slice(i+1).trim()):null,description:nz(v.d),period_label:nz(v.p),sort_order:so};
  },
};
export const ORGANIZATION={
  path:"organizations",sortable:true,
  toAdmin:r=>({id:r.id,_so:r.sort_order,n:r.name,r:r.position||"",p:period(r),d:r.description||""}),
  toApi:(v,so)=>({name:v.n,position:nz(v.r),description:nz(v.d),period_label:nz(v.p),sort_order:so}),
};
export const CERTIFICATE={
  path:"certificates",sortable:false,   // urutan di website: tanggal terbaru dulu
  toAdmin:r=>({id:r.id,n:r.title,k:r.type||"",by:r.issuer||"",date:r.issue_date?String(r.issue_date).slice(0,7):"",hi:r.highlight||"",doc:r.credential_url||""}),
  toApi:v=>({title:v.n,type:nz(v.k),issuer:nz(v.by),issue_date:v.date?v.date+"-01":null,highlight:nz(v.hi),credential_url:nz(v.doc)}),
};

export const SKILL_CATS={hard:"Hard Skills",soft:"Soft Skills",tools:"Tools"};
const SKILL_KEY=Object.fromEntries(Object.entries(SKILL_CATS).map(([k,v])=>[v,k]));
export const SKILL={
  path:"skills",sortable:false,        // website mengurutkan skill dari persentase tertinggi
  toAdmin:r=>({id:r.id,_so:r.sort_order,cat:SKILL_KEY[r.category]||"hard",name:r.name,pct:r.percentage,desc:r.description||"",group:r.group||"",basis:r.basis||"",m:r.mark||""}),
  toApi:(v,so)=>({name:v.name,category:SKILL_CATS[v.cat]||"Hard Skills",group:nz(v.group),mark:nz(v.m),description:nz(v.desc),basis:nz(v.basis),
    percentage:v.pct===""||v.pct==null?null:Number(v.pct),sort_order:so}),
};

export const PROJECT={
  path:"projects",sortable:false,
  toAdmin:r=>({id:r.id,_so:r.sort_order,slug:r.slug,title:r.title,category:r.category,desc:r.description||r.short_description||"",tech:(r.tech||[]).join(", "),
    thumb:r.thumbnail||"",link:r.project_url||"",status:r.status}),
  toApi:(v,so)=>({title:v.title,category:v.category,description:nz(v.desc),short_description:nz(firstSentence(v.desc)),tech:splitList(v.tech),
    thumbnail:nz(v.thumb),project_url:nz(v.link),status:v.status||"draft",sort_order:so}),
};

// Blog: kategori di UI berupa nama (mis. "Poetry"); di API berupa category_ids. `cats` = daftar {id,name} dari server.
export const BLOG={
  path:"blog-posts",sortable:false,
  toAdmin:r=>({id:r.id,slug:r.slug,title:r.title,excerpt:r.excerpt||"",body:r.content||"",category:(r.categories||[])[0]?.name||"",thumb:r.cover_image||"",
    kind:r.kind||"",featured:!!r.featured,status:r.status,date:localDate(r.published_at||r.created_at)}),
  toApi:(v,_so,cats=[])=>{
    const id=cats.find(c=>c.name===v.category)?.id;
    // Tanggal hari ini = terbit sekarang (bila memakai tengah malam UTC, zona waktu admin bisa membuatnya "di masa depan" beberapa jam).
    const published_at=v.date?(v.date===todayLocal()?new Date().toISOString():v.date):null;
    return {title:v.title,slug:v.slug,excerpt:nz(v.excerpt),content:nz(v.body),cover_image:nz(v.thumb),kind:nz(v.kind),featured:!!v.featured,
      status:v.status||"draft",published_at,category_ids:id?[id]:[]};
  },
};

// Testimoni: UI memakai "relation" bebas; di API disimpan di relationship_detail. Kolom relationship (enum) tidak diubah dari panel.
const REL_LABEL={professional:"Rekan kerja",student:"Siswa",teacher:"Guru",client:"Klien",friend:"Teman",collaborator:"Organisasi",other:"Lainnya"};
export const TESTIMONIAL={
  path:"testimonials",sortable:false,
  toAdmin:r=>({id:r.id,name:r.name,relation:r.relationship_detail||REL_LABEL[r.relationship]||"",org:r.organization||r.school_name||r.project_name||"",
    message:r.content,status:r.status,date:r.created_at,email:r.email||""}),
  toApi:v=>({name:v.name,relationship_detail:nz(v.relation),organization:nz(v.org),content:v.message,status:v.status}),
};

// ---------- dokumen tunggal ----------
export const ABOUT_INTRO={
  fromApi:r=>({bio:r?.description||"",goal:r?.goal||"",facts:(r?.facts||[]).map(f=>({k:f.k,v:f.v})),_title:r?.title||"Tentang Saya"}),
  toApi:v=>({title:v._title||"Tentang Saya",description:nz(v.bio),goal:nz(v.goal),facts:(v.facts||[]).map(f=>({k:f.k,v:f.v}))}),
};

// Kontak = site_settings: contact.email, contact.location, social.<nama>. Tautan yang dihapus dikirim sebagai value null.
const SOCIAL_LABEL={behance:"Behance",github:"GitHub",instagram:"Instagram",linkedin:"LinkedIn",youtube:"YouTube",tiktok:"TikTok",x:"X",twitter:"Twitter",facebook:"Facebook"};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
export const socialKey=label=>"social."+String(label||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
export const CONTACT={
  fromApi:map=>({
    email:map?.["contact.email"]||"",location:map?.["contact.location"]||"",
    socials:Object.entries(map||{}).filter(([k,v])=>k.startsWith("social.")&&v).map(([k,v])=>{const n=k.slice(7);return {id:k,label:SOCIAL_LABEL[n]||cap(n),url:v}}),
  }),
  toApi:(v,prev)=>{
    const rows=[{key:"contact.email",value:nz(v.email)},{key:"contact.location",value:nz(v.location)}];
    const keep=new Set();
    (v.socials||[]).forEach(s=>{const key=socialKey(s.label);keep.add(key);rows.push({key,value:s.url})});
    (prev?.socials||[]).forEach(s=>{if(!keep.has(s.id))rows.push({key:s.id,value:null})});   // dihapus admin
    return rows;
  },
};
