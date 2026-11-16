import {useEffect,useRef,useState} from "react";
import {Link,useLocation} from "react-router-dom";
import {useJump} from "./Wipe";
import {AnimatePresence,motion} from "motion/react";
import {useTheme} from "../theme";
const LINKS=[["about","About"],["skills","Skills"],["projects","Projects"],["testimonials","Testimonials"],["blog","Blog"],["contact","Contact"]];
// Tablet dan mobile (<= 1023px) memakai hamburger; desktop tetap navbar horizontal.
const MQ="(max-width:1023px)";
const useCompact=()=>{
  const [c,setC]=useState(()=>matchMedia(MQ).matches);
  useEffect(()=>{const m=matchMedia(MQ),f=()=>setC(m.matches);f();m.addEventListener("change",f);return()=>m.removeEventListener("change",f)},[]);
  return c;
};
const EASE=[.2,.8,.2,1];

function ThemeToggle(){
  const {theme,toggle}=useTheme(),dark=theme==="dark";
  // Tombol ini selalu berada di bar atas, di luar menu hamburger.
  return <motion.button whileTap={{scale:.92}} type="button" className="tbtn" onClick={toggle}
    aria-label={dark?"Ganti ke mode terang":"Ganti ke mode gelap"} title={dark?"Mode terang":"Mode gelap"}>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dark?<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>
        :<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>}
    </svg>
    <span className="tlabel">{dark?"Terang":"Gelap"}</span>
  </motion.button>;
}

export default function Nav(){
  const {pathname,hash}=useLocation(),jump=useJump(),compact=useCompact();
  const [act,setAct]=useState("");const lock=useRef(null);
  const [open,setOpen]=useState(false),burger=useRef(null);
  const close=()=>setOpen(false);
  // active section = last section above a reading line; a clicked link stays active until the visitor scrolls by hand
  useEffect(()=>{
    if(pathname!=="/"){setAct("");return}
    let raf=0;
    const upd=()=>{raf=0;if(lock.current)return;const line=document.querySelector("header.top").offsetHeight+innerHeight*.25;let cur="";
      LINKS.forEach(([id])=>{const s=document.getElementById(id);if(s&&s.getBoundingClientRect().top<=line)cur=id});setAct(cur)};
    const req=()=>{if(!raf)raf=requestAnimationFrame(upd)};
    const free=()=>{if(lock.current){lock.current=null;req()}};
    const evs=["wheel","touchstart","keydown"];
    addEventListener("scroll",req,{passive:true});addEventListener("resize",req);evs.forEach(t=>addEventListener(t,free,{passive:true}));
    upd();
    return()=>{cancelAnimationFrame(raf);removeEventListener("scroll",req);removeEventListener("resize",req);evs.forEach(t=>removeEventListener(t,free))};
  },[pathname]);
  // the menu closes on navigation, on Escape and when the viewport grows back to desktop width; the page behind does not scroll while it is open
  useEffect(()=>{close()},[pathname,hash,compact]);
  useEffect(()=>{
    if(!open)return;
    const k=e=>{if(e.key==="Escape"){close();burger.current?.focus()}};
    addEventListener("keydown",k);
    const prev=document.body.style.overflow;document.body.style.overflow="hidden";
    return()=>{removeEventListener("keydown",k);document.body.style.overflow=prev};
  },[open]);

  const links=LINKS.map(([id,l])=><Link key={id} className={"l"+(act===id?" act":"")} to={"/#"+id} onClick={e=>{lock.current=id;setAct(id);close();if(pathname==="/"){e.preventDefault();jump(id)}}}>{l}{act===id&&<motion.span layoutId="nav-ind" className="nav-ind"/>}</Link>);
  const admin=<Link className={"l nav-admin"+(pathname.startsWith("/admin")?" act":"")} to="/admin/login" onClick={close}>Admin</Link>;

  return <header className="top">
    <Link className="logo" to="/" aria-label="Ailo, beranda">Ailo</Link>
    {!compact&&<nav aria-label="Navigasi utama">{links}{admin}</nav>}
    <div className="nav-r">
      <ThemeToggle/>
      {compact&&<button ref={burger} type="button" className={"burger"+(open?" on":"")} onClick={()=>setOpen(o=>!o)}
        aria-expanded={open} aria-controls="menu-panel" aria-label={open?"Tutup menu navigasi":"Buka menu navigasi"}>
        <span aria-hidden="true"/><span aria-hidden="true"/><span aria-hidden="true"/>
      </button>}
    </div>
    <AnimatePresence>
      {compact&&open&&<>
        <motion.div key="scrim" className="nav-scrim" aria-hidden="true" onClick={close} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}/>
        <motion.nav key="panel" id="menu-panel" className="menu-panel" aria-label="Navigasi utama"
          initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:.26,ease:EASE}}>
          {links}{admin}
        </motion.nav>
      </>}
    </AnimatePresence>
  </header>;
}
