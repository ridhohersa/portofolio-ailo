import {useEffect,useRef,useState} from "react";
import {motion,useReducedMotion,useScroll,useTransform} from "motion/react";

// ---- shared scroll-animation primitives -------------------------------------------------------------------------
// Reveal / Item / StaggerContainer  : staggered entrance, whileInView, once
// RevealImage / maskV               : "paper" clip-path mask that opens as the image enters the viewport
// ParallaxElement / useParallaxFactor: very light scroll-linked drift (MotionValues only, no React state per frame)
// Everything collapses to "just show the content" under prefers-reduced-motion.
export const EASE=[.2,.8,.2,1];
const MASK_EASE=[.65,0,.35,1];

const V={up:{hidden:{opacity:0,y:24},show:{opacity:1,y:0}},left:{hidden:{opacity:0,x:-36},show:{opacity:1,x:0}},right:{hidden:{opacity:0,x:36},show:{opacity:1,x:0}},scale:{hidden:{opacity:0,scale:.95},show:{opacity:1,scale:1}}};
const STILL={hidden:{opacity:1},show:{opacity:1}};   // reduced motion: nothing is ever hidden

export function Reveal({as="div",v="up",delay=0,stagger=false,children,...p}){
  const M=motion[as],still=useReducedMotion();
  const variants=still?STILL:stagger?{hidden:{},show:{transition:{staggerChildren:.09,delayChildren:delay}}}:V[v];
  return <M variants={variants} initial="hidden" whileInView="show" viewport={{once:true,amount:.2}} transition={{duration:.7,delay:stagger?0:delay,ease:EASE}} {...p}>{children}</M>;
}
export function Item({v="up",as:Tag=motion.div,children,...p}){
  const still=useReducedMotion();
  return <Tag variants={still?STILL:V[v]} transition={{duration:.6,ease:EASE}} {...p}>{children}</Tag>;
}
export const StaggerContainer=props=><Reveal stagger {...props}/>;

// ---- image mask -------------------------------------------------------------------------------------------------
// Variants for a clip-path "paper" reveal. `show` is the label of the parent state that opens the mask, so it can be used
// inside a card whose variants are named differently. The mask is removed (clipPath:none) once open: nothing stays cropped.
const CLOSED={up:"inset(100% 0% 0% 0%)",right:"inset(0% 100% 0% 0%)",down:"inset(0% 0% 100% 0%)",left:"inset(0% 0% 0% 100%)"};
export const maskV=(show="show",dir="up",delay=0)=>({
  hidden:{clipPath:CLOSED[dir],opacity:0},
  [show]:{clipPath:"inset(0% 0% 0% 0%)",opacity:1,transitionEnd:{clipPath:"none"},
    transition:{clipPath:{duration:.9,delay,ease:MASK_EASE},opacity:{duration:.5,delay}}}
});
const MASK_STILL={hidden:{clipPath:"none",opacity:1},show:{clipPath:"none",opacity:1}};
export function RevealImage({dir="up",delay=0,as="div",children,...p}){
  const M=motion[as],still=useReducedMotion();
  return <M variants={still?MASK_STILL:maskV("show",dir,delay)} initial="hidden" whileInView="show" viewport={{once:true,amount:.15}} {...p}>{children}</M>;
}

// ---- parallax ---------------------------------------------------------------------------------------------------
// 1 on desktop, .5 on phones, 0 with reduced motion. Only re-renders when the media query flips, never while scrolling.
export function useParallaxFactor(){
  const still=useReducedMotion();
  const [small,setSmall]=useState(()=>typeof matchMedia==="function"&&matchMedia("(max-width:720px)").matches);
  useEffect(()=>{
    if(typeof matchMedia!=="function")return;
    const m=matchMedia("(max-width:720px)"),f=()=>setSmall(m.matches);
    f();m.addEventListener("change",f);return()=>m.removeEventListener("change",f);
  },[]);
  return still?0:small?.5:1;
}
// Drifts from range[0] to range[1] px while the element crosses the viewport. `scale` (optional) keeps a cropped image from
// showing its edges while it moves.
export function ParallaxElement({as="div",axis="y",range=[-12,12],scale,children,style,...p}){
  const ref=useRef(null),k=useParallaxFactor();
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const d=useTransform(scrollYProgress,[0,1],[range[0]*k,range[1]*k]);
  const M=motion[as];
  return <M ref={ref} style={{...style,[axis]:d,...(scale&&k?{scale}:null)}} {...p}>{children}</M>;
}
