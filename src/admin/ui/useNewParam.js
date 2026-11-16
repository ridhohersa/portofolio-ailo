import {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
// Tautan cepat dari Dashboard (…/projects?new=1) membuka form tambah sekali, lalu parameternya dibersihkan dari URL.
export default function useNewParam(open){
  const [sp,setSp]=useSearchParams();
  useEffect(()=>{
    if(!sp.get("new"))return;
    open();const n=new URLSearchParams(sp);n.delete("new");setSp(n,{replace:true});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
}
export const fmtDate=d=>{try{return new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}catch{return""}};
export const fmtTime=d=>{try{return new Date(d).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}catch{return""}};
