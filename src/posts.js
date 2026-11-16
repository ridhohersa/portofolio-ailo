// Artikel publik dibaca dari API Laravel (GET /api/posts): server hanya mengirim artikel Published yang tanggalnya sudah tiba.
// Isi artikel disimpan sebagai teks sederhana (markdown ringan) dan diubah menjadi blok yang dirender halaman Article.
import {useEffect,useMemo,useState} from "react";
import {CONFIGURED,pub} from "./lib/api";
import {localDate} from "./admin/data/mappers";

export function textToBlocks(text){
  const out=[];let para=[],list=[],code=null;
  const fp=()=>{if(para.length){out.push([para.length>1?"poem":"p",para.join("\n")]);para=[]}},fl=()=>{if(list.length){out.push(["ul",list]);list=[]}};
  for(const raw of String(text||"").split("\n")){
    const l=raw.replace(/\s+$/,"");let m;
    if(code){if(l.startsWith("```")){out.push(["code",code.join("\n")]);code=null}else code.push(raw);continue}
    if(l.startsWith("```")){fp();fl();code=[];continue}
    if(!l.trim()){fp();fl();continue}
    if((m=l.match(/^##\s+(.*)/))){fp();fl();out.push(["h",m[1]])}
    else if((m=l.match(/^>\s?(.*)/))){fp();fl();out.push(["q",m[1]])}
    else if((m=l.match(/^-\s+(.*)/))){fp();list.push(m[1])}
    else if((m=l.match(/^\[gambar:\s*(.*?)(?:\s*\|\s*(\S+))?\s*\]$/))){fp();fl();out.push(m[2]?["img",m[1],m[2]]:["img",m[1]])}
    else{fl();para.push(l)}
  }
  fp();fl();if(code)out.push(["code",code.join("\n")]);
  return out;
}
const toPost=r=>({id:r.id,slug:r.slug,t:r.title,cat:r.categories?.[0]?.name||"",kind:r.kind||"",d:localDate(r.published_at),feat:r.featured?1:0,
  ex:r.excerpt||"",img:r.cover_image||"",author:"Muhammad Ridho Hersa",body:textToBlocks(r.content)});

// Cache bersama (Home, Blog, Article memakai data yang sama) yang dianggap segar selama 60 detik.
let cache=null,at=0,inflight=null;const subs=new Set();
const notify=()=>subs.forEach(f=>f());
function load(){
  if(inflight)return;
  inflight=pub.posts().then(rows=>{cache=rows.map(toPost);at=Date.now()}).catch(()=>{if(cache===null)cache=[];at=Date.now()}).finally(()=>{inflight=null;notify()});
}
function useStore(){
  const [,tick]=useState(0);
  useEffect(()=>{
    if(!CONFIGURED)return;
    const f=()=>tick(n=>n+1);subs.add(f);
    if(cache===null||Date.now()-at>60000)load();
    return()=>subs.delete(f);
  },[]);
  return cache;
}
// published posts, newest first (kosong selagi dimuat atau bila API belum dikonfigurasi)
export function usePosts(){
  const rows=useStore();
  return useMemo(()=>(rows||[]).slice().sort((a,b)=>String(b.d).localeCompare(String(a.d))),[rows]);
}
// true setelah daftar artikel selesai dimuat (agar halaman tidak menampilkan "tidak ditemukan" selagi memuat)
export const usePostsReady=()=>{const rows=useStore();return !CONFIGURED||rows!==null};
