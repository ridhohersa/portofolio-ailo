// Continuous shared-element transitions (Home gallery <-> project detail) built on the CSS View Transitions API.
// - tagging: the same three elements (thumb, title, label) get a per-project view-transition-name on both pages
// - identity: every project gets its own duration, easing, reveal style, direction, title lag and tint (see fxOf)
// - CSS for each project is generated at load, so a new entry in PROJECTS gets its own transition without touching CSS
import {getProjects,subscribe} from "./content";

const PROJ=/^\/project\/(\d+)\/?$/;
export const projectId=path=>{const m=PROJ.exec(path);return m?+m[1]:null};

export const canVT=()=>typeof document!=="undefined"&&typeof document.startViewTransition==="function"&&!matchMedia("(prefers-reduced-motion:reduce)").matches;

// Which shared-element pair is this navigation? open = gallery -> detail, close = detail -> gallery.
export function pairOf(from,to){
  const a=projectId(from),b=projectId(to);
  if(from==="/"&&b!=null)return{kind:"open",pid:b};
  if(a!=null&&to==="/")return{kind:"close",pid:a};
  return null;
}

/* ---------- per-project identity ---------- */
const KINDS=["wipe","zoom","slide"],DIRS=["up","left","down","right"],OPP={up:"down",down:"up",left:"right",right:"left"};
const EASES=["cubic-bezier(.7,0,.2,1)","cubic-bezier(.2,.9,.1,1)","cubic-bezier(.65,0,.35,1)","cubic-bezier(.16,1,.3,1)"];
const TINTS=["var(--sage)","var(--grey)","var(--white)","var(--red)"];
const toMs=v=>{const n=parseFloat(v);return /ms\s*$/.test(v)?n:/s\s*$/.test(v)?n*1000:n};
// Values set in data.js (col/ease/dur/kind/dir/lag) win; missing ones are derived from the project index so every project stays unique.
export function fxOf(p){
  const i=p.i||0;
  return{
    col:p.col||TINTS[i%TINTS.length],
    ease:p.ease||EASES[i%EASES.length],
    ms:Math.round(p.dur?toMs(p.dur):540+((i*85)%260)),
    kind:p.kind||KINDS[i%KINDS.length],
    dir:p.dir||DIRS[i%DIRS.length],
    lag:p.lag!=null?p.lag:(i%2?0:70)
  };
}
const revealName=(fx,kind)=>fx.kind==="zoom"?(kind==="open"?"vt-zoom-in":"vt-zoom-out"):`vt-${fx.kind}-${kind==="open"?fx.dir:OPP[fx.dir]}`;

function buildCss(){
  const r=x=>Math.round(x);
  return getProjects().map(p=>{
    const f=fxOf(p),n="p"+p.i,d=f.ms,e=f.ease,L=f.lag;
    return`::view-transition-group(${n}-thumb){animation-duration:${d}ms;animation-timing-function:${e}}
::view-transition-image-pair(${n}-thumb){overflow:hidden}
::view-transition-old(${n}-thumb),::view-transition-new(${n}-thumb){height:100%;object-fit:cover;mix-blend-mode:normal}
::view-transition-old(${n}-thumb){animation:none}
::view-transition-new(${n}-thumb){animation:var(--vt-reveal,vt-in) ${d}ms ${e} both}
::view-transition-group(${n}-title){animation-duration:${d}ms;animation-timing-function:${e};animation-delay:${L}ms}
::view-transition-old(${n}-title),::view-transition-new(${n}-title){mix-blend-mode:normal}
::view-transition-old(${n}-title){animation:vt-out ${r(d*.45)}ms linear ${L}ms both}
::view-transition-new(${n}-title){animation:vt-in ${r(d*.55)}ms linear ${r(L+d*.3)}ms both}
::view-transition-group(${n}-label){animation-duration:${d}ms;animation-timing-function:${e};animation-delay:${L+60}ms}
::view-transition-old(${n}-label),::view-transition-new(${n}-label){mix-blend-mode:normal}
::view-transition-old(${n}-label){animation:vt-out ${r(d*.4)}ms linear ${L+60}ms both}
::view-transition-new(${n}-label){animation:vt-in ${r(d*.5)}ms linear ${r(L+60+d*.3)}ms both}
`;}).join("");
}
// CSS dibuat saat dimuat dan dibuat ulang saat daftar project berubah (mis. setelah data dari API tiba)
if(typeof document!=="undefined"){
  const apply=()=>{let s=document.getElementById("vt-fx");if(!s){s=document.createElement("style");s.id="vt-fx";document.head.appendChild(s)}s.textContent=buildCss()};
  apply();subscribe(apply);
}

/* ---------- tagging ---------- */
const PARTS=["thumb","title","label"];
const cardOf=pid=>document.querySelector(`a.card[data-pid="${pid}"]`);
const detailOf=pid=>document.querySelector(`#dh[data-pid="${pid}"]`);
function tag(root,pid,on){
  if(!root)return;
  PARTS.forEach(k=>{const el=root.querySelector(`[data-vt="${k}"]`);if(el)el.style.viewTransitionName=on?`p${pid}-${k}`:""});
}

/* ---------- runner ---------- */
let active=null,seq=0,homeY=null;
const clearRoot=()=>{
  const d=document.documentElement;d.removeAttribute("data-vt");
  ["--vt-d","--vt-col","--vt-reveal"].forEach(k=>d.style.removeProperty(k));
};

// swap() must update React synchronously (flushSync) so the new page exists when the callback resolves.
export function runViewTransition({kind,pid,hash=""},swap){
  const d=document.documentElement,id=++seq,p=getProjects()[pid],fx=fxOf(p||{i:pid});
  if(active){try{active.skipTransition()}catch{}}
  if(kind==="open")homeY=scrollY;
  // Going "back" to another section (e.g. the About nav link) is a plain page crossfade, not a shared-element morph
  const shared=kind==="open"||!hash||hash==="#projects";
  const src=!shared?null:kind==="open"?cardOf(pid):detailOf(pid);
  d.style.setProperty("--vt-d",fx.ms+"ms");
  d.style.setProperty("--vt-col",fx.col);
  d.style.setProperty("--vt-reveal",revealName(fx,kind));
  d.setAttribute("data-vt",kind);
  tag(src,pid,true);
  let dst=null;
  const t=active=document.startViewTransition(()=>{
    tag(src,pid,false);                       // old state is already captured; free the names for the new page
    swap();
    if(kind==="open")scrollTo({top:0,left:0,behavior:"instant"});
    dst=!shared?null:kind==="open"?detailOf(pid):cardOf(pid);
    if(kind==="close"&&!shared){const h=document.getElementById(hash.slice(1));if(h)h.scrollIntoView({behavior:"instant"});else scrollTo({top:0,behavior:"instant"})}
    if(kind==="close"&&dst){
      // land exactly where the visitor left the gallery; if that card is off-screen, centre it
      if(homeY!=null)scrollTo({top:homeY,left:0,behavior:"instant"});
      const r=dst.getBoundingClientRect();
      if(r.top<80||r.bottom>innerHeight)dst.scrollIntoView({block:"center",behavior:"instant"});
    }
    tag(dst,pid,true);
  });
  t.finished.catch(()=>{}).then(()=>{
    if(id!==seq)return;                       // a newer transition owns the state now
    tag(dst,pid,false);clearRoot();active=null;
  });
}
