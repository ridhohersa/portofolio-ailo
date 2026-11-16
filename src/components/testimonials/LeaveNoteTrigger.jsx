import {forwardRef} from "react";
import {motion} from "motion/react";
import {Deco} from "./StickyNote";

const SHADOW="0 1px 1px rgba(0,0,0,.28), 0 6px 10px -4px rgba(0,0,0,.4), 0 14px 18px -10px rgba(0,0,0,.35)";
const ROT=3;

export function Pencil(){
  return <svg className="ln-pencil" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L8 19l-4 1z"/><path d="M14.5 6.5l3 3"/></svg>;
}

// The blank note pinned at the edge of the board. It shares layoutId "leave-note" with the form paper, so clicking it
// makes this very paper grow and glide to the middle of the screen. While the form is open it stays put (invisible to input).
const LeaveNoteTrigger=forwardRef(function LeaveNoteTrigger({left,top,size,z,reduced,active,onOpen},ref){
  const spring=reduced?{duration:0}:{type:"spring",stiffness:320,damping:24};
  return <motion.div layoutId="leave-note" className="sn ln-t" style={{left,top,width:size,height:size,zIndex:z,"--ns":size+"px",cursor:"pointer",pointerEvents:active?"none":"auto"}} transition={spring}>
    <div className="sn-f">
      <motion.div className="sn-p c-cream ln-blank" initial={false} animate={{rotate:ROT,boxShadow:SHADOW}}
        whileHover={reduced?undefined:{y:-5,rotate:ROT*.4}} whileTap={reduced?undefined:{scale:.97}} transition={spring}>
        <Deco kind="tape"/>
        <Pencil/>
        <span className="ln-lines" aria-hidden="true"/>
        <span className="ln-hint">
          <strong>Leave a note</strong>
          <span>Your note goes here</span>
        </span>
        <button ref={ref} type="button" className="ln-hit" onClick={onOpen} tabIndex={active?-1:0}
          aria-haspopup="dialog" aria-label="Leave a note: write a testimonial for Ridho"/>
      </motion.div>
    </div>
  </motion.div>;
});
export default LeaveNoteTrigger;
