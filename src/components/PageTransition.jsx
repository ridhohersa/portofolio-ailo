import {createContext,forwardRef,useContext} from "react";
import {createPortal} from "react-dom";
import {motion} from "motion/react";
const E=[.7,0,.3,1];
// How the current route change is animated. App provides it (and it is read at render time, so a page that is
// already exiting also sees the newest value):
//   "page"  red wipe between ordinary pages
//   "vt"    View Transitions API owns the animation (shared elements), so Motion must not touch the pages
//   "plain" fallback for Home <-> project when View Transitions are unavailable (Motion layoutId + fade)
export const ModeCtx=createContext("page");
// old page slides left -> red panel covers -> new page enters from the right while the panel leaves (~520ms)
const page={initial:{opacity:0,x:"8vw",filter:"blur(6px)"},animate:{opacity:1,x:0,filter:"blur(0px)",transitionEnd:{filter:"none"},transition:{duration:.3,delay:.1,ease:[.2,.8,.2,1]}},exit:{opacity:.4,x:"-8vw",transition:{duration:.22,ease:[.7,0,.84,0]}}};
const panel={initial:{x:"0%"},animate:{x:"-100%",transition:{duration:.26,ease:E}},exit:{x:["100%","0%"],transition:{duration:.23,ease:E}}};
const plainV={initial:{opacity:0},animate:{opacity:1,transition:{duration:.35}},exit:{opacity:0,transition:{duration:.25}}};
const vtV={initial:{opacity:1},animate:{opacity:1},exit:{opacity:1,transition:{duration:0}}};
const PageTransition=forwardRef(function PageTransition({children},ref){
  const mode=useContext(ModeCtx);
  return <motion.div ref={ref} data-route="" variants={mode==="vt"?vtV:mode==="plain"?plainV:page} initial="initial" animate="animate" exit="exit" style={{position:"relative"}}>
    {children}
    {mode==="page"&&createPortal(<motion.div variants={panel} className="wipe" aria-hidden="true"/>,document.body)}
  </motion.div>;
});
export default PageTransition;
