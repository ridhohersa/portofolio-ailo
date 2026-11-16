import {useEffect} from "react";
// Halaman admin tidak untuk mesin pencari.
export function useNoIndex(){
  useEffect(()=>{
    const m=document.createElement("meta");m.name="robots";m.content="noindex,nofollow";document.head.appendChild(m);
    return()=>m.remove();
  },[]);
}
