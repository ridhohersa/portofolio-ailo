import {createContext,useCallback,useContext,useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {AnimatePresence,motion} from "motion/react";
import Sheet from "./Sheet";

// ---- Toast ----------------------------------------------------------------------------------------------------------
const ToastCtx=createContext(()=>{});
export const useToast=()=>useContext(ToastCtx);

// ---- Konfirmasi (pengganti window.confirm) ----------------------------------------------------------------------------
const ConfirmCtx=createContext(()=>Promise.resolve(false));
export const useConfirm=()=>useContext(ConfirmCtx);

export function FeedbackProvider({children}){
  const [toasts,setToasts]=useState([]),[ask,setAsk]=useState(null),timers=useRef(new Map());
  const dismiss=useCallback(id=>{clearTimeout(timers.current.get(id));timers.current.delete(id);setToasts(t=>t.filter(x=>x.id!==id))},[]);
  const toast=useCallback((msg,type="ok")=>{
    const id=Math.random().toString(36).slice(2);
    setToasts(t=>[...t.slice(-3),{id,msg,type}]);
    timers.current.set(id,setTimeout(()=>dismiss(id),type==="err"?6000:3500));
  },[dismiss]);
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
  const confirm=useCallback(opts=>new Promise(res=>setAsk({...opts,res})),[]);
  const last=useRef({});if(ask)last.current=ask;const a=ask||last.current;   // isi dialog tetap terbaca selama animasi keluar
  const answer=v=>{ask?.res(v);setAsk(null)};
  return <ToastCtx.Provider value={toast}><ConfirmCtx.Provider value={confirm}>
    {children}
    {typeof document!=="undefined"&&createPortal(
      <div className="adm-toasts" role="status" aria-live="polite" aria-atomic="false">
        <AnimatePresence initial={false}>{toasts.map(t=><motion.div key={t.id} layout className={"adm-toast "+t.type}
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,x:30}} transition={{duration:.25,ease:[.2,.8,.2,1]}}>
          <span>{t.msg}</span><button type="button" aria-label="Tutup notifikasi" onClick={()=>dismiss(t.id)}>×</button>
        </motion.div>)}</AnimatePresence>
      </div>,document.body)}
    <Sheet open={!!ask} onClose={()=>answer(false)} title={a.title||"Konfirmasi"} side="center" small
      footer={<><button type="button" className="btn" onClick={()=>answer(false)}>Batal</button>
        <button type="button" className={"btn pri"+(a.danger===false?"":" danger")} onClick={()=>answer(true)}>{a.confirmLabel||"Ya, lanjutkan"}</button></>}>
      <p className="adm-p">{a.message}</p>
    </Sheet>
  </ConfirmCtx.Provider></ToastCtx.Provider>;
}
