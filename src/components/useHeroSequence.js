import {useEffect,useState} from "react";

// Hero entrance sequence (runs once per visit):
//  0 idle -> 1 "Designing" -> 2 type "beyond" -> 3 "the" -> 4 "interface." -> 5 photo -> 6 profile -> 7 done (caret removed)
export const WORD="beyond";
export const DONE=7;

let played=false; // module scope: returning to Home inside the same visit must not replay the intro
const reduced=()=>typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useHeroSequence(){
  const [instant]=useState(()=>played||reduced());
  const [s,setS]=useState(()=>instant?{stage:DONE,typed:WORD.length,caret:false}:{stage:0,typed:0,caret:false});

  useEffect(()=>{
    if(instant)return;
    const timers=[];
    const at=(ms,fn)=>{timers.push(setTimeout(fn,ms))};
    const set=p=>setS(v=>({...v,...p}));

    at(300,()=>set({stage:1}));            // "Designing" (navbar fade runs in CSS during the first 0.5s)
    at(900,()=>{                           // "beyond", one character at a time
      set({stage:2,caret:true});
      let n=0;
      const next=()=>{
        n++;set({typed:n});
        if(n<WORD.length){at(70+Math.random()*65,next);return}
        at(150,()=>set({stage:3}));        // "the"
        at(420,()=>set({stage:4}));        // "interface."
        at(700,()=>set({stage:5}));        // photo
        at(900,()=>set({caret:false}));    // cursor goes away once the headline has landed
        at(1100,()=>set({stage:6}));       // profile
        at(1900,()=>{set({stage:DONE});played=true});
      };
      next();
    });

    return()=>timers.forEach(clearTimeout); // unmount (or StrictMode re-run): nothing keeps firing
  },[instant]);

  return {...s,instant};
}
