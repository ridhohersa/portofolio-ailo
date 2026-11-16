import {useEffect,useState} from "react";
import {motion,AnimatePresence} from "motion/react";
export default function EasterEgg(){
  const [on,setOn]=useState(false);
  useEffect(()=>{let b="";const kd=e=>{if(e.target.matches&&e.target.matches("input,textarea,select"))return;if(e.key==="Escape")setOn(false);b=(b+e.key.toLowerCase()).slice(-4);if(b==="ailo")setOn(true)};
    addEventListener("keydown",kd);return()=>removeEventListener("keydown",kd)},[]);
  return <AnimatePresence>{on&&<motion.div className="egg" role="dialog" aria-label="Easter egg" initial={{clipPath:"circle(0% at 50% 50%)"}} animate={{clipPath:"circle(150% at 50% 50%)"}} exit={{opacity:0}} transition={{duration:.6}} onClick={()=>setOn(false)}>
    <motion.p initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.3}}>Halo, kamu menemukan Ailo.</motion.p></motion.div>}</AnimatePresence>;
}
