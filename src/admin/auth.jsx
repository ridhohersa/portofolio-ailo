import {createContext,useCallback,useContext,useEffect,useMemo,useState} from "react";
import {Navigate,useLocation} from "react-router-dom";
import {readSession,signIn,signOut,verifySession,UNAUTHORIZED_EVENT} from "../lib/api";
import {resetStore} from "./data/api";

// Autentikasi sungguhan lewat API Laravel (token Sanctum + role admin). Token disimpan di localStorage browser ini dan SELALU
// diverifikasi ke server saat panel dibuka; hak akses sebenarnya ditegakkan server pada setiap permintaan, bukan oleh kode ini.
const Ctx=createContext(null);
export const useAuth=()=>useContext(Ctx);

export function AuthProvider({children}){
  const [session,setSession]=useState(readSession);
  const [checking,setChecking]=useState(()=>!!readSession());
  useEffect(()=>{
    if(!readSession()){setChecking(false);return}
    let live=true;
    // Token ditolak -> verifySession mengembalikan null dan sesi dihapus. Galat jaringan: sesi dipertahankan; data akan gagal dimuat dan bisa dicoba lagi.
    verifySession().then(s=>{if(live){setSession(s);setChecking(false)}}).catch(()=>{if(live)setChecking(false)});
    return()=>{live=false};
  },[]);
  // Server menjawab 401 di tengah pemakaian (token kedaluwarsa/dicabut): keluarkan pengguna.
  useEffect(()=>{
    const f=()=>{resetStore();setSession(null)};
    addEventListener(UNAUTHORIZED_EVENT,f);return()=>removeEventListener(UNAUTHORIZED_EVENT,f);
  },[]);
  const login=useCallback(async(email,password)=>{const s=await signIn(email.trim(),password);setSession(s);return s},[]);
  const logout=useCallback(async()=>{await signOut();resetStore();setSession(null)},[]);
  const value=useMemo(()=>({session,checking,login,logout}),[session,checking,login,logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Pelindung rute di sisi frontend (hanya navigasi; data tetap dilindungi server).
export function RequireAdmin({children}){
  const {session,checking}=useAuth(),loc=useLocation();
  if(checking)return <p role="status" style={{padding:"4rem 1.5rem",textAlign:"center"}}>Memeriksa sesi…</p>;
  if(!session)return <Navigate to="/admin/login" replace state={{from:loc.pathname+loc.search}}/>;
  return children;
}
