import {useState} from "react";
import {motion,AnimatePresence,useScroll,useMotionValueEvent} from "motion/react";
export default function BackToTop(){
  const {scrollY}=useScroll();const [on,setOn]=useState(false);
  useMotionValueEvent(scrollY,"change",y=>setOn(y>600));
  return <AnimatePresence>{on&&<motion.button id="top" className="on" aria-label="Kembali ke atas" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}} whileHover={{y:-3}} whileTap={{scale:.92}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>↑</motion.button>}</AnimatePresence>;
}
