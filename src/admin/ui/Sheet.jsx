import {useEffect,useId,useRef} from "react";
import {createPortal} from "react-dom";
import {AnimatePresence,motion} from "motion/react";
import Icon from "./Icon";

const FOCUSABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const EASE=[.2,.8,.2,1];
// Satu komponen untuk drawer (side="right"), modal tengah (side="center") dan drawer navigasi (side="left").
// Escape menutup, fokus berpindah ke dalam dan kembali ke pemicu, Tab berputar di dalam panel, scroll halaman dikunci.
export default function Sheet({open,onClose,title,children,footer,side="right",wide,small,bare}){
  const ref=useRef(null),back=useRef(null),id=useId(),closeRef=useRef(onClose);
  closeRef.current=onClose;   // onClose sering berupa fungsi baru di tiap render: jangan jadikan dependency, supaya fokus tidak melompat
  useEffect(()=>{
    if(!open)return;
    back.current=document.activeElement;
    const prev=document.body.style.overflow;document.body.style.overflow="hidden";
    const t=setTimeout(()=>{const el=ref.current;if(el&&!el.contains(document.activeElement))(el.querySelector("[data-autofocus]")||el.querySelector(FOCUSABLE)||el).focus()},60);
    const key=e=>{
      if(e.key==="Escape"){e.stopPropagation();closeRef.current()}
      if(e.key==="Tab"&&ref.current){
        const f=[...ref.current.querySelectorAll(FOCUSABLE)].filter(x=>x.offsetParent!==null);
        if(!f.length)return;const a=f[0],z=f[f.length-1];
        if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
        else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
      }
    };
    document.addEventListener("keydown",key);
    return()=>{clearTimeout(t);document.removeEventListener("keydown",key);document.body.style.overflow=prev;back.current?.focus?.()};
  },[open]);
  const anim=side==="right"?{initial:{x:"100%"},animate:{x:0},exit:{x:"100%"}}
    :side==="left"?{initial:{x:"-100%"},animate:{x:0},exit:{x:"-100%"}}
    :{initial:{opacity:0,y:18},animate:{opacity:1,y:0},exit:{opacity:0,y:10}};
  if(typeof document==="undefined")return null;
  return createPortal(<AnimatePresence>{open&&[
    <motion.div key="scrim" className="adm-scrim" aria-hidden="true" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}/>,
    <div key="wrap" className={"adm-sheetwrap "+side} onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
      <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby={id} tabIndex={-1}
        className={"adm-sheet "+side+(wide?" wide":"")+(small?" small":"")+(bare?" bare":"")} {...anim} transition={{duration:.32,ease:EASE}}>
        {!bare&&<header className="adm-sheet-h"><h2 id={id}>{title}</h2><button type="button" className="adm-iconbtn" onClick={onClose} aria-label="Tutup"><Icon n="x"/></button></header>}
        <div className="adm-sheet-b">{children}</div>
        {footer&&<footer className="adm-sheet-f">{footer}</footer>}
      </motion.div>
    </div>
  ]}</AnimatePresence>,document.body);
}
