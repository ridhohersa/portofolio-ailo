import {useRef,useState} from "react";
import {motion,useScroll,useTransform,useReducedMotion,useMotionValueEvent} from "motion/react";
import {Reveal,Item,ParallaxElement,EASE} from "./Reveal";
import {useAbout} from "../content";
import {fmy} from "../util";
import Hl from "./Hl";

// Editorial focus: the block nearest the middle of the viewport is fully opaque, the others sit back (never below .45, so everything stays readable).
// Scroll-linked, so it reverses when scrolling up.
function Blk({className="am-blk",children,...p}){
  const ref=useRef(null),still=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","start 45%","end 55%","end start"]});
  const o=useTransform(scrollYProgress,[0,.18,.82,1],still?[1,1,1,1]:[.45,1,1,.45]);
  return <motion.div ref={ref} className={className} style={{opacity:o}} {...p}>{children}</motion.div>;
}
// One education step: the red line fills as the step crosses the reading line (60% down the viewport) and the dot turns red once reached.
function Step({e,children}){
  const ref=useRef(null),still=useReducedMotion(),[on,setOn]=useState(!!still);
  const {scrollYProgress:p}=useScroll({target:ref,offset:["start 60%","end 60%"]});
  useMotionValueEvent(p,"change",v=>{if(!still)setOn(v>.02)});   // state flips only when the threshold is crossed
  const iv=still?{hidden:{opacity:1},show:{opacity:1}}:{hidden:{opacity:0,y:24},show:{opacity:1,y:0}};
  return <motion.li ref={ref} variants={iv} transition={{duration:.6,ease:EASE}} className={"am-step"+(e.now?" now":"")+(on?" on":"")}>
    <motion.i className="am-draw" aria-hidden="true" style={{scaleY:still?1:p}}/>
    {children}
  </motion.li>;
}
const Head=({id,n,t,sub})=><header className="am-hd"><span className="am-n" aria-hidden="true">{n}</span><h3 id={id}><Hl>{t}</Hl></h3>{sub&&<p className="label">{sub}</p>}</header>;

// About, split into five blocks with different layouts. All content comes from ABOUT in src/data.js (and BIO in src/html.js).
export default function About(){
  const {about:A,bio:BIO}=useAbout();
  return <section className="s" id="about" aria-labelledby="ab">
    <Reveal as="h2" id="ab" v="left"><Hl>About</Hl></Reveal>

    <Blk className="am-blk am-intro" aria-labelledby="am1">
      <Head id="am1" n="01" t="Introduction" sub="Biografi singkat"/>
      <div className="am-intro-g">
        <Reveal className="am-lead"><div dangerouslySetInnerHTML={{__html:BIO}}/></Reveal>
        <Reveal v="right" delay={.1}><dl className="am-facts">{A.intro.facts.map(([k,v])=><div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}</dl></Reveal>
      </div>
      <Reveal><p className="am-goal"><span className="label">Tujuan karier</span>{A.intro.goal}</p></Reveal>
    </Blk>

    <Blk aria-labelledby="am2">
      <Head id="am2" n="02" t="Education" sub="Riwayat pendidikan"/>
      <Reveal as="ol" stagger className="am-edu">{A.education.map(e=><Step key={e.lv} e={e}>
        <ParallaxElement as="span" range={[-7,7]} className="am-lv" aria-hidden="true">{e.lv}</ParallaxElement>
        <div className="am-card am-ed">
          <p className="label am-lbl"><span>{e.kk}{e.p&&" · "+e.p}</span>{e.now&&<span className="am-cur">Saat ini</span>}</p>
          <h4>{e.n}</h4>
          {e.t&&<p className="am-t">{e.t}</p>}
          {e.d&&<p>{e.d}</p>}
          {(e.focus||e.act)&&<dl>
            {e.focus&&<div><dt className="label">Fokus</dt><dd>{e.focus}</dd></div>}
            {e.act&&<div><dt className="label">Kegiatan</dt><dd><ul className="am-tags">{e.act.map(a=><li key={a}>{a}</li>)}</ul></dd></div>}
          </dl>}
        </div>
      </Step>)}</Reveal>
    </Blk>

    <Blk aria-labelledby="am3">
      <Head id="am3" n="03" t="Expertise" sub="Keahlian utama di UI/UX dan web"/>
      <Reveal stagger className="am-exp">{A.expertise.map(([t,d],i)=><Item key={t} className="am-xt">
        <span className="am-xn" aria-hidden="true">{String(i+1).padStart(2,"0")}</span><h4>{t}</h4><p>{d}</p>
      </Item>)}</Reveal>
      <p className="label am-sub">Pengalaman praktik</p>
      <Reveal stagger className="am-xp">{A.experience.map(x=><Item key={x.n} className="am-card am-xe">
        <p className="label">{x.p}</p><h4>{x.n}</h4><p>{x.d}</p>
      </Item>)}</Reveal>
    </Blk>

    <Blk aria-labelledby="am4">
      <Head id="am4" n="04" t="Organization" sub="Organisasi dan kepanitiaan"/>
      <Reveal stagger className="am-org">{A.organization.map(o=><Item key={o.n} className="am-card am-og">
        <div><p className="label">{o.r}{o.p&&" · "+o.p}</p><h4>{o.n}</h4></div>
        <p>{o.d}</p>
      </Item>)}</Reveal>
    </Blk>

    <Blk aria-labelledby="am5">
      <Head id="am5" n="05" t="Certificates" sub="Sertifikat dan pencapaian"/>
      <Reveal stagger className="am-cert">{A.certificates.map(c=><Item key={c.n} className="am-card am-ce">
        <p className="label">{c.k}</p>
        {c.hi&&<p className="am-hi" aria-label={"Skor "+c.hi}>{c.hi}</p>}
        <h4>{c.n}</h4>
        <dl>
          <div><dt className="label">Penyelenggara</dt><dd>{c.by}</dd></div>
          <div><dt className="label">Waktu</dt><dd><time dateTime={c.date}>{fmy(c.date)}</time></dd></div>
          {c.doc&&<div><dt className="label">Dokumentasi</dt><dd><a href={c.doc} target="_blank" rel="noopener noreferrer">Lihat sertifikat</a></dd></div>}
        </dl>
      </Item>)}</Reveal>
    </Blk>
  </section>;
}
