import {useId,useRef,useState} from "react";
import {AnimatePresence,motion,useReducedMotion} from "motion/react";
import {useSkills} from "../content";
import {Reveal} from "./Reveal";
import Hl from "./Hl";

const EASE=[.2,.8,.2,1];
// Setiap kategori diurutkan otomatis dari persentase tertinggi ke terendah (sort stabil: nilai sama tetap urut seperti di data.js).
const pct=x=>Array.isArray(x)?x[1]:x.p;
const rank=l=>[...l].sort((a,b)=>pct(b)-pct(a));
const TABS=[
  {id:"hard",label:"Hard Skills",lead:"Bidang keahlian utama yang saya tekuni.",hint:"Kemampuan inti, dinilai dari pengalaman di sekolah, organisasi, dan proyek."},
  {id:"soft",label:"Soft Skills",lead:"Cara saya bekerja dan belajar.",hint:"Sikap yang menopang semua bidang di atas."},
  {id:"tools",label:"Tools",lead:"Software dan teknologi pendukung.",hint:"Alat yang dipakai untuk mewujudkan kemampuan utama."}];

// The bar always has its real width; only a transform (scaleX) fills it, so nothing reflows. The number fades in shortly after.
const Bar=({n,v,cls,i=0})=>{const still=useReducedMotion();
  return <div className={"bar "+cls} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={n}>
  <motion.b style={{width:v+"%",transformOrigin:"0 50%"}} initial={still?false:{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:1,delay:.1+i*.06,ease:EASE}}/></div>};
const Pct=({i=0,as="span",...p})=>{const still=useReducedMotion(),M=motion[as];
  return <M initial={still?false:{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:.6,delay:.45+i*.06,ease:"easeOut"}} {...p}/>};
const Basis=({t})=>t?<span className="sx-basis">{t}</span>:null;

// Hard skills: editorial rows, big figure on the left, name + bar + description on the right
const Hard=({list})=><ol className="sx-hard">{rank(list).map((s,i)=><li key={s.n} className={i===0?"lead":""}>
  <Pct i={i} className="sx-pct" aria-hidden="true">{s.p}<small>%</small></Pct>
  <div className="sx-b"><div className="row"><h4>{s.n}</h4><span className="sr-only">{s.p}%</span></div>
    <Bar n={s.n} v={s.p} cls="hard" i={i}/><p className="sx-d">{s.d}</p><Basis t={s.basis}/></div>
</li>)}</ol>;

// Soft skills: a 2x2 field of large figures with sage bars
const Soft=({list})=><ul className="sx-soft">{rank(list).map(([n,v],i)=><li key={n}>
  <Pct i={i} className="sx-pct" aria-hidden="true">{v}<small>%</small></Pct>
  <div className="row"><h4>{n}</h4><span className="sr-only">{v}%</span></div>
  <Bar n={n} v={v} cls="soft" i={i}/>
</li>)}</ul>;

// Tools: two groups (code / design), each a list of compact rows with monogram, bar and purpose
const groups=T=>[...new Set(T.map(t=>t.g))].map(g=>[g,T.filter(t=>t.g===g)]);
const Tools=({list})=><div className="sx-tools">{groups(rank(list)).map(([g,l],gi)=><div key={g} className="sx-grp">
  <p className="label">{String(gi+1).padStart(2,"0")} · {g}</p>
  <ul>{l.map((t,i)=><li key={t.n}>
    <span className="sx-ic" aria-hidden="true">{t.icon?<img src={t.icon} alt="" loading="lazy"/>:t.m}</span>
    <div className="sx-b"><div className="row"><h4>{t.n}</h4><Pct i={i} className="sx-tp">{t.p}%</Pct></div>
      <Bar n={t.n} v={t.p} cls="tool" i={i}/><p className="sx-d">{t.d}</p><Basis t={t.basis}/></div>
  </li>)}</ul></div>)}</div>;
const VIEW={hard:Hard,soft:Soft,tools:Tools};

// Skills with three real filters (Hard Skills / Soft Skills / Tools). Content lives in SKILLS (src/data.js).
export default function Skills(){
  const SK=useSkills(),[tab,setTab]=useState("hard"),uid=useId().replace(/:/g,""),refs=useRef({});
  const cur=TABS.find(t=>t.id===tab),View=VIEW[tab];
  const onKey=e=>{
    const i=TABS.findIndex(t=>t.id===tab),d={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];
    if(e.key==="Home"||e.key==="End"||d){e.preventDefault();
      const n=e.key==="Home"?0:e.key==="End"?TABS.length-1:(i+d+TABS.length)%TABS.length;
      setTab(TABS[n].id);refs.current[TABS[n].id]?.focus()}
  };
  return <section className="s dark" id="skills" aria-labelledby="sk">
    <Reveal as="h2" id="sk"><Hl>Skills</Hl></Reveal>
    <div className="tools sx-tabs" role="tablist" aria-label="Kategori skill" onKeyDown={onKey}>
      {TABS.map(t=><button key={t.id} ref={el=>refs.current[t.id]=el} id={`${uid}-t-${t.id}`} role="tab" type="button" className="chip sx-tab"
        aria-selected={tab===t.id} aria-pressed={tab===t.id} aria-controls={`${uid}-p`} tabIndex={tab===t.id?0:-1} onClick={()=>setTab(t.id)}>
        {tab===t.id&&<motion.span layoutId="sx-ind" className="sx-ind" transition={{type:"spring",stiffness:380,damping:34}}/>}
        <span className="sx-tl">{t.label}<em>{String(SK[t.id].length).padStart(2,"0")}</em></span>
      </button>)}
    </div>
    <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t-${tab}`} className="sx-panel">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} className="sx-in" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.28,ease:EASE}}>
          <div className="sx-side"><h3 className="sx-ttl"><Hl>{cur.label}</Hl></h3><p className="sx-lead">{cur.lead}</p><p>{cur.hint}</p></div>
          <div className="sx-main"><View list={SK[tab]}/></div>
        </motion.div>
      </AnimatePresence>
    </div>
  </section>;
}
