import {useEffect,useState} from "react";
import {Link,NavLink,Outlet,useLocation,useNavigate} from "react-router-dom";
import {AnimatePresence,motion} from "motion/react";
import "./admin.css";
import {useAuth} from "./auth";
import {loadAll,setErrorSink,settings,testimonials,useData} from "./data/api";
import {useLoad} from "./data/repo";
import {Btn,EmptyState} from "./ui/Bits";
import {FeedbackProvider,useToast} from "./ui/Feedback";
import Sheet from "./ui/Sheet";
import Icon from "./ui/Icon";
import {useTheme} from "../theme";
import {useNoIndex} from "./useNoIndex";

export const NAV=[
  ["","Dashboard","grid"],["about","About","user"],["skills","Skills","bars"],["projects","Projects","folder"],
  ["testimonials","Testimonials","note"],["blog","Blog","pen"],["contact","Contact","mail"],["settings","Settings","cog"]];
const UI="ailo-admin-ui";
const useMq=q=>{
  const [m,setM]=useState(()=>matchMedia(q).matches);
  useEffect(()=>{const mq=matchMedia(q),f=()=>setM(mq.matches);f();mq.addEventListener("change",f);return()=>mq.removeEventListener("change",f)},[q]);
  return m;
};
const initials=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join("");

// Menyambungkan galat penyimpanan dari lapisan data (perubahan yang ditolak server) ke toast.
function ErrorBridge(){
  const toast=useToast();
  useEffect(()=>{setErrorSink(m=>toast(m,"err"));return()=>setErrorSink(null)},[toast]);
  return null;
}
// Memuat data dari server sekali saat panel dibuka. Tampilkan status memuat atau galat (dengan tombol coba lagi) sebelum halaman.
function DataGate({children}){
  const load=useLoad();
  useEffect(()=>{if(load.state==="idle")loadAll()},[load.state]);
  if(load.state==="ready")return children;
  if(load.state==="error")return <EmptyState title="Data tidak bisa dimuat" text={load.error} action={<Btn className="pri" onClick={loadAll}>Coba lagi</Btn>}/>;
  return <p role="status" aria-live="polite" className="label" style={{padding:"3rem 0"}}>Memuat data…</p>;
}

function Sidebar({collapsed,mobile,onNavigate,onToggle}){
  const {logout,session}=useAuth(),nav=useNavigate();
  const profile={name:session?.user?.name||"Admin",role:session?.user?.role||"admin"},pending=useData(testimonials).filter(t=>t.status==="pending").length;
  const out=async()=>{await logout();nav("/admin/login",{replace:true})};
  return <div className={"adm-side"+(collapsed?" collapsed":"")}>
    <div className="adm-brand"><Link to="/admin" onClick={onNavigate} aria-label="Ailo Admin, dashboard"><span className="adm-logo">Ailo</span><span className="adm-tag label">Admin</span></Link></div>
    <nav aria-label="Menu admin" className="adm-nav">
      {NAV.map(([to,l,ic])=><NavLink key={l} to={"/admin"+(to?"/"+to:"")} end={!to} onClick={onNavigate} title={collapsed?l:undefined}
        className={({isActive})=>"adm-link"+(isActive?" on":"")}><Icon n={ic}/><span className="adm-lbl">{l}</span>
        {to==="testimonials"&&pending>0&&<span className="adm-count" aria-label={pending+" menunggu persetujuan"}>{pending}</span>}</NavLink>)}
    </nav>
    <div className="adm-side-f">
      <div className="adm-prof"><span className="adm-av" aria-hidden="true">{initials(profile.name)}</span><span className="adm-lbl"><strong>{profile.name}</strong><small className="label">{profile.role}</small></span></div>
      <Link className="adm-link" to="/" title={collapsed?"Kembali ke website":undefined}><Icon n="back"/><span className="adm-lbl">Kembali ke website</span></Link>
      <button type="button" className="adm-link" onClick={out} title={collapsed?"Keluar":undefined}><Icon n="out"/><span className="adm-lbl">Keluar</span></button>
      {!mobile&&<button type="button" className="adm-link adm-collapse" onClick={onToggle} aria-pressed={collapsed} aria-label={collapsed?"Perluas sidebar":"Ciutkan sidebar"} title={collapsed?"Perluas sidebar":"Ciutkan sidebar"}>
        <Icon n="chev"/><span className="adm-lbl">Ciutkan sidebar</span></button>}
    </div>
  </div>;
}

export default function AdminLayout(){
  useNoIndex();
  const loc=useLocation(),mobile=useMq("(max-width:899px)"),{theme,toggle}=useTheme(),{prefs}=useData(settings);
  const [collapsed,setCollapsed]=useState(()=>{try{return localStorage.getItem(UI)==="collapsed"}catch{return false}});
  const [open,setOpen]=useState(false);
  const toggle2=()=>setCollapsed(c=>{const n=!c;try{localStorage.setItem(UI,n?"collapsed":"open")}catch{}return n});
  useEffect(()=>setOpen(false),[loc.pathname,mobile]);
  const here=NAV.find(([to])=>to?loc.pathname.startsWith("/admin/"+to):loc.pathname.replace(/\/$/,"")==="/admin");
  return <FeedbackProvider>
    <ErrorBridge/>
    <div className={"adm"+(collapsed&&!mobile?" is-collapsed":"")+(prefs.compactTables?" compact":"")}>
      {!mobile&&<aside className="adm-aside"><Sidebar collapsed={collapsed} onToggle={toggle2}/></aside>}
      <div className="adm-col">
        <header className="adm-top">
          {mobile&&<button type="button" className="adm-iconbtn" onClick={()=>setOpen(true)} aria-label="Buka menu" aria-expanded={open}><Icon n="menu" size={20}/></button>}
          <span className="adm-crumb label">Admin / {here?here[1]:"…"}</span>
          <button type="button" className="adm-iconbtn" onClick={toggle} aria-label={theme==="dark"?"Ganti ke mode terang":"Ganti ke mode gelap"} title={theme==="dark"?"Mode terang":"Mode gelap"}><Icon n={theme==="dark"?"sun":"moon"}/></button>
        </header>
        <main id="main" className="adm-main" tabIndex={-1}>
          <motion.div key={loc.pathname} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,ease:[.2,.8,.2,1]}}><DataGate><Outlet/></DataGate></motion.div>
        </main>
      </div>
    </div>
    {mobile&&<Sheet open={open} onClose={()=>setOpen(false)} side="left" bare title="Menu admin"><Sidebar mobile onNavigate={()=>setOpen(false)}/></Sheet>}
  </FeedbackProvider>;
}
