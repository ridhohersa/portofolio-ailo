import {useRef,useState,useLayoutEffect} from "react";
import {motion,useMotionValue,animate} from "motion/react";

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const SHADOW="0 1px 1px rgba(0,0,0,.28), 0 6px 10px -4px rgba(0,0,0,.4), 0 14px 18px -10px rgba(0,0,0,.35)";
const SHADOW_UP="0 2px 3px rgba(0,0,0,.2), 0 18px 26px -8px rgba(0,0,0,.5), 0 34px 40px -16px rgba(0,0,0,.45)";
const MOVE=5;          // px of pointer travel before a press becomes a drag (below it, release = click)
const SETTLE={type:"spring",stiffness:200,damping:28}; // ~critically damped: glides to a stop and never crosses the board edge

// A square sticky note. Position is plain left/top (MotionValues), not a transform, so the shared layout animation into
// Focus Mode measures the real position. Drag is pointer-event based so mouse, touch and pen behave the same.
export default function StickyNote({note,index,size,board,z,reduced,entered,active,onRaise,onOpen}){
  const max={x:Math.max(0,board.w-size),y:Math.max(0,board.h-size)};
  const mx=useRef(max);mx.current=max;
  const compact=board.w<560;                         // phone-width board uses the zig-zag layout (note.mx / note.my)
  const home=()=>compact?{x:note.mx,y:note.my}:{x:note.fx,y:note.fy};
  const frac=useRef(home());                         // remembered as fractions so a resize keeps the note where it was
  const mode=useRef(compact);
  if(mode.current!==compact){mode.current=compact;frac.current=home()}   // crossing the phone breakpoint resets to that layout
  const px=useMotionValue(frac.current.x*max.x),py=useMotionValue(frac.current.y*max.y);
  const [lift,setLift]=useState(false);
  const d=useRef(null);
  const placed=useRef(false);                          // true once the note has been pinned (entrance done, or the user touched it): the entrance never replays or delays anything
  useLayoutEffect(()=>{px.set(frac.current.x*max.x);py.set(frac.current.y*max.y)},[max.x,max.y,px,py]);

  const down=e=>{
    if(e.pointerType==="mouse"&&e.button!==0)return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    placed.current=true;px.stop?.();py.stop?.();
    d.current={sx:e.clientX,sy:e.clientY,ox:px.get(),oy:py.get(),moved:false,vx:0,vy:0,t:e.timeStamp,lx:e.clientX,ly:e.clientY};
    onRaise(note.id);
  };
  const move=e=>{
    const s=d.current;if(!s)return;
    if(!s.moved){if(Math.hypot(e.clientX-s.sx,e.clientY-s.sy)<MOVE)return;s.moved=true;setLift(true)}
    const dt=Math.max(1,e.timeStamp-s.t);
    s.vx=.6*s.vx+.4*((e.clientX-s.lx)/dt*1000);s.vy=.6*s.vy+.4*((e.clientY-s.ly)/dt*1000);
    s.t=e.timeStamp;s.lx=e.clientX;s.ly=e.clientY;
    px.set(clamp(s.ox+e.clientX-s.sx,0,mx.current.x));py.set(clamp(s.oy+e.clientY-s.sy,0,mx.current.y));
  };
  const up=()=>{
    const s=d.current;d.current=null;if(!s)return;
    if(!s.moved){onOpen(note.id);return}                 // a press that never travelled is a click -> Focus Mode
    setLift(false);
    const tx=clamp(px.get()+s.vx*.14,0,mx.current.x),ty=clamp(py.get()+s.vy*.14,0,mx.current.y); // a short throw, then spring to rest
    const cfg=reduced?{duration:0}:SETTLE;
    animate(px,tx,{...cfg,velocity:s.vx});animate(py,ty,{...cfg,velocity:s.vy});
    frac.current={x:mx.current.x?tx/mx.current.x:0,y:mx.current.y?ty/mx.current.y:0};
  };
  const cancel=()=>{d.current=null;setLift(false)};
  const key=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onOpen(note.id)}};

  const spring=reduced?{duration:0}:{type:"spring",stiffness:320,damping:24};
  const floating=!!note.float&&!reduced&&!lift&&!active&&entered;
  // Sticky-note entrance: drops in slightly larger and tilted the wrong way, then a soft spring settles it on its own final rotation.
  // Only opacity / scale / rotate / y of the inner paper move; position (left/top), size and drag are not touched.
  const kick=(index%2?1:-1)*10,hidden={opacity:0,scale:.72,rotate:note.rot+kick,y:-26,boxShadow:SHADOW};
  const rest={opacity:1,scale:1,rotate:note.rot,y:0,boxShadow:SHADOW};
  const pinned=reduced||entered;
  const enter={type:"spring",stiffness:150,damping:15,mass:.9,delay:placed.current?0:.08+index*.14};
  const target=lift?{opacity:1,y:0,scale:1.09,rotate:note.rot*.3,boxShadow:SHADOW_UP}:pinned?rest:hidden;
  return <motion.div layoutId={"note-"+note.id} className={"sn"+(lift?" up":"")} role="button" tabIndex={active?-1:0}
    aria-label={`Buka testimoni dari ${note.name}`} data-note={note.id}
    style={{left:px,top:py,width:size,height:size,zIndex:z,"--ns":size+"px",touchAction:"none",pointerEvents:active?"none":"auto"}}
    transition={spring}
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onKeyDown={key}>
    <motion.div className="sn-f" animate={floating?{y:[0,-3,0]}:{y:0}}
      transition={floating?{duration:5+index%3,repeat:Infinity,ease:"easeInOut"}:{duration:.3}}>
      <motion.div className={"sn-p c-"+note.color}
        initial={reduced?false:hidden}
        animate={target}
        whileHover={reduced||lift||!pinned?undefined:{y:-4,rotate:note.rot*.55}}
        transition={reduced?spring:lift||placed.current?spring:{...enter,opacity:{duration:.4,delay:enter.delay}}}
        onAnimationComplete={()=>{if(pinned)placed.current=true}}>
        <Deco kind={note.deco}/>
        <p className="sn-q">{note.quote}</p>
        <p className="sn-n">{note.name}</p>
      </motion.div>
    </motion.div>
  </motion.div>;
}

export function Deco({kind=""}){
  const [a,b]=kind.split("-");
  return <>
    {kind.startsWith("tape")&&<i className="sn-tape" aria-hidden="true"/>}
    {(a==="pin"||b==="pin")&&<i className={"sn-pin p-"+(a==="pin"?b:"red")} aria-hidden="true"/>}
  </>;
}
