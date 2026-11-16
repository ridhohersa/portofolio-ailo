import {useRef,useState,useLayoutEffect} from "react";
import {motion,useScroll,useMotionValueEvent} from "motion/react";
import {TIMELINE} from "../html";
// Existing About timeline: the red fill is bound to scroll progress (no React state per pixel); only marker count is state.
export default function Timeline(){
  const ref=useRef(null),tops=useRef([]);
  const {scrollYProgress}=useScroll({target:ref,offset:["start 0.55","end 0.55"]});
  const [n,setN]=useState(0);
  useLayoutEffect(()=>{
    const m=()=>{const ol=ref.current;tops.current=[...ol.querySelectorAll("li")].map(li=>(li.offsetTop+8)/ol.offsetHeight)};
    m();addEventListener("resize",m);return()=>removeEventListener("resize",m);
  },[]);
  useMotionValueEvent(scrollYProgress,"change",v=>setN(tops.current.filter(t=>v>=t).length));
  return <ol className="tl tlr" ref={ref}>
    <motion.span className="tl-fill" style={{scaleY:scrollYProgress}} aria-hidden="true"/>
    {TIMELINE.map((h,i)=><li key={i}>
      <motion.i className="tl-mk" aria-hidden="true" animate={{opacity:i<n?1:.35,scale:i<n?1.15:1,boxShadow:i<n?"0 0 0 5px rgba(232,74,53,.25)":"0 0 0 0px rgba(232,74,53,0)"}} transition={{duration:.3}}/>
      <span dangerouslySetInnerHTML={{__html:h}}/>
    </li>)}
  </ol>;
}
