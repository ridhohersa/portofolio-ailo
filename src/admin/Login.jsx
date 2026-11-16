import {useEffect,useState} from "react";
import {Navigate,useLocation} from "react-router-dom";
import {useAuth} from "./AuthContext";
import Hl from "../components/Hl";
import {useNoIndex} from "./useNoIndex";

const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export default function Login(){
  const {status,configured,signIn,error:initial}=useAuth(),loc=useLocation();
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[busy,setBusy]=useState(false),[err,setErr]=useState("");
  useNoIndex();
  useEffect(()=>{if(initial)setErr(initial)},[initial]);
  if(status==="in")return <Navigate to={loc.state?.from||"/admin"} replace/>;
  const submit=async e=>{
    e.preventDefault();if(busy)return;
    if(!EMAIL.test(email.trim()))return setErr("Masukkan email yang valid.");
    if(!password)return setErr("Masukkan password.");
    setBusy(true);setErr("");
    try{await signIn(email.trim(),password)}
    catch(x){setErr(x.status===400||x.status===401?"Email atau password salah.":x.message||"Gagal masuk.");setBusy(false)}
  };
  return <main id="main" className="ad-login"><section className="s">
    <p className="label">Area pengelola</p>
    <h2><Hl>Admin</Hl></h2>
    {!configured?<div className="ad-note" role="alert">
      <strong>Backend belum dikonfigurasi, jadi login dinonaktifkan.</strong>
      <p>Login memakai Supabase Auth. Yang masih dibutuhkan:</p>
      <ol>
        <li>Isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> di file <code>.env</code>, lalu jalankan ulang <code>npm run dev</code>.</li>
        <li>Jalankan <code>supabase/testimonials.sql</code> dan <code>supabase/admin.sql</code> di SQL Editor Supabase.</li>
        <li>Buat satu user di Supabase → Authentication → Users, lalu jadikan admin dengan perintah di bagian akhir <code>supabase/admin.sql</code>.</li>
      </ol>
    </div>
    :<form className="ad-form" onSubmit={submit} noValidate>
      <div className="fg"><label htmlFor="ad-email">Email</label><input id="ad-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required disabled={busy}/></div>
      <div className="fg"><label htmlFor="ad-pass">Password</label><input id="ad-pass" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={busy}/></div>
      <p className="err" role="alert" aria-live="assertive">{err}</p>
      <button type="submit" className="btn pri" disabled={busy||status==="loading"}>{busy?"Memeriksa…":"Masuk"}</button>
    </form>}
  </section></main>;
}
