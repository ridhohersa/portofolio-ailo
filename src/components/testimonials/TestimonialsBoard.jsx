import {useInView} from "motion/react";
import {useCallback,useEffect,useLayoutEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import StickyNote from "./StickyNote";
import TestimonialFocus from "./TestimonialFocus";
import LeaveNoteTrigger from "./LeaveNoteTrigger";
import LeaveNoteForm from "./LeaveNoteForm";
import useReduced from "./useReduced";

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

// The corkboard: owns the board size, stacking order and which note is open. Notes are drawn only once the board is measured.
export default function TestimonialsBoard({items}){
  const ref=useRef(null),reduced=useReduced();
  const entered=useInView(ref,{once:true,amount:"some"});   // notes are pinned up once, the first time the board scrolls into view
  const [bd,setBd]=useState({w:0,h:0});
  const [order,setOrder]=useState([]);                 // last id = on top
  const [focus,setFocus]=useState(null);               // {open: id the focus started from, id: note on screen}
  const [dir,setDir]=useState(0);
  const [leave,setLeave]=useState(false);              // "Leave a note" form open

  useLayoutEffect(()=>{
    const el=ref.current;if(!el)return;
    const m=()=>setBd({w:el.clientWidth,h:el.clientHeight});
    m();const ro=new ResizeObserver(m);ro.observe(el);return()=>ro.disconnect();
  },[]);

  const rank=id=>{const k=order.indexOf(id);return k<0?0:k+1};
  const raise=useCallback(id=>setOrder(o=>[...o.filter(x=>x!==id),id]),[]);
  const base=clamp(Math.round(bd.w*.135),120,172);      // 150-190px on desktop once each note's own scale is applied
  const open=useCallback(id=>{setDir(0);setFocus({open:id,id})},[]);
  const close=useCallback(()=>{setDir(0);setFocus(null)},[]);
  const openLeave=useCallback(()=>setLeave(true),[]),closeLeave=useCallback(()=>setLeave(false),[]);
  const ls=Math.round(base*.97),compact=bd.w<560;      // the blank note sits in the board's bottom corner (right on desktop, left on phones)
  const go=useCallback(d=>{
    setFocus(f=>{
      if(!f||items.length<2)return f;
      const i=items.findIndex(n=>n.id===f.id);
      return {...f,id:items[(i+d+items.length)%items.length].id};
    });
    setDir(d);
  },[items]);

  // the list can change while Focus Mode is open (testimonials added/removed): close if the note is gone
  const gone=focus&&!items.some(n=>n.id===focus.id);
  useEffect(()=>{if(gone)close()},[gone,close]);

  return <>
    <div className="cb-frame">
      <div className="cb" ref={ref} role="group" aria-label="Papan sticky notes testimoni">
        {bd.w>0&&<LeaveNoteTrigger size={ls} left={compact?10:bd.w-ls-18} top={bd.h-ls-(compact?12:18)} z={0} reduced={reduced} active={leave} onOpen={openLeave}/>}
        {bd.w>0&&items.map((n,i)=><StickyNote key={n.id} note={n} index={i} size={Math.round(base*n.scale)} board={bd} z={rank(n.id)}
          reduced={reduced} entered={entered} active={focus?.id===n.id} onRaise={raise} onOpen={open}/>)}
      </div>
    </div>
    {typeof document!=="undefined"&&createPortal(
      <TestimonialFocus items={items} focus={focus&&!gone?focus:null} dir={dir} reduced={reduced} onClose={close} onGo={go}/>,document.body)}
    {typeof document!=="undefined"&&createPortal(<LeaveNoteForm open={leave} reduced={reduced} onClose={closeLeave}/>,document.body)}
  </>;
}
