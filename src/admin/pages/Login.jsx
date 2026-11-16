import {useState} from "react";
import {Link,Navigate,useLocation,useNavigate} from "react-router-dom";
import {motion} from "motion/react";
import {useAuth} from "../auth";
import {CONFIGURED} from "../../lib/api";
import {EMAIL_RE} from "../ui/fields";
import {useNoIndex} from "../useNoIndex";
import Hl from "../../components/Hl";

export default function Login(){
  const {session,login}=useAuth(),loc=useLocation(),nav=useNavigate();
  const [email,setEmail]=useState(""),[pw,setPw]=useState(""),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  useNoIndex();
  const to=loc.state?.from||"/admin";
  if(session)return <Navigate to={to} replace/>;
  const submit=async e=>{
    e.preventDefault();if(busy)return;
    if(!EMAIL_RE.test(email.trim()))return setErr("Masukkan email yang valid.");
    if(!pw)return setErr("Masukkan password.");
    setErr("");setBusy(true);
    try{await login(email,pw);nav(to,{replace:true})}
    catch(x){
      setBusy(false);
      setErr(x.status===429?"Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.":x.status===0?x.message:x.status===422?"Email atau password salah.":x.message||"Tidak bisa masuk.");
    }
  };
  return <main id="main" className="adm-login">
    <motion.section className="adm-login-card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:[.2,.8,.2,1]}}>
      <p className="label">Area pengelola</p>
      <h1><Hl>Admin</Hl></h1>
      {!CONFIGURED&&<div className="adm-note" role="note"><strong>Backend belum dikonfigurasi.</strong><p>Isi <code>VITE_API_URL</code> di <code>.env</code> (lihat <code>.env.example</code>), lalu jalankan ulang aplikasi.</p></div>}
      <form className="adm-form" onSubmit={submit} noValidate>
        <div className="adm-field"><label htmlFor="l-email">Email</label><input id="l-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/></div>
        <div className="adm-field"><label htmlFor="l-pw">Password</label><input id="l-pw" type="password" autoComplete="current-password" value={pw} onChange={e=>setPw(e.target.value)} disabled={busy}/></div>
        <p className="adm-err" role="alert" aria-live="assertive">{err}</p>
        <button className="btn pri" type="submit" disabled={busy||!CONFIGURED}>{busy?"Memeriksa…":"Masuk"}</button>
      </form>
      <p className="adm-login-back"><Link to="/">← Kembali ke website</Link></p>
    </motion.section>
  </main>;
}
