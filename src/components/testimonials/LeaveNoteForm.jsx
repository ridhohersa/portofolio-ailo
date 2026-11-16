import {useCallback,useEffect,useId,useRef,useState} from "react";
import {AnimatePresence,motion} from "motion/react";
import {RELATIONSHIPS,IS_MOCK,validate,submitNote} from "./submitNote";

const EMPTY={name:"",email:"",relationship:"",content:"",extra:{}};
const ROT=3;
const FOCUSABLE='.ln-fix input:not([tabindex="-1"]),.ln-fix textarea,.ln-fix button:not(:disabled)';

// Focus Mode for the blank note: the same paper (layoutId "leave-note") grows into a bigger sticky note with the form written on it.
// Rendered in a portal and kept mounted, so drafts survive closing and AnimatePresence can run exit animations.
export default function LeaveNoteForm({open,reduced,onClose}){
  const uid=useId().replace(/:/g,""),id=k=>`ln-${uid}-${k}`;
  const [v,setV]=useState(EMPTY);
  const [errors,setErrors]=useState({});
  const [phase,setPhase]=useState("idle");            // idle | sending | sent
  const [failure,setFailure]=useState("");
  const [mock,setMock]=useState(IS_MOCK);
  const busy=useRef(false),openedAt=useRef(0),hp=useRef(""),from=useRef(null),wantFocus=useRef(false);
  const nameRef=useRef(null),rootRef=useRef(null);
  const sending=phase==="sending",sent=phase==="sent";
  const rel=RELATIONSHIPS.find(r=>r.id===v.relationship);

  const close=useCallback(()=>{if(!busy.current)onClose()},[onClose]);

  // keyboard (Escape, Tab loop), body scroll lock, focus in and back out
  useEffect(()=>{
    if(!open)return;
    openedAt.current=Date.now();from.current=document.activeElement;
    const k=e=>{
      if(e.key==="Escape"){e.preventDefault();close()}
      else if(e.key==="Tab"){
        const f=[...document.querySelectorAll(FOCUSABLE)];if(!f.length)return;
        const a=f.indexOf(document.activeElement);
        if(e.shiftKey&&a<=0){e.preventDefault();f[f.length-1].focus()}
        else if(!e.shiftKey&&(a===f.length-1||a<0)){e.preventDefault();f[0].focus()}
      }
    };
    const b=document.body,bw=innerWidth-document.documentElement.clientWidth,prev=[b.style.overflow,b.style.paddingRight];
    b.style.overflow="hidden";if(bw>0)b.style.paddingRight=bw+"px";
    addEventListener("keydown",k);
    const t=setTimeout(()=>nameRef.current?.focus({preventScroll:true}),reduced?0:260);
    return()=>{clearTimeout(t);removeEventListener("keydown",k);b.style.overflow=prev[0];b.style.paddingRight=prev[1];from.current?.focus?.({preventScroll:true})};
  },[open,close,reduced]);

  // after a sent note: pin lands, message shows, then the paper flies back to the board and Focus Mode closes
  useEffect(()=>{
    if(!sent)return;
    const t=setTimeout(()=>{onClose();setTimeout(()=>{setPhase("idle");setV(EMPTY)},400)},reduced?1400:2300);
    return()=>clearTimeout(t);
  },[sent,reduced,onClose]);

  // after a failed validation, move focus to the first invalid field
  useEffect(()=>{
    if(!wantFocus.current)return;wantFocus.current=false;
    rootRef.current?.querySelector('[aria-invalid="true"]')?.focus({preventScroll:false});
  },[errors]);

  const set=(k,x)=>{setV(s=>({...s,[k]:x}));if(errors[k])setErrors(e=>{const n={...e};delete n[k];return n})};
  const setExtra=(c,x)=>{setV(s=>({...s,extra:{...s.extra,[c]:x}}));if(errors["x:"+c])setErrors(e=>{const n={...e};delete n["x:"+c];return n})};
  const pick=r=>{setV(s=>({...s,relationship:r,extra:{}}));setErrors(e=>{const n={...e};delete n.relationship;Object.keys(n).forEach(k=>k.startsWith("x:")&&delete n[k]);return n})};

  const submit=async ev=>{
    ev.preventDefault();
    if(busy.current)return;                                  // no double sends
    const errs=validate(v);setFailure("");
    if(Object.keys(errs).length){wantFocus.current=true;setErrors(errs);setFailure("A few things need a look. They're marked below.");return}
    busy.current=true;setErrors({});setPhase("sending");
    const r=await submitNote(v,{honeypot:hp.current,openedAt:openedAt.current});
    if(r.ok){busy.current=false;setMock(!!r.mock);setPhase("sent");return}
    busy.current=false;setPhase("idle");setFailure(r.error||"Something went wrong.");  // the draft is kept as is
    if(r.errors){wantFocus.current=true;setErrors(r.errors)}
  };

  const t=reduced?{duration:0}:{type:"spring",stiffness:260,damping:30};
  const fade={initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:reduced?0:.25}};
  const Err=({k})=>errors[k]?<span className="ln-err" id={id("e-"+k.replace(":","-"))}>{errors[k]}</span>:null;
  const bad=k=>errors[k]?{"aria-invalid":true,"aria-describedby":id("e-"+k.replace(":","-"))}:{};
  const left=600-v.content.length;

  return <div className="tf-fix ln-fix" ref={rootRef} aria-hidden={!open}>
    <AnimatePresence>
      {open&&<motion.div key="bd" className="tf-bd" {...fade} onClick={close}/>}
      {open&&<motion.div key="paper" className="tf-o ln-o" role="dialog" aria-modal="true" aria-labelledby={id("title")} layoutId="leave-note" transition={t}>
        <motion.div className="tf-p c-yellow ln-p" initial={reduced?false:{rotate:ROT}} animate={{rotate:sent&&!reduced?-1.5:0}} transition={t}>
          <motion.i key={phase==="sent"?"pin-s":"pin"} className="sn-pin p-red" aria-hidden="true"
            initial={sent&&!reduced?{y:-90,scale:2,opacity:0}:false} animate={{y:0,scale:1,opacity:1}}
            transition={{type:"spring",stiffness:380,damping:16,delay:sent?.1:0}}/>
          <motion.div className="ln-sc" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:reduced?0:.2,duration:reduced?0:.3}}>
            {sent?<motion.div className="ln-done" initial={reduced?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:reduced?0:.25}}>
              <p className="ln-done-t" role="status">Your note has been sent!</p>
              <p className="ln-done-s">{mock?"Demo mode: this note was not saved anywhere yet.":"It will show up on the board once Ridho has approved it."}</p>
              <p className="ln-done-s">Thank you for taking the time.</p>
            </motion.div>
            :<form onSubmit={submit} noValidate aria-busy={sending}>
              <h2 className="ln-h" id={id("title")}>Leave a little note.</h2>
              <p className="ln-d">Got something to share? I'd love to hear it.</p>

              <div className="ln-f">
                <label htmlFor={id("name")}>Full name <b aria-hidden="true">*</b><span className="ln-sr"> (required)</span></label>
                <input ref={nameRef} id={id("name")} name="name" value={v.name} onChange={e=>set("name",e.target.value)} maxLength={80} autoComplete="name" required aria-required="true" readOnly={sending} {...bad("name")}/>
                <Err k="name"/>
              </div>

              <fieldset className="ln-f ln-rel" aria-describedby={errors.relationship?id("e-relationship"):undefined}>
                <legend>How do you know Ridho? <b aria-hidden="true">*</b><span className="ln-sr"> (required)</span></legend>
                <div className="ln-chips">
                  {RELATIONSHIPS.map(r=><label key={r.id} className="ln-chip">
                    <input type="radio" name={id("rel")} className="ln-sr" value={r.id} checked={v.relationship===r.id} onChange={()=>pick(r.id)} aria-invalid={errors.relationship?true:undefined}/>
                    <span>{r.label}</span>
                  </label>)}
                </div>
                <Err k="relationship"/>
              </fieldset>

              <AnimatePresence mode="wait" initial={false}>
                {rel&&<motion.div key={rel.id} className="ln-x" initial={reduced?false:{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={reduced?{opacity:0}:{opacity:0,height:0}} transition={{duration:reduced?0:.22}}>
                  {rel.fields.map(f=>{const k="x:"+f.column;return <div className="ln-f" key={f.column}>
                    <label htmlFor={id(f.column)}>{f.label} {f.req?<><b aria-hidden="true">*</b><span className="ln-sr"> (required)</span></>:<em>({f.hint})</em>}</label>
                    <input id={id(f.column)} value={v.extra[f.column]||""} onChange={e=>setExtra(f.column,e.target.value)} maxLength={f.column==="relationship_detail"?160:100}
                      autoComplete={f.autoComplete||"off"} placeholder={f.placeholder} required={!!f.req} aria-required={f.req||undefined} readOnly={sending} {...bad(k)}/>
                    <Err k={k}/>
                  </div>})}
                </motion.div>}
              </AnimatePresence>

              <div className="ln-f">
                <label htmlFor={id("email")}>Email <em>(optional, never shown)</em></label>
                <input id={id("email")} type="email" inputMode="email" name="email" value={v.email} onChange={e=>set("email",e.target.value)} maxLength={120} autoComplete="email" readOnly={sending} {...bad("email")}/>
                <Err k="email"/>
              </div>

              <div className="ln-f">
                <label htmlFor={id("content")}>Your note <b aria-hidden="true">*</b><span className="ln-sr"> (required)</span></label>
                <textarea id={id("content")} name="content" rows={4} value={v.content} onChange={e=>set("content",e.target.value)} maxLength={600} required aria-required="true" readOnly={sending}
                  {...bad("content")} aria-describedby={[errors.content&&id("e-content"),id("count")].filter(Boolean).join(" ")}/>
                <span className="ln-count" id={id("count")}>{left<=80?`${left} characters left`:`${v.content.length} / 600`}</span>
                <Err k="content"/>
              </div>

              <input className="ln-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" onChange={e=>{hp.current=e.target.value}} defaultValue=""/>

              {failure&&<p className="ln-fail" role="alert">{failure}</p>}
              <div className="ln-act">
                <button type="submit" className="ln-send" disabled={sending} aria-busy={sending}>{sending?"Pinning…":"Pin my note"}</button>
                {mock&&<span className="ln-mock">Demo mode: nothing is saved yet.</span>}
              </div>
              <p className="ln-fine">Notes appear on the board after Ridho approves them.</p>
            </form>}
          </motion.div>
        </motion.div>
      </motion.div>}
      {open&&<motion.button key="x" type="button" className="tf-btn tf-x" {...fade} onClick={close} disabled={sending} aria-label="Close the note form">Close ✕</motion.button>}
    </AnimatePresence>
  </div>;
}
