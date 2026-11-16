import {createContext,useCallback,useContext,useEffect,useMemo,useState} from "react";
import {CONFIGURED,isAdmin,signIn as apiSignIn,signOut as apiSignOut,verifySession} from "../lib/supabase";

const Ctx=createContext(null);
export const useAuth=()=>useContext(Ctx);

// status: "loading" | "out" | "in". "in" berarti sesi valid DAN akun bertanda admin (app_metadata.role = "admin").
// Ini hanya untuk tampilan; yang melindungi data adalah RLS di database.
export function AuthProvider({children}){
  const [state,set]=useState({status:CONFIGURED?"loading":"out",user:null,error:null});
  useEffect(()=>{
    if(!CONFIGURED)return;
    let live=true;
    verifySession().then(async s=>{
      if(!live)return;
      if(!s)return set({status:"out",user:null,error:null});
      if(!isAdmin(s.user)){await apiSignOut();return set({status:"out",user:null,error:"Akun ini bukan admin."})}
      set({status:"in",user:s.user,error:null});
    }).catch(()=>live&&set({status:"out",user:null,error:"Tidak bisa memeriksa sesi. Periksa koneksi lalu muat ulang."}));
    return()=>{live=false};
  },[]);
  const signIn=useCallback(async(email,password)=>{
    const s=await apiSignIn(email,password);
    if(!isAdmin(s.user)){await apiSignOut();set({status:"out",user:null,error:null});throw new Error("Akun ini bukan admin.")}
    set({status:"in",user:s.user,error:null});
  },[]);
  const signOut=useCallback(async()=>{await apiSignOut();set({status:"out",user:null,error:null})},[]);
  const value=useMemo(()=>({...state,configured:CONFIGURED,signIn,signOut}),[state,signIn,signOut]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
