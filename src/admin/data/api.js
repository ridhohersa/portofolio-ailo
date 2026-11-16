// Layanan data untuk Admin Panel, terhubung ke API Laravel. Halaman memanggil fungsi di sini (create/update/remove/move/save) dan memakai
// hook use*. Pembaruan bersifat OPTIMISTIS: tampilan langsung berubah, permintaan dikirim ke server di belakang layar, dan bila server
// menolak, perubahan dibatalkan serta pengguna diberi tahu lewat toast (lihat setErrorSink). Validasi dan hak akses sebenarnya di server.
import {get,set,clearRemote,setLoad,useStore} from "./repo";
import {admin as http} from "../../lib/api";
import * as M from "./mappers";

const uid=()=>Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3);
export const nowIso=()=>new Date().toISOString();

let errorSink=()=>{};
export const setErrorSink=f=>{errorSink=f||(()=>{})};
const fail=(what,e)=>errorSink(`${what} gagal: ${e?.message||"kesalahan tidak diketahui"}. Perubahan dibatalkan.`);

function log(text){set("activity",[{id:uid(),ts:nowIso(),text},...get("activity")].slice(0,40))}

// id sementara untuk baris yang sedang dikirim -> janji id asli dari server
const inflight=new Map();
const realId=id=>inflight.has(id)?inflight.get(id):Promise.resolve(id);

// Koleksi berurutan (daftar). def = penerjemah dari mappers.js, label = nama bagian, nameOf = judul item untuk catatan aktivitas.
function collection(key,def,label,nameOf){
  const rows=()=>get(key);
  const toApi=(row,so)=>def.toApi(row,so,key==="blog"?get("blog.categories"):undefined);
  const save=(arr,msg)=>{set(key,arr);log(label+": "+msg)};
  const sortable=def.sortable!==false;
  return {
    key,sortable,
    all:rows,
    create(item){
      const id="tmp-"+uid(),so=rows().length+1,row={...item,id,_so:so};
      save([...rows(),row],"menambah “"+nameOf(row)+"”");
      const p=http.create(def.path,toApi(row,so)).then(r=>{const real=def.toAdmin(r);set(key,get(key).map(x=>x.id===id?real:x));return real.id});
      inflight.set(id,p);
      p.catch(e=>{set(key,get(key).filter(x=>x.id!==id));fail("Menambah “"+nameOf(row)+"”",e)}).finally(()=>inflight.delete(id));
      return {ok:true,row};
    },
    update(id,patch){
      const prev=rows().find(x=>x.id===id);if(!prev)return {ok:false};
      const row={...prev,...patch};
      save(rows().map(x=>x.id===id?row:x),"mengubah “"+nameOf(row)+"”");
      (async()=>{
        let rid;try{rid=await realId(id)}catch{return}          // penambahan gagal: sudah diberitahukan
        try{
          const r=await http.update(def.path,rid,toApi(row,row._so));
          set(key,get(key).map(x=>x.id===id||x.id===rid?def.toAdmin(r):x));   // samakan dengan jawaban server (slug, tanggal, dst.)
        }catch(e){set(key,get(key).map(x=>x.id===id||x.id===rid?prev:x));fail("Mengubah “"+nameOf(row)+"”",e)}
      })();
      return {ok:true,row};
    },
    remove(id){
      const before=rows(),i=before.findIndex(x=>x.id===id);if(i<0)return {ok:false};
      const cur=before[i];
      save(before.filter(x=>x.id!==id),"menghapus “"+nameOf(cur)+"”");
      (async()=>{
        let rid;try{rid=await realId(id)}catch{return}
        try{await http.remove(def.path,rid)}
        catch(e){const now=get(key);set(key,[...now.slice(0,i),cur,...now.slice(i)]);fail("Menghapus “"+nameOf(cur)+"”",e)}
      })();
      return {ok:true};
    },
    move(id,dir){
      if(!sortable)return {ok:false};
      const before=rows(),a=[...before],i=a.findIndex(x=>x.id===id),j=i+dir;
      if(i<0||j<0||j>=a.length)return {ok:false};
      [a[i],a[j]]=[a[j],a[i]];
      const changed=[];a.forEach((x,k)=>{if(x._so!==k+1){a[k]={...x,_so:k+1};changed.push(a[k])}});
      save(a,"mengubah urutan “"+nameOf(a[j])+"”");
      Promise.all(changed.map(async x=>http.update(def.path,await realId(x.id),{sort_order:x._so})))
        .catch(e=>{set(key,before);fail("Mengubah urutan",e)});
      return {ok:true};
    },
  };
}
// Dokumen tunggal (objek) yang tersimpan di server. persist(nilaiBaru, nilaiLama) -> janji nilai dari server.
function remoteDoc(key,label,persist){
  return {key,get:()=>get(key),save(patch,msg){
    const prev=get(key),v={...prev,...patch};set(key,v);log(label+": "+(msg||"menyimpan perubahan"));
    persist(v,prev).then(r=>{if(r)set(key,r)}).catch(e=>{set(key,prev);fail(label,e)});
    return {ok:true,value:v};
  }};
}
// Dokumen tunggal lokal (preferensi tampilan di browser ini).
function localDoc(key,label){
  return {key,get:()=>get(key),save(patch,msg){const v={...get(key),...patch};const ok=set(key,v);log(label+": "+(msg||"menyimpan perubahan"));return {ok,value:v}}};
}

