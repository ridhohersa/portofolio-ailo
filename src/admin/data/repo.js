// Penyimpanan di memori (cache) untuk Admin Panel. Data konten berasal dari API Laravel (dimuat oleh api.js: loadAll) dan setiap
// perubahan dikirim ke server. Hanya `settings` (preferensi tampilan dashboard) dan `activity` (catatan aktivitas) disimpan lokal
// di localStorage browser ini, karena keduanya memang milik browser, bukan konten website.
import {useSyncExternalStore} from "react";

const PREFIX="ailo-admin:v2:";
const LOCAL=new Set(["settings","activity"]);
const REMOTE_DEFAULT={"about.intro":{bio:"",goal:"",facts:[],_title:"Tentang Saya"},contact:{email:"",location:"",socials:[]}};
const LOCAL_DEFAULT={settings:{prefs:{showActivity:true,compactTables:false,projectsView:"table"}},activity:[]};
const mem=new Map(),subs=new Set();
const clone=v=>JSON.parse(JSON.stringify(v));
const emit=()=>subs.forEach(f=>f());
const readLocal=k=>{try{const r=localStorage.getItem(PREFIX+k);return r==null?undefined:JSON.parse(r)}catch{return undefined}};

export function get(key){
  if(!mem.has(key)){
    let v;
    if(LOCAL.has(key)){
      const d=clone(LOCAL_DEFAULT[key]),r=readLocal(key);
      v=key==="settings"&&r&&typeof r==="object"?{...d,...r,prefs:{...d.prefs,...r.prefs}}:(r!==undefined?r:d);
    }else v=clone(REMOTE_DEFAULT[key]??[]);
    mem.set(key,v);
  }
  return mem.get(key);
}
// Mengembalikan false bila localStorage penuh/diblokir (hanya relevan untuk data lokal).
export function set(key,val){
  mem.set(key,val);let ok=true;
  if(LOCAL.has(key)){try{localStorage.setItem(PREFIX+key,JSON.stringify(val))}catch{ok=false}}
  emit();return ok;
}
// Dipakai saat keluar/sesi habis: buang semua data konten dari memori agar tidak tersisa untuk pengguna berikutnya.
export function clearRemote(){
  [...mem.keys()].filter(k=>!LOCAL.has(k)).forEach(k=>mem.delete(k));
  setLoad("idle");emit();
}
export const subscribe=f=>{subs.add(f);return()=>subs.delete(f)};
export const useStore=key=>useSyncExternalStore(subscribe,()=>get(key),()=>get(key));

// Status pemuatan data dari server: idle | loading | ready | error
let load={state:"idle",error:""};const lsubs=new Set();
export const setLoad=(state,error="")=>{load={state,error};lsubs.forEach(f=>f())};
const getLoad=()=>load;
export const useLoad=()=>useSyncExternalStore(f=>{lsubs.add(f);return()=>lsubs.delete(f)},getLoad,getLoad);
