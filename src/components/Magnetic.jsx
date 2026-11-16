import {useRef} from "react";
import {motion,useMotionValue,useSpring} from "motion/react";
export default function Magnetic({children,s=.35}){
  const ref=useRef(null),x=useMotionValue(0),y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:300,damping:20}),sy=useSpring(y,{stiffness:300,damping:20});
  const mv=e=>{if(e.pointerType==="touch")return;const r=ref.current.getBoundingClientRect();x.set((e.clientX-r.left-r.width/2)*s);y.set((e.clientY-r.top-r.height/2)*s)};
  const lv=()=>{x.set(0);y.set(0)};
  return <motion.span ref={ref} data-mag style={{display:"inline-block",x:sx,y:sy}} onPointerMove={mv} onPointerLeave={lv}>{children}</motion.span>;
}
