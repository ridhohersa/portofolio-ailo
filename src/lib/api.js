// Klien API untuk backend Laravel (ailo-api). Tanpa SDK: hanya fetch.
// Konfigurasi: VITE_API_URL, mis. http://localhost:8000/api  (lihat .env.example). Tanpa itu, CONFIGURED=false dan fitur yang butuh server
// menampilkan pesan yang jelas; tidak ada login palsu dan tidak ada data karangan.
// Keamanan sebenarnya ditegakkan server (token Sanctum + role admin + validasi). Kode di sini hanya antarmuka.
const BASE=(import.meta.env?.VITE_API_URL||"").replace(/\/+$/,"");
export const CONFIGURED=!!BASE;

export class ApiError extends Error{
  constructor(message,status=0,errors=null){super(message);this.status=status;this.errors=errors}
}

// ---------- sesi (token disimpan di localStorage browser admin) ----------
const SKEY="ailo-admin-session";
export const readSession=()=>{try{const s=JSON.parse(localStorage.getItem(SKEY)||"null");return s&&s.token?s:null}catch{return null}};
const writeSession=s=>{try{s?localStorage.setItem(SKEY,JSON.stringify(s)):localStorage.removeItem(SKEY)}catch{}};
export const UNAUTHORIZED_EVENT="ailo:unauthorized";

// Pesan galat dari Laravel: {message, errors:{field:[pesan]}}. Ambil pesan validasi pertama agar bisa dibaca pengguna.
const messageOf=(data,status)=>{
  const first=data?.errors&&Object.values(data.errors).flat()[0];
  return first||data?.message||({401:"Sesi berakhir. Silakan masuk lagi.",403:"Akses ditolak.",404:"Data tidak ditemukan.",413:"Berkas terlalu besar.",429:"Terlalu banyak permintaan. Coba lagi sebentar."}[status])||"Permintaan gagal ("+status+")";
};

async function call(path,{method="GET",body,form,auth=false,timeout=15000}={}){
  if(!CONFIGURED)throw new ApiError("Backend belum dikonfigurasi (VITE_API_URL kosong).",0);
  const headers={Accept:"application/json"};
  if(auth){const s=readSession();if(!s)throw new ApiError("Sesi berakhir. Silakan masuk lagi.",401);headers.Authorization="Bearer "+s.token}
  if(body!==undefined)headers["Content-Type"]="application/json";
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),timeout);
  try{
    const res=await fetch(BASE+path,{method,headers,signal:ctl.signal,body:form||(body!==undefined?JSON.stringify(body):undefined)});
    if(res.status===204)return null;
    const text=await res.text();let data=null;try{data=text?JSON.parse(text):null}catch{}
    if(!res.ok){
      if(res.status===401&&auth){writeSession(null);dispatchEvent(new Event(UNAUTHORIZED_EVENT))}
      throw new ApiError(messageOf(data,res.status),res.status,data?.errors||null);
    }
    return data;
  }catch(e){
    if(e instanceof ApiError)throw e;
    throw new ApiError(e.name==="AbortError"?"Server tidak merespons. Coba lagi.":"Tidak bisa terhubung ke server.",0);
  }finally{clearTimeout(t)}
}

// ---------- autentikasi ----------
export async function signIn(email,password){
  const r=await call("/auth/login",{method:"POST",body:{email,password}});
  const s={token:r.token,user:r.user};writeSession(s);return s;
}
// Memastikan token masih diterima server dan mengambil data pengguna terbaru. Mengembalikan sesi atau null.
export async function verifySession(){
  const s=readSession();if(!s)return null;
  try{const user=await call("/admin/me",{auth:true});const n={...s,user};writeSession(n);return n}
  catch(e){if(e.status===401||e.status===403){writeSession(null);return null}throw e}
}
export async function signOut(){
  // Minta server mencabut token (best effort), lalu hapus sesi lokal apa pun hasilnya.
  if(CONFIGURED&&readSession())try{await call("/admin/logout",{method:"POST",auth:true,timeout:5000})}catch{}
  writeSession(null);
}

// ---------- admin ----------
export const admin={
  get:path=>call("/admin/"+path,{auth:true}),
  // Daftar: ambil semua halaman (per_page maks 200 di server).
  async list(path){
    const out=[];let page=1;
    for(;;){
      const r=await call(`/admin/${path}?per_page=200&page=${page}`,{auth:true});
      out.push(...(r.data||[]));
      if(!r.last_page||page>=r.last_page)return out;
      page++;
    }
  },
  create:(path,body)=>call("/admin/"+path,{method:"POST",body,auth:true}),
  update:(path,id,body)=>call(`/admin/${path}/${id}`,{method:"PATCH",body,auth:true}),
  put:(path,body)=>call("/admin/"+path,{method:"PUT",body,auth:true}),
  remove:(path,id)=>call(`/admin/${path}/${id}`,{method:"DELETE",auth:true}),
  // Unggah gambar. Mengembalikan {url,path}; simpan `url` ke kolom gambar.
  upload(file){const f=new FormData();f.append("file",file);return call("/admin/uploads",{method:"POST",form:f,auth:true,timeout:60000})},
};

// ---------- publik ----------
export const pub={
  posts:()=>call("/posts"),
  about:()=>call("/about"),
  skills:()=>call("/skills"),
  settings:()=>call("/settings"),
  projects:()=>call("/projects"),
  project:slug=>call("/projects/"+encodeURIComponent(slug)),
  testimonials:()=>call("/testimonials"),
  submitTestimonial:row=>call("/testimonials",{method:"POST",body:row}),
};
