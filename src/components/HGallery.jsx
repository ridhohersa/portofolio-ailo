import {createContext,forwardRef,useContext,useLayoutEffect,useRef,useState,useEffect} from "react";
import {motion,useReducedMotion,useScroll,useSpring,useTransform,useMotionValueEvent} from "motion/react";

// Projects as a horizontal editorial archive.
//  desktop (>=900px): the gallery pins while the page scrolls vertically; vertical progress drives the track's x (MotionValues only).
//                     When the last card is reached the pin releases and the page scrolls normally. No scroll hijacking: it is native scrolling.
//  phone / tablet / reduced motion: an ordinary swipeable row (native overflow-x + scroll snap), no pin.
// Layout rule: the pinned box is exactly one viewport tall and the outer box is (viewport + travel) tall, so scroll progress 0..1
// maps 1:1 onto the horizontal travel.
const Ctx=createContext({prog:null,n:0,pin:false});
const mq=()=>typeof matchMedia==="function"&&matchMedia("(min-width:900px)").matches;
const pad=n=>String(n).padStart(2,"0");

export default function HGallery({n,children}){
  const still=useReducedMotion();
  const [wide,setWide]=useState(mq);
  useEffect(()=>{const m=matchMedia("(min-width:900px)"),f=()=>setWide(m.matches);f();m.addEventListener("change",f);return()=>m.removeEventListener("change",f)},[]);
  const outer=useRef(null),view=useRef(null),track=useRef(null);
  const [dist,setDist]=useState(0);
  const pin=wide&&!still&&dist>0;
  // travel = track width - visible width. Re-measured only when sizes change (resize / filter), never while scrolling.
  useLayoutEffect(()=>{
    const t=track.current,v=view.current;if(!t||!v)return;
    const m=()=>setDist(wide&&!still?Math.max(0,Math.round(t.offsetWidth-v.clientWidth)):0);
    m();const ro=new ResizeObserver(m);ro.observe(t);ro.observe(v);return()=>ro.disconnect();
  },[wide,still,n]);

  const {scrollYProgress}=useScroll({target:outer,offset:["start start","end end"]});
  const {scrollXProgress}=useScroll({container:view});
  const sy=useSpring(scrollYProgress,{stiffness:140,damping:30,mass:.4});
  const prog=pin?sy:scrollXProgress;
  const x=useTransform(sy,[0,1],[0,-dist]);
  const [act,setAct]=useState(0);
  useMotionValueEvent(prog,"change",v=>setAct(Math.max(0,Math.min(n-1,Math.round((v||0)*(n-1))))));   // re-renders only when the card index changes

  return <Ctx.Provider value={{prog,n,pin}}>
    <div ref={outer} className={"pj-outer"+(pin?" pin":"")} style={pin?{height:`calc(100svh + ${dist}px)`}:undefined}>
      <div className="pj-stick">
        <div ref={view} className="pj-view">
          <motion.div ref={track} className="pj-track" style={pin?{x}:undefined} aria-live="polite">{children}</motion.div>
        </div>
        {n>1&&<div className="pj-prog" aria-hidden="true">
          <span className="label">{pad(Math.min(act+1,n))} / {pad(n)}</span>
          <span className="pj-bar"><motion.i style={{scaleX:prog}}/></span>
        </div>}
      </div>
    </div>
  </Ctx.Provider>;
}

// One gallery slot. The active card grows a little (scale on this wrapper, so the card's own hover / tap / shared-element code is untouched).
export const GItem=forwardRef(function GItem({index,children,...p},ref){
  const {prog,n,pin}=useContext(Ctx);
  const s=useTransform(prog,v=>{
    if(!pin||n<2)return 1;
    return 1+.045*Math.max(0,1-Math.abs((v||0)*(n-1)-index));
  });
  return <motion.div ref={ref} style={{scale:s,transformOrigin:"50% 60%"}} {...p}>{children}</motion.div>;
});
