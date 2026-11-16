import {useEffect,useRef} from "react";
import {AnimatePresence,motion} from "motion/react";
import {Deco} from "./StickyNote";

const slide={enter:d=>({x:d*90,opacity:0,rotate:d*5}),center:{x:0,opacity:1,rotate:0},exit:d=>({x:d*-90,opacity:0,rotate:d*-5})};
const fs=q=>q.length<100?"clamp(1.25rem,4.2vw,1.9rem)":q.length<220?"clamp(1.05rem,3.4vw,1.5rem)":"clamp(.95rem,3vw,1.2rem)";

// Focus Mode. Rendered in a portal and kept mounted so AnimatePresence can run exit animations.
// The note that was opened shares its layoutId with its board note (it flies out of / back into the board);
// notes reached with Previous/Next slide in instead.
export default function TestimonialFocus({items,focus,dir,reduced,onClose,onGo}){
  const open=!!focus,i=open?items.findIndex(n=>n.id===focus.id):-1,n=i>=0?items[i]:null,total=items.length;
  const closeBtn=useRef(null),from=useRef(null);

  useEffect(()=>{
    if(!n)return;
    from.current=document.activeElement;
    const k=e=>{
      if(e.key==="Escape"){e.preventDefault();onClose()}
      else if(e.key==="ArrowRight"){e.preventDefault();onGo(1)}
      else if(e.key==="ArrowLeft"){e.preventDefault();onGo(-1)}
      else if(e.key==="Tab"){                                   // keep keyboard focus inside the dialog
        const f=[...document.querySelectorAll(".tf-ctl button,.tf-x")];if(!f.length)return;
        const a=f.indexOf(document.activeElement);
        if(e.shiftKey&&a<=0){e.preventDefault();f[f.length-1].focus()}
        else if(!e.shiftKey&&a===f.length-1){e.preventDefault();f[0].focus()}
      }
    };
    const w=e=>e.preventDefault();                               // page behind must not scroll
    addEventListener("keydown",k);addEventListener("wheel",w,{passive:false});
    closeBtn.current?.focus({preventScroll:true});
    return()=>{removeEventListener("keydown",k);removeEventListener("wheel",w);from.current?.focus?.({preventScroll:true})};
  },[!!n]); // eslint-disable-line

  const t=reduced?{duration:0}:{type:"spring",stiffness:260,damping:30};
  const fade={initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:reduced?0:.25}};
  const shared=n&&focus.id===focus.open;
  return <div className="tf-fix" aria-hidden={!open}>
    <AnimatePresence custom={dir}>
      {n&&<motion.div key="bd" className="tf-bd" {...fade} onClick={onClose}/>}
      {n&&<motion.div key={"p"+n.id} className="tf-o" role="dialog" aria-modal="true" aria-label={`Testimoni dari ${n.name}`}
        layoutId={shared?"note-"+n.id:undefined} custom={dir} transition={t}
        {...(shared?{}:{variants:slide,initial:"enter",animate:"center",exit:"exit"})}>
        <motion.div className={"tf-p c-"+n.color} initial={shared&&!reduced?{rotate:n.rot}:false} animate={{rotate:0}} transition={t}>
          <Deco kind={n.deco}/>
          <motion.blockquote className="tf-q" style={{fontSize:fs(n.quote)}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:reduced?0:.18,duration:reduced?0:.3}}>“{n.quote}”</motion.blockquote>
          <div className="tf-f">
            <span className="tf-av" aria-hidden="true">{n.avatar?<img src={n.avatar} alt=""/>:(n.name||"?")[0]}</span>
            <span><strong>{n.name}</strong><span className="tf-r">{[n.role,n.org].filter(Boolean).join(" · ")}</span></span>
          </div>
        </motion.div>
      </motion.div>}
      {n&&<motion.div key="ctl" className="tf-ctl" {...fade} onClick={e=>e.stopPropagation()}>
        <button type="button" className="tf-btn" onClick={()=>onGo(-1)} disabled={total<2} aria-label="Testimoni sebelumnya">← Previous</button>
        <span className="tf-i" aria-live="polite">{String(i+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>
        <button type="button" className="tf-btn" onClick={()=>onGo(1)} disabled={total<2} aria-label="Testimoni berikutnya">Next →</button>
      </motion.div>}
      {n&&<motion.button key="x" ref={closeBtn} type="button" className="tf-btn tf-x" {...fade} onClick={onClose} aria-label="Tutup">Close ✕</motion.button>}
    </AnimatePresence>
  </div>;
}
