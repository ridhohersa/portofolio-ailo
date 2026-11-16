import {useEffect,useState} from "react";
import {motion,useMotionValue,useSpring} from "motion/react";
// Elemen yang diberi cursor native dan efek hover sendiri: custom cursor menyingkir supaya klik, ketik, dan drag tidak terganggu.
const HOVER="a,button,[role=button],summary,label,[data-mag]";
const NATIVE="input,textarea,select,[contenteditable=true],.sn:not(.ln-t)";
export default function Cursor(){
  const [on,setOn]=useState(false),[hov,setHov]=useState(false),[away,setAway]=useState(false);
  const x=useMotionValue(-100),y=useMotionValue(-100);
  const sx=useSpring(x,{stiffness:500,damping:40,mass:.3}),sy=useSpring(y,{stiffness:500,damping:40,mass:.3});
  useEffect(()=>{
    // hanya perangkat dengan mouse/trackpad; layar sentuh dan reduced-motion memakai cursor bawaan
    const fine=matchMedia("(hover:hover) and (pointer:fine)"),calm=matchMedia("(prefers-reduced-motion:reduce)");
    if(!fine.matches||calm.matches)return;
    const off=()=>{setOn(false);document.body.classList.remove("cur")};
    setOn(true);document.body.classList.add("cur");
    // pointer touch/pen di perangkat hybrid: matikan sampai mouse bergerak lagi
    const mv=e=>{
      if(e.pointerType&&e.pointerType!=="mouse"){off();return}
      setOn(true);document.body.classList.add("cur");x.set(e.clientX);y.set(e.clientY);
    };
    const ov=e=>{const t=e.target.closest?e.target:e.target.parentElement;
      setAway(!!(t&&t.closest(NATIVE)));setHov(!!(t&&t.closest(HOVER)))};
    const gone=e=>{if(!e.relatedTarget)setAway(true)};
    addEventListener("pointermove",mv,{passive:true});addEventListener("pointerover",ov);document.addEventListener("mouseleave",gone);
    return()=>{off();removeEventListener("pointermove",mv);removeEventListener("pointerover",ov);document.removeEventListener("mouseleave",gone)};
  },[x,y]);
  if(!on)return null;
  return <motion.div className={"cur2"+(away?" away":"")} aria-hidden="true" style={{x:sx,y:sy}}>
    <motion.div className={"cur2i"+(hov?" h":"")} animate={{width:hov?40:14,height:hov?40:14,x:"-50%",y:"-50%"}} transition={{duration:.2}}/>
  </motion.div>;
}
