import {useEffect,useLayoutEffect,useRef,useState} from "react";
import {flushSync} from "react-dom";
import {Routes,Route,Navigate,useLocation,useParams} from "react-router-dom";
import {AnimatePresence} from "motion/react";
import Nav from "./components/Nav";
import BackToTop from "./components/BackToTop";
import PageTransition,{ModeCtx} from "./components/PageTransition";
import {WipeProvider} from "./components/Wipe";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import EasterEgg from "./components/EasterEgg";
import Home from "./pages/Home";
import Project from "./pages/Project";
import Article from "./pages/Article";
import BlogIndex from "./pages/BlogIndex";
import {AuthProvider,RequireAdmin} from "./admin/auth";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AboutAdmin from "./admin/pages/About";
import SkillsAdmin from "./admin/pages/Skills";
import ProjectsAdmin from "./admin/pages/Projects";
import TestimonialsAdmin from "./admin/pages/Testimonials";
import BlogAdmin from "./admin/pages/Blog";
import ContactAdmin from "./admin/pages/Contact";
import SettingsAdmin from "./admin/pages/Settings";
import {canVT,pairOf,runViewTransition} from "./vt";
// berpindah antar bagian dashboard tidak memicu transisi halaman penuh: seluruh /admin (selain login) dihitung satu halaman
const routeKey=p=>p.startsWith("/admin")&&p!=="/admin/login"?"/admin":p;
const OldPost=()=><Navigate to={"/blog/"+useParams().slug} replace/>;
export default function App(){
  // `loc` is the URL (router state). `view.loc` is the route that is actually on screen. They are equal except for the
  // instant before a View Transition: the old page stays up until the browser has captured it, then both swap together.
  // Driving this from the location (not from click handlers) means the browser Back/Forward buttons get the same transition.
  const loc=useLocation(),latest=useRef(loc);latest.current=loc;
  const [view,setView]=useState({loc,mode:"page",epoch:0});
  useLayoutEffect(()=>{
    if(loc.key===view.loc.key)return;
    const pair=pairOf(view.loc.pathname,loc.pathname);
    if(!pair)return setView(v=>({loc,mode:"page",epoch:v.epoch}));
    if(!canVT())return setView(v=>({loc,mode:"plain",epoch:v.epoch}));
    // epoch changes the AnimatePresence key: the old page is removed synchronously (no exit animation delaying the snapshot)
    runViewTransition({...pair,hash:loc.hash},()=>flushSync(()=>setView(v=>({loc:latest.current,mode:"vt",epoch:v.epoch+1}))));
  },[loc.key]);
  // Admin punya layout sendiri (sidebar, topbar): navbar, footer, kursor, dan elemen khusus situs publik disembunyikan di sana.
  const inAdmin=view.loc.pathname.startsWith("/admin");
  const prev=useRef(view.loc.pathname);
  useEffect(()=>{
    const l=view.loc,changed=prev.current!==l.pathname;prev.current=l.pathname;
    if(view.mode==="vt")return;   // the transition already put the scroll position where the shared element is
    const id=l.hash.slice(1);
    const t=setTimeout(()=>{const el=id&&document.getElementById(id);el?el.scrollIntoView({behavior:l.state&&l.state.wipe?"instant":"smooth"}):window.scrollTo({top:0,behavior:"instant"})},changed&&view.mode==="page"?320:0);
    return()=>clearTimeout(t);
  },[view.loc.pathname,view.loc.hash,view.mode]);
  return <AuthProvider><WipeProvider>
    <a className="skip" href="#main">Lewati ke konten</a>
    {!inAdmin&&<Nav/>}
    <ModeCtx.Provider value={view.mode}>
      <AnimatePresence key={view.epoch} mode={view.mode==="page"?"wait":"popLayout"} initial={false}>
        <PageTransition key={routeKey(view.loc.pathname)}>
          <Routes location={view.loc}>
            <Route path="/" element={<Home/>}/>
            <Route path="/project/:i" element={<Project/>}/>
            <Route path="/blog" element={<BlogIndex/>}/>
            <Route path="/blog/:slug" element={<Article/>}/>
            <Route path="/admin/login" element={<Login/>}/>
            <Route path="/admin" element={<RequireAdmin><AdminLayout/></RequireAdmin>}>
              <Route index element={<Dashboard/>}/>
              <Route path="about" element={<AboutAdmin/>}/>
              <Route path="skills" element={<SkillsAdmin/>}/>
              <Route path="projects" element={<ProjectsAdmin/>}/>
              <Route path="testimonials" element={<TestimonialsAdmin/>}/>
              <Route path="blog" element={<BlogAdmin/>}/>
              <Route path="contact" element={<ContactAdmin/>}/>
              <Route path="settings" element={<SettingsAdmin/>}/>
              <Route path="*" element={<Navigate to="/admin" replace/>}/>
            </Route>
            {/* old addresses keep working */}
            <Route path="/journal" element={<Navigate to="/#blog" replace/>}/>
            <Route path="/journal/:slug" element={<OldPost/>}/>
            <Route path="/cv" element={<Navigate to="/#about" replace/>}/>
            <Route path="*" element={<Home/>}/>
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </ModeCtx.Provider>
    {!inAdmin&&<><footer><span>Ailo — Digital Portfolio</span><span>Muhammad Ridho Hersa · XII PPLG A</span></footer>
    <BackToTop/><ScrollProgress/><Cursor/><EasterEgg/></>}
  </WipeProvider></AuthProvider>;
}
