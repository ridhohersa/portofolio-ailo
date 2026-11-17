import {useState,useMemo,useEffect,useRef} from "react";
import {Link,useLocation,useNavigate} from "react-router-dom";
import {motion,AnimatePresence,useMotionValue,useSpring,useTransform,useScroll,useReducedMotion} from "motion/react";
import {CATS,CCOL} from "../data";
import {useProjects,useContactLinks} from "../content";
import {usePosts} from "../posts";
import {buildNotes,useApprovedNotes} from "../testimonials";
import TestimonialsBoard from "../components/testimonials/TestimonialsBoard";
import {fd,mins} from "../util";
import {Reveal,Item,ParallaxElement,useParallaxFactor,maskV} from "../components/Reveal";
import About from "../components/About";
import Skills from "../components/Skills";
import Hl from "../components/Hl";
import HGallery,{GItem} from "../components/HGallery";
import Magnetic from "../components/Magnetic";
import {useJump} from "../components/Wipe";
import {canVT} from "../vt";
import {useHeroSequence,WORD} from "../components/useHeroSequence";
const MLink=motion.create(Link);
// CV asset: replace this file in /public/assets/cv/ (or change the path) to update the download; the saved name is set below
const CV_FILE="/assets/cv/CV_Muhammad_Ridho_Hersa.pdf",CV_NAME="Muhammad-Ridho-Hersa-CV.pdf";
function DownloadBtn({children}){
  return <Magnetic><motion.a href={CV_FILE} download={CV_NAME} className="btn" whileHover={{y:-2}} whileTap={{scale:.96}}>{children}</motion.a></Magnetic>;
}
function Btn({to,pri,children}){
  const jump=useJump(),hash=to.startsWith("/#");
  const extra=hash?{onClick:e=>{e.preventDefault();jump(to.slice(2))}}:{};
  return <Magnetic><MLink to={to} className={"btn"+(pri?" pri":"")} whileHover={{y:-2}} whileTap={{scale:.96}} {...extra}>{children}</MLink></Magnetic>;
}
const EASE=[.2,.8,.2,1];

