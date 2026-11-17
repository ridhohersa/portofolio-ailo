// Konten publik (About, Skills, Projects, Contact) dari API Laravel, dengan data statis (data.js, html.js) sebagai cadangan.
// Cadangan dipakai saat VITE_API_URL kosong, saat memuat, bila server gagal, atau bila sebuah bagian di database masih kosong.
// Studi kasus kaya (sec/full/pos/hide, mis. Memento) tetap statis dan dipasangkan lewat slug.
import {useEffect,useSyncExternalStore} from "react";
import {ABOUT,SKILLS,PROJECTS as STATIC_PROJECTS} from "./data";
import {BIO,CONTACT_LINKS} from "./html";
import {CONFIGURED,pub} from "./lib/api";
import {EDUCATION,EXPERIENCE,ORGANIZATION,CERTIFICATE,EXPERTISE,SKILL,CONTACT,splitList} from "./admin/data/mappers";

const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const slugOf=t=>String(t||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const EXTRA=["linkLabel","col","ease","dur","kind","dir","lag","full","fullAlt","pos","hide","sec"];
const STATIC_BY_SLUG=Object.fromEntries(STATIC_PROJECTS.map(p=>[slugOf(p.t),p]));

// ---------- pemetaan murni (diuji di Node) ----------
export function bioHtml(text){
  const t=String(text||"").trim();if(!t)return BIO;
  if(/^<p[\s>]/i.test(t))return t;                                   // sudah HTML
  return t.split(/\n{2,}/).map(x=>`<p>${esc(x.trim()).replace(/\n/g,"<br>")}</p>`).join("");
}
export function aboutFrom(d){
  if(!d)return {about:ABOUT,bio:BIO};
  const a=d.about||{},rows=k=>(d[k]||[]);
  const facts=(a.facts||[]).filter(f=>f&&f.k).map(f=>[f.k,f.v]);
  const edu=rows("education").map(r=>{const e=EDUCATION.toAdmin(r);return {lv:e.lv,kk:e.kk,n:e.n,p:e.p,t:e.t,d:e.d,focus:e.focus,act:splitList(e.act),now:e.now}});
  const ex=rows("expertises").map(r=>[r.title,r.description||""]);
  const xp=rows("experiences").map(r=>{const e=EXPERIENCE.toAdmin(r);return {n:e.n,p:e.p,d:e.d}});
  const og=rows("organizations").map(r=>{const e=ORGANIZATION.toAdmin(r);return {n:e.n,r:e.r,p:e.p,d:e.d}});
  const ce=rows("certificates").map(r=>{const e=CERTIFICATE.toAdmin(r);return {n:e.n,k:e.k,by:e.by,date:e.date,hi:e.hi,doc:e.doc}});
  return {
    bio:bioHtml(a.description),
    about:{
      intro:{facts:facts.length?facts:ABOUT.intro.facts,goal:a.goal||ABOUT.intro.goal},
      education:edu.length?edu:ABOUT.education,expertise:ex.length?ex:ABOUT.expertise,experience:xp.length?xp:ABOUT.experience,
      organization:og.length?og:ABOUT.organization,certificates:ce.length?ce:ABOUT.certificates},
  };
}
export function skillsFrom(list){
  if(!Array.isArray(list)||!list.length)return SKILLS;
  const o={hard:[],soft:[],tools:[]};
  list.map(SKILL.toAdmin).forEach(s=>{
    if(s.cat==="soft")o.soft.push([s.name,s.pct]);
    else if(s.cat==="tools")o.tools.push({g:s.group||"Lainnya",n:s.name,p:s.pct,m:s.m||s.name.slice(0,2),d:s.desc,basis:s.basis||undefined});
    else o.hard.push({n:s.name,p:s.pct,d:s.desc,basis:s.basis||undefined});
  });
  return o;
}
export function projectsFrom(list){
  if(!Array.isArray(list)||!list.length)return STATIC_PROJECTS;
  return list.map((r,i)=>{
    const st=STATIC_BY_SLUG[r.slug]||STATIC_BY_SLUG[slugOf(r.title)]||{};
    const p={i,slug:r.slug,t:r.title,c:r.category||"",d:r.description||r.short_description||"",tech:r.tech||[],img:r.thumbnail||st.img||"",link:r.project_url||st.link||""};
    EXTRA.forEach(k=>{if(st[k]!=null)p[k]=st[k]});
    return p;
  });
}
const shortUrl=u=>String(u).replace(/^https?:\/\/(www\.)?/i,"").replace(/\/$/,"");
export function contactFrom(map){
  const c=CONTACT.fromApi(map),out=[];
  if(c.email)out.push({href:"mailto:"+c.email,name:"Email",label:c.email});
  c.socials.forEach(s=>out.push({href:s.url,name:s.label,label:shortUrl(s.url),ext:1}));
  return out.length?out:CONTACT_LINKS;
}
// gambar studi kasus dari database untuk proyek tanpa konten statis
export function withDetail(p,d){
  if(!p||!d)return p;
  const imgs=(d.images||[]).map(x=>({src:x.image_path||x.url||"",alt:x.alt_text||""})).filter(x=>x.src);
  const q={...p,link:d.project_url||p.link,gallery:imgs};
  if(!p.full&&!p.sec&&imgs.length===1){q.full=imgs[0].src;q.fullAlt=imgs[0].alt||undefined}
  return q;
}

// ---------- penyimpanan sederhana ----------
let state={about:{about:ABOUT,bio:BIO},skills:SKILLS,projects:STATIC_PROJECTS,contact:CONTACT_LINKS,details:{}};
const subs=new Set();
const set=patch=>{state={...state,...patch};subs.forEach(f=>f())};
export const subscribe=f=>{subs.add(f);return()=>subs.delete(f)};
export const getProjects=()=>state.projects;
let started=false;
export function loadContent(){
  if(started||!CONFIGURED)return;started=true;
  // tiap bagian berdiri sendiri: satu yang gagal tidak mengganggu yang lain
  pub.about().then(d=>set({about:aboutFrom(d)})).catch(()=>{});
  pub.skills().then(d=>set({skills:skillsFrom(d)})).catch(()=>{});
  pub.projects().then(d=>set({projects:projectsFrom(d)})).catch(()=>{});
  pub.settings().then(d=>set({contact:contactFrom(d)})).catch(()=>{});
}
const asked=new Set();
function loadDetail(slug){
  if(!CONFIGURED||!slug||asked.has(slug))return;asked.add(slug);
  pub.project(slug).then(d=>set({details:{...state.details,[slug]:d}})).catch(()=>asked.delete(slug));
}
function use(sel){
  useEffect(loadContent,[]);
  return useSyncExternalStore(subscribe,()=>sel(state));
}
export const useAbout=()=>use(s=>s.about);
export const useSkills=()=>use(s=>s.skills);
export const useProjects=()=>use(s=>s.projects);
export const useContactLinks=()=>use(s=>s.contact);
export function useProject(i){
  const list=use(s=>s.projects),details=use(s=>s.details),p=list[i];
  useEffect(()=>{if(p)loadDetail(p.slug)},[p&&p.slug]);
  return p?withDetail(p,details[p.slug]):null;
}
