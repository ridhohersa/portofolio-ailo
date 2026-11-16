import {useEffect,useState} from "react";
// prefers-reduced-motion, live
export default function useReduced(){
  const q=()=>typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)");
  const [r,set]=useState(()=>!!(q()&&q().matches));
  useEffect(()=>{const m=q();if(!m)return;const f=()=>set(m.matches);f();m.addEventListener("change",f);return()=>m.removeEventListener("change",f)},[]);
  return r;
}