function Float({c,d,k,mx,my,sy}){
  const x=useSpring(useTransform(mx,v=>v*-28*k),{stiffness:80,damping:20}),y=useSpring(useTransform(my,v=>v*-28*k),{stiffness:80,damping:20});
  // decorative shapes drift against the portrait (up, 7px per level -> 7/14/21px) and fade as the hero leaves; the CSS `translate` property keeps this independent of the pointer parallax above
  const pk=useParallaxFactor(),sc=useTransform(sy,[0,700],[0,-7*k*pk]),tr=useTransform(sc,v=>"0px "+v+"px"),op=useTransform(sy,[0,520],[1,pk?0:1]);
  return <motion.div className={"fl "+c} aria-hidden="true" style={{x,y,translate:tr,opacity:op}}><motion.i animate={{y:[0,-22,0],rotate:[0,8,0]}} transition={{duration:d,repeat:Infinity,ease:"easeInOut"}}/></motion.div>;
}
function Hero(){
  const mx=useMotionValue(0),my=useMotionValue(0);
  const {stage,typed,caret,instant}=useHeroSequence();
  // portrait lags the page by up to ~18px (scroll-linked MotionValue; applied with the CSS `translate` property so it never fights the entrance's own y)
  const {scrollY}=useScroll(),pk=useParallaxFactor(),pty=useTransform(scrollY,[0,700],[0,18*pk]),ptr=useTransform(pty,v=>"0px "+v+"px"),introO=useTransform(scrollY,[0,520],[1,pk?.35:1]);
  // photo opens like a sheet of paper once the headline has landed (bottom -> top); the mask is removed afterwards
  const open=instant||stage>=5;
  const maskA={initial:instant?false:{clipPath:"inset(100% -40px -40px -40px)"},animate:open?{clipPath:"inset(-40px -40px -40px -40px)",transitionEnd:{clipPath:"none"}}:{clipPath:"inset(100% -40px -40px -40px)"},transition:{duration:.95,ease:[.65,0,.35,1]}};
  // hero height = viewport minus the real navbar height (read, never changed)
  useEffect(()=>{
    const h=document.querySelector("header.top");if(!h)return;
    const set=()=>document.documentElement.style.setProperty("--nav-h",h.offsetHeight+"px");
    set();const ro=new ResizeObserver(set);ro.observe(h);return()=>ro.disconnect();
  },[]);
  // headline words rise out of their mask once `stage` reaches n
  const up=n=>({initial:instant?false:{y:"105%"},animate:{y:stage>=n?0:"105%"},transition:{duration:.85,ease:EASE}});
  // photo / profile fade in once `stage` reaches n
  const fade=(n,y,delay=0)=>({initial:instant?false:{opacity:0,y},animate:stage>=n?{opacity:1,y:0}:{opacity:0,y},transition:{duration:.8,delay:stage>=n?delay:0,ease:EASE}});
  return <section className="hero" id="home" aria-labelledby="h1" onPointerMove={e=>{mx.set(e.clientX/innerWidth-.5);my.set(e.clientY/innerHeight-.5)}}>
    <div className="stage">
    <h1 id="h1" aria-label="Designing beyond the interface.">
      <span aria-hidden="true"><motion.i {...up(1)}>Designin<span className="g">g</span></motion.i></span>
      <span aria-hidden="true"><i>
        {/* ghost reserves the final width of "beyond" so typing never shifts the layout; the live text is overlaid on it */}
        <span className="tw"><span className="tw-g">{WORD}</span><span className="tw-l">{WORD.slice(0,typed)}{caret&&<motion.span className="caret" animate={{opacity:[1,0]}} transition={{duration:.5,repeat:Infinity,repeatType:"reverse",ease:"linear"}}/>}</span></span>{" "}
        <motion.span className="w" {...up(3)}>the</motion.span>
      </i></span>
      <span aria-hidden="true"><motion.i {...up(4)}>interface.</motion.i></span>
      {/* depth: identical copy of line 1 placed exactly over it, only its "g" painted, layered BEHIND the portrait (the front copy's "g" is transparent) */}
      <span className="gb" aria-hidden="true"><motion.i {...up(1)}>Designin<span className="g">g</span></motion.i></span>
    </h1>
    {[["f1",9,1],["f2",12,2],["f3",7,3]].map(([c,d,k])=><Float key={c} c={c} d={d} k={k} mx={mx} my={my} sy={scrollY}/>)}
    <div className="meta">
      <motion.div className="avatar" style={{translate:ptr}} {...fade(5,28)}><motion.img {...maskA} src="/assets/images/avatar.png" alt="Foto Muhammad Ridho Hersa"/></motion.div>
      <motion.div className="intro" style={{opacity:introO}}>
        <motion.p className="serif" {...fade(6,16,0)}>Muhammad Ridho Hersa</motion.p>
        <motion.p {...fade(6,16,.1)}>Kelas XII PPLG A · Pengembangan Perangkat Lunak dan Gim. UI/UX Designer.</motion.p>
        <motion.p {...fade(6,16,.2)}>Pribadi kreatif dan adaptif yang tertarik pada desain, teknologi, dan pengembangan ide.</motion.p>
        <motion.div className="btns" {...fade(6,16,.3)}><Btn to="/#projects" pri>Lihat Portfolio</Btn><DownloadBtn>Unduh CV</DownloadBtn></motion.div>
      </motion.div>
    </div>
    </div>
  </section>;
}
// Card entrance + hover are driven by variants so the cover image and the card move as one
// The card's top rule is always there; the cover opens like paper first, then title / metadata / description follow one by one.
const cardV={hidden:{y:0},rest:{y:0,transition:{duration:.75,ease:[.2,.8,.2,1],staggerChildren:.1,delayChildren:.3}},hover:{y:-4,transition:{duration:.3}}};
const txtV={hidden:{opacity:0,y:22},rest:{opacity:1,y:0,transition:{duration:.7,ease:[.2,.8,.2,1]}}};
const coverV=maskV("rest","up");
function Projects(){
  const PROJECTS=useProjects();
  const [q,setQ]=useState(""),[cat,setCat]=useState("Semua");
  // coming back from a project: the View Transition is already animating this page, so the cards must not fade in again
  const still=useReducedMotion(),cv=still?{hidden:{},rest:{}}:coverV,tv=still?{hidden:{},rest:{}}:txtV;   // reduced motion: content is simply there
  const [fromVT]=useState(()=>!!document.documentElement.dataset.vt),vt=canVT();
  const cats=["Semua",...new Set(PROJECTS.map(p=>p.c))],k=q.trim().toLowerCase();
  const r=PROJECTS.filter(p=>(cat==="Semua"||p.c===cat)&&(!k||[p.t,p.d,...p.tech].join(" ").toLowerCase().includes(k)));
  return <section className="s" id="projects" aria-labelledby="pj">
    <Reveal as="h2" id="pj"><Hl>Projects</Hl></Reveal>
    <Reveal className="tools" delay={.1}><input value={q} onChange={e=>setQ(e.target.value)} type="search" placeholder="Cari judul, deskripsi, atau teknologi" aria-label="Cari proyek"/>
      <div id="chips" role="group" aria-label="Filter kategori">{cats.map(c=><motion.button key={c} whileTap={{scale:.94}} className="chip" aria-pressed={c===cat} onClick={()=>setCat(c)}>{c}</motion.button>)}</div></Reveal>
    <div className="pj-wrap">
      <HGallery n={r.length}><AnimatePresence mode="popLayout">{r.map((p,gi)=><GItem layout="position" key={p.i} index={gi} className="pj-item" exit={{opacity:0,transition:{duration:.2}}}><MLink data-pid={p.i} className="card" to={"/project/"+p.i} variants={cardV} initial={fromVT?"rest":"hidden"} whileInView="rest" viewport={{once:true,amount:"some"}} whileHover="hover" whileFocus="hover" whileTap={{scale:.99}}>
        <motion.div layoutId={vt?undefined:"thumb-"+p.i} data-vt="thumb" className="thumb" style={{background:p.col}}><ParallaxElement variants={cv} axis="y" range={[-9,9]} scale={1.06} style={{width:"100%",height:"100%"}}><motion.img variants={{rest:{scale:1},hover:{scale:1.07}}} transition={{duration:.5}} src={p.img} alt={"Cover "+p.t} loading="lazy" style={p.pos?{objectPosition:p.pos}:undefined}/></ParallaxElement></motion.div>
        <motion.h3 variants={tv} layoutId={vt?undefined:"title-"+p.i} data-vt="title">{p.t}</motion.h3><motion.p variants={tv} className="label" data-vt="label">{p.c} · {p.tech.join(", ")}</motion.p><motion.p variants={tv}>{p.d}</motion.p>
      </MLink></GItem>)}</AnimatePresence></HGallery>
      {!r.length&&<p className="empty">Tidak ada proyek yang cocok. Hapus kata kunci atau pilih kategori lain.</p>}
    </div>
  </section>;
}
function Testimonials(){
  // Dengan API: hanya testimoni Approved dari database. Tanpa backend: contoh lokal dari TESTI (ditandai jelas sebagai contoh).
  const {notes,live,loading}=useApprovedNotes();
  return <section className="s dark" id="testimonials" aria-labelledby="th">
    <Reveal as="h2" id="th"><Hl>Testimonials</Hl></Reveal>
    <ParallaxElement axis="x" range={[-14,14]}><Reveal as="p" className="cb-title" delay={.1}>Little notes, big impressions.</Reveal></ParallaxElement>
    <Reveal as="p" className="cb-hint" delay={.2}><span className="label">Drag a note or click to read.</span> {!live&&<span className="ph">Contoh — belum ada testimoni asli.</span>}{live&&!loading&&!notes.length&&<span className="label">Belum ada testimoni yang disetujui. Tinggalkan catatan pertama di papan ini.</span>}</Reveal>
    <TestimonialsBoard items={notes}/>
  </section>;
}
// ---- Blog preview: 1 featured (16:9) + 2 compact rows (1:1). Full archive with search / filter lives at /blog (pages/BlogIndex.jsx). ----
const prevV={hidden:{y:0},show:{y:0,transition:{duration:.7,ease:[.2,.8,.2,1],staggerChildren:.1}},hover:{y:0}};
const prevTxt={hidden:{opacity:0,y:16},show:{opacity:1,y:0,transition:{duration:.6,ease:[.2,.8,.2,1]}},hover:{opacity:1,y:0}};
const prevImg={show:{scale:1},hover:{scale:1.06,transition:{duration:.5,ease:[.2,.8,.2,1]}}};
const same=(o,still)=>still?{hidden:{},show:{},hover:{}}:o;
// Cover: a.img when the article has one (optional field in data.js), otherwise the existing placeholder block in the category colour
function Cover({a,ratio,v}){
  const ci=Math.max(0,CATS.indexOf(a.cat));
  return <motion.div variants={v} className={"bp-cov "+ratio} style={{background:CCOL[ci]}}>
    {a.img?<motion.img variants={prevImg} src={a.img} alt={"Cover "+a.t} loading="lazy"/>
      :<motion.span variants={prevImg} className="bp-ph" aria-hidden="true">[Cover — {a.cat}]</motion.span>}
  </motion.div>;
}
function Blog(){
  const still=useReducedMotion(),pv=same(prevV,still),pt=same(prevTxt,still),pc=still?{hidden:{},show:{},hover:{}}:maskV("show","up");
  // published only; featured = flagged article, otherwise the most recent one; then the two next most recent
  const pub=usePosts();
  const {feat,rest}=useMemo(()=>{
    const f=pub.find(a=>a.feat)||pub[0];
    return {feat:f,rest:pub.filter(a=>a!==f).slice(0,2)};
  },[pub]);
  const meta=a=><p className="label bp-m"><span>{a.kind?a.kind+" · ":""}{a.cat}</span><span>{fd(a.d)}</span></p>;
  return <section className="s bp" id="blog" aria-labelledby="jh">
    <Reveal as="h2" id="jh"><Hl>Blog</Hl></Reveal>
    <Reveal as="p" className="bp-lead" delay={.1}>Catatan, eksperimen, dan proses belajar.</Reveal>
    {feat?<div className="bp-grid">
      <MLink to={"/blog/"+feat.slug} className="bp-f" variants={pv} initial="hidden" whileInView="show" whileHover="hover" whileFocus="hover" viewport={{once:true,amount:"some"}}>
        <Cover a={feat} ratio="r169" v={pc}/>
        <motion.div variants={pt} className="bp-t">{meta(feat)}<h3>{feat.t}</h3><p>{feat.ex}</p></motion.div>
      </MLink>
      <div className="bp-side">
        {rest.map(a=><MLink key={a.slug} to={"/blog/"+a.slug} className="bp-r" variants={pv} initial="hidden" whileInView="show" whileHover="hover" whileFocus="hover" viewport={{once:true,amount:"some"}}>
          <Cover a={a} ratio="r11" v={pc}/>
          <motion.div variants={pt} className="bp-t">{meta(a)}<h3>{a.t}</h3><p>{a.ex}</p></motion.div>
        </MLink>)}
        <Reveal className="bp-more" delay={.2}><Link to="/blog" className="rd">Explore All Articles <span aria-hidden="true">→</span></Link></Reveal>
      </div>
    </div>:<p className="empty">Belum ada artikel yang dipublikasikan.</p>}
  </section>;
}
function Contact(){
  const CONTACT_LINKS=useContactLinks();
  // closing section: big title -> short line -> links one by one. The oversized outlined words are decorative (aria-hidden), sit in their own
  // row above the links (never behind them) and drift sideways with the scroll, in both directions.
  const ref=useRef(null),k=useParallaxFactor();
  const {scrollYProgress:p}=useScroll({target:ref,offset:["start end","end end"]});
  const x1=useTransform(p,[0,1],[`${-8*k}%`,`${4*k}%`]),x2=useTransform(p,[0,1],[`${4*k}%`,`${-8*k}%`]);
  return <section className="s" id="contact" aria-labelledby="ct" ref={ref}><Reveal as="h2" id="ct"><Hl>Contact</Hl></Reveal>
    <Reveal as="p" delay={.12}>Hubungi saya lewat salah satu kanal berikut.</Reveal>
    <div className="ct-deco" aria-hidden="true"><motion.span style={{x:x1}}>Let's talk · Let's talk · Let's talk</motion.span><motion.span style={{x:x2}}>Say hello · Say hello · Say hello</motion.span></div>
    <Reveal as="ul" stagger delay={.25} className="links">{CONTACT_LINKS.map(l=><Item as={motion.li} key={l.name}>
      <a href={l.href} {...(l.ext?{target:"_blank",rel:"noopener noreferrer"}:{})}>{l.name} <span style={{font:"400 1rem var(--mono)"}}>{l.label}</span></a>
    </Item>)}</Reveal>
  </section>;
}
export default function Home(){
  // links from before the rename (#journal, #cv) land on the matching section
  const {hash}=useLocation(),nav=useNavigate();
  useEffect(()=>{const m={"#journal":"#blog","#cv":"#about"}[hash];if(m)nav("/"+m,{replace:true})},[hash,nav]);
  return <main id="main">
    <Hero/><About/><Skills/><Projects/><Testimonials/><Blog/>
    <Contact/>
  </main>;
}
