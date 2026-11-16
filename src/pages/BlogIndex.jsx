import {useState,useMemo} from "react";
import {Link} from "react-router-dom";
import {motion,AnimatePresence,useReducedMotion} from "motion/react";
import {CATS} from "../data";
import {usePosts} from "../posts";
import {fd,mins} from "../util";
import {Reveal,maskV} from "../components/Reveal";
import Hl from "../components/Hl";
const MLink=motion.create(Link);
const txtV={hidden:{opacity:0,y:22},rest:{opacity:1,y:0,transition:{duration:.7,ease:[.2,.8,.2,1]}}};
const blogV={hidden:{y:0},show:{y:0,transition:{duration:.7,ease:[.2,.8,.2,1],staggerChildren:.12}}};
const blogCoverV=maskV("show","up");
const blogTxtV={hidden:txtV.hidden,show:txtV.rest};
function Archive(){
  const [q,setQ]=useState(""),[cat,setCat]=useState("Semua"),[n,setN]=useState(3);
  const still=useReducedMotion(),bv=still?{hidden:{},show:{}}:blogV,bc=still?{hidden:{},show:{}}:blogCoverV,bt=still?{hidden:{},show:{}}:blogTxtV;
  const k=q.trim().toLowerCase(),plain=!k&&cat==="Semua";
  const ART=usePosts();
  const r=useMemo(()=>ART.filter(a=>(cat==="Semua"||a.cat===cat)&&(!k||(a.t+" "+a.ex).toLowerCase().includes(k))).sort((a,b)=>(b.feat||0)-(a.feat||0)),[ART,k,cat]);
  return <section className="s" id="blog" aria-labelledby="jh">
    <Link className="btn" to="/" style={{marginBottom:"2rem"}}>← Kembali ke Beranda</Link>
    <Reveal as="h2" id="jh"><Hl>Blog</Hl></Reveal>
    <Reveal as="p" delay={.1}>Catatan, eksperimen, dan proses belajar. <span className="ph">Artikel contoh — ganti dengan tulisan asli</span></Reveal>
    <Reveal className="tools" delay={.18}><input value={q} onChange={e=>{setQ(e.target.value);setN(3)}} type="search" placeholder="Cari artikel" aria-label="Cari artikel"/>
      <div id="jchips" role="group" aria-label="Filter kategori artikel">{["Semua",...CATS].map(c=><button key={c} className="chip" aria-pressed={c===cat} onClick={()=>{setCat(c);setN(3)}}>{c}</button>)}</div></Reveal>
    <motion.div className="jgrid" layout aria-live="polite">
      <AnimatePresence mode="popLayout">{r.slice(0,n).map((a,i)=><MLink layout key={a.slug} to={"/blog/"+a.slug} className={"ja"+(plain&&i===0&&a.feat?" f":"")} variants={bv} initial="hidden" whileInView="show" viewport={{once:true,amount:"some"}} exit={{opacity:0,scale:.95}} whileHover={{y:-4}}>
        <motion.div variants={bc} className="jc">{a.img?<img src={a.img} alt={"Cover "+a.t} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"[Cover — "+a.cat+"]"}</motion.div>
        <motion.div variants={bt}><p className="label">{a.kind?a.kind+" · ":""}{a.cat} · {fd(a.d)} · {mins(a)} menit baca</p><h3>{a.t}</h3><p>{a.ex}</p><span className="rd">Read Article</span></motion.div>
      </MLink>)}</AnimatePresence>
      {!r.length&&<p className="empty" style={{gridColumn:"1/-1"}}>Tidak ada artikel yang cocok. Hapus kata kunci atau pilih kategori lain.</p>}
    </motion.div>
    {r.length>n&&<p style={{marginTop:"2rem"}}><motion.button className="btn" whileTap={{scale:.96}} onClick={()=>setN(n+3)}>Muat lebih banyak</motion.button></p>}
  </section>;
}

export default function BlogIndex(){return <main id="main"><Archive/></main>}
