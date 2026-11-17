import {Fragment} from "react";
import {Link,useParams} from "react-router-dom";
import {motion,useScroll,useTransform} from "motion/react";
import {useProject} from "../content";
import {Reveal} from "../components/Reveal";
import Hl from "../components/Hl";
import {canVT,fxOf} from "../vt";
const MLink=motion.create(Link);
const SECT=["Project overview","Problem and objectives","Research and exploration","Design process","Final interface","Technology and implementation","Project features","Demo and source code","User feedback"];
const SECL=["Ringkasan proyek","Masalah dan tujuan","Riset dan eksplorasi","Proses desain","Antarmuka akhir","Teknologi dan implementasi","Fitur proyek","Demo dan kode sumber","Umpan balik pengguna"];
const EASE=[.2,.8,.2,1];
// body blocks can be taller than the viewport (case-study images), so reveal as soon as any part is visible
const VP={once:true,amount:"some"};
export default function Project(){
  const p=useProject(+useParams().i);
  // hero cover drifts and zooms slightly while scrolling; both are identity at scrollY=0 so they never fight the View Transition
  const {scrollY}=useScroll(),py=useTransform(scrollY,[0,700],["0%","5%"]),ps=useTransform(scrollY,[0,700],[1,1.1]);
  if(!p)return <main id="main" className="det"><section className="s" id="detail"><Link className="btn" to="/#projects">← Kembali ke galeri</Link><p>Proyek tidak ditemukan.</p></section></main>;
  const vt=canVT(),fx=fxOf(p);
  // text that is not part of the shared morph waits until the cover/title are mostly in place
  const t0=vt?fx.ms/1000*.55+fx.lag/1000:.25;
  return <main id="main" className="det"><section className="s" id="detail">
    <MLink className="btn" to="/#projects" initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{duration:.5,delay:t0+.1,ease:EASE}} whileHover={{x:-4}} whileTap={{scale:.96}}>← Kembali ke galeri</MLink>
    <div id="dh" data-pid={p.i}>
      <motion.div layoutId={vt?undefined:"thumb-"+p.i} data-vt="thumb" className="thumb big" style={{background:p.col}}><motion.img src={p.img} alt={"Cover "+p.t} style={{y:py,scale:ps,...(p.pos?{objectPosition:p.pos}:{})}}/></motion.div>
      <motion.h3 layoutId={vt?undefined:"title-"+p.i} data-vt="title" className="dt" tabIndex={-1}>{p.t}</motion.h3>
      <div>
        <p className="label" data-vt="label">{p.c} · {p.tech.join(", ")}</p>
        <motion.p initial={{opacity:0,y:16,filter:"blur(6px)"}} animate={{opacity:1,y:0,filter:"blur(0px)",transitionEnd:{filter:"none"}}} transition={{duration:.7,delay:t0,ease:EASE}}>{p.d}</motion.p>
      </div>
    </div>
    <div id="dbody">{p.link&&<p><a className="btn" href={p.link} {...(/^https?:/i.test(p.link)?{target:"_blank",rel:"noopener noreferrer"}:{})}>{p.linkLabel||"Lihat proyek"} ↗</a></p>}
    {!p.full&&!p.sec&&p.gallery&&p.gallery.length?p.gallery.map(g=><Reveal key={g.src} as="figure" v="scale" viewport={VP} className="fig full"><img src={g.src} alt={g.alt||"Gambar "+p.t} loading="lazy"/></Reveal>)
      :p.full?<Reveal as="figure" v="scale" viewport={VP} className="fig full"><img src={p.full} alt={p.fullAlt||"Studi kasus "+p.t} width="851" height="8000"/></Reveal>
      :SECT.map((s,k)=>p.hide&&p.hide.includes(s)?null:<Fragment key={s}><Reveal as="h4" v="left" viewport={VP}><Hl>{SECL[k]}</Hl></Reveal><Reveal viewport={VP}>{p.sec&&p.sec[s]?<div dangerouslySetInnerHTML={{__html:p.sec[s]}}/>:<p><span className="ph">Placeholder</span> Isi bagian ini dengan konten asli.</p>}</Reveal></Fragment>)}</div>
  </section></main>;
}