export const about={
  intro:remoteDoc("about.intro","About · Introduction",v=>http.put("about",M.ABOUT_INTRO.toApi(v)).then(M.ABOUT_INTRO.fromApi)),
  education:collection("about.education",M.EDUCATION,"About · Education",r=>r.n),
  expertise:collection("about.expertise",M.EXPERTISE,"About · Expertise",r=>r.t),
  experience:collection("about.experience",M.EXPERIENCE,"About · Experience",r=>r.n),
  organization:collection("about.organization",M.ORGANIZATION,"About · Organization",r=>r.n),
  certificates:collection("about.certificates",M.CERTIFICATE,"About · Certificates",r=>r.n),
};
export const skills=collection("skills",M.SKILL,"Skills",r=>r.name);
export const projects=collection("projects",M.PROJECT,"Projects",r=>r.title);
export const blog=collection("blog",M.BLOG,"Blog",r=>r.title);
export const testimonials=collection("testimonials",M.TESTIMONIAL,"Testimonials",r=>r.name);
export const contact=remoteDoc("contact","Contact",(v,prev)=>http.put("settings",{settings:M.CONTACT.toApi(v,prev)}).then(M.CONTACT.fromApi));
export const settings=localDoc("settings","Settings");
export const activity={key:"activity",all:()=>get("activity")};

// Memuat semua data dari server (dipanggil AdminLayout saat panel dibuka). Hanya admin terautentikasi yang berhasil.
export async function loadAll(){
  setLoad("loading");
  try{
    const L=(path,def)=>http.list(path).then(r=>r.map(def.toAdmin));
    const [edu,exp,xp,org,cert,sk,pr,bl,te,cats,intro,settingsMap]=await Promise.all([
      L("educations",M.EDUCATION),L("expertises",M.EXPERTISE),L("experiences",M.EXPERIENCE),L("organizations",M.ORGANIZATION),L("certificates",M.CERTIFICATE),
      L("skills",M.SKILL),L("projects",M.PROJECT),L("blog-posts",M.BLOG),L("testimonials",M.TESTIMONIAL),
      http.list("blog-categories"),http.get("about"),http.get("settings")]);
    set("about.education",edu);set("about.expertise",exp);set("about.experience",xp);set("about.organization",org);set("about.certificates",cert);
    set("skills",sk);set("projects",pr);set("blog",bl);set("testimonials",te);set("blog.categories",cats);
    set("about.intro",M.ABOUT_INTRO.fromApi(intro));set("contact",M.CONTACT.fromApi(settingsMap));
    setLoad("ready");
  }catch(e){setLoad("error",e?.message||"Tidak bisa memuat data dari server.")}
}
export const resetStore=clearRemote;

// Hook: data selalu terbaru dan komponen otomatis dirender ulang saat berubah.
export const useData=src=>useStore(src.key);
// Nama kategori blog dari server (dipakai pilihan kategori di halaman Blog).
export const useBlogCategories=()=>useStore("blog.categories").map(c=>c.name);
