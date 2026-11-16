import {createContext,useCallback,useContext,useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useAnimate} from "motion/react";
const E=[.7,0,.3,1];
const Ctx=createContext(cb=>cb());
export const useWipe=()=>useContext(Ctx);
// Red wipe for jumps between sections on the same page (route changes use PageTransition's own wipe)
export function WipeProvider({children}){
  const [scope,animate]=useAnimate(),busy=useRef(false);
  const run=useCallback(async cb=>{
    if(busy.current||matchMedia("(prefers-reduced-motion:reduce)").matches){cb();return}
    busy.current=true;const el=scope.current;
    await animate(el,{x:["100%","0%"]},{duration:.23,ease:E});
    cb();
    await animate(el,{x:["0%","-100%"]},{duration:.26,ease:E});
    busy.current=false;
  },[animate,scope]);
  return <Ctx.Provider value={run}>{children}<div ref={scope} className="wipe" style={{transform:"translateX(100%)"}} aria-hidden="true"/></Ctx.Provider>;
}
export function useJump(){
  const wipe=useWipe(),nav=useNavigate();
  return useCallback(id=>wipe(()=>{nav("/#"+id,{state:{wipe:1}});const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"instant"})}),[wipe,nav]);
}
