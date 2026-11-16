import {useCallback,useEffect,useState} from "react";

// Dua tema: "light" (Warm Paper) dan "dark". Pilihan manual disimpan di localStorage hanya saat pengunjung menekan tombol;
// tanpa pilihan, tema mengikuti sistem (dan ikut berubah bila sistem berubah). index.html memasang tema awal sebelum paint.
const KEY="ailo-theme";
const stored=()=>{try{const t=localStorage.getItem(KEY);return t==="dark"||t==="light"?t:null}catch{return null}};
const system=()=>typeof matchMedia==="function"&&matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";

export function useTheme(){
  const [pref,setPref]=useState(stored),[sys,setSys]=useState(system);
  const theme=pref||sys;
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
  useEffect(()=>{
    const mq=matchMedia("(prefers-color-scheme:dark)"),onSys=()=>setSys(system());
    const onStore=e=>{if(e.type==="ailo-theme"||e.key===KEY||e.key===null)setPref(stored())};   // tab lain, atau komponen lain di tab ini, mengganti tema
    mq.addEventListener("change",onSys);addEventListener("storage",onStore);addEventListener("ailo-theme",onStore);
    return()=>{mq.removeEventListener("change",onSys);removeEventListener("storage",onStore);removeEventListener("ailo-theme",onStore)};
  },[]);
  const toggle=useCallback(()=>{
    const next=theme==="dark"?"light":"dark";
    setPref(next);try{localStorage.setItem(KEY,next)}catch{}
    dispatchEvent(new Event("ailo-theme"));
  },[theme]);
  // mode: "light" | "dark" | "system" (system = hapus pilihan manual dan ikuti perangkat). Dipakai oleh Pengaturan Admin.
  const setMode=useCallback(m=>{
    if(m==="system"){setPref(null);try{localStorage.removeItem(KEY)}catch{}}
    else{setPref(m);try{localStorage.setItem(KEY,m)}catch{}}
    dispatchEvent(new Event("ailo-theme"));
  },[]);
  return {theme,toggle,pref,setMode};
}
