import {Navigate,NavLink,Outlet,useLocation} from "react-router-dom";
import {useAuth} from "./AuthContext";
import {useNoIndex} from "./useNoIndex";
import Hl from "../components/Hl";

// Menu dashboard. `ready` = sudah berfungsi penuh; sisanya baru kerangka (lihat Planned.jsx).
export const SECTIONS=[
  {to:"testimonials",label:"Testimonials",ready:true},
  {to:"about",label:"About"},
  {to:"skills",label:"Skills"},
  {to:"projects",label:"Projects"},
  {to:"blog",label:"Blog"},
  {to:"contact",label:"Contact"},
  {to:"settings",label:"Pengaturan"},
];

// Pelindung rute. Hanya mengatur tampilan: data tetap dijaga RLS di database, sehingga tanpa sesi admin yang sah query tidak mengembalikan apa pun.
export function RequireAdmin({children}){
  const {status}=useAuth(),loc=useLocation();
  if(status==="loading")return <main id="main"><section className="s"><p className="label" role="status">Memeriksa sesi…</p></section></main>;
  if(status!=="in")return <Navigate to="/admin/login" replace state={{from:loc.pathname}}/>;
  return children;
}

export default function Dashboard(){
  const {user,signOut}=useAuth();
  useNoIndex();
  return <main id="main" className="ad"><section className="s">
    <div className="ad-top">
      <div><p className="label">Dashboard</p><h2><Hl>Admin</Hl></h2></div>
      <div className="ad-user"><span className="label" title={user?.email}>{user?.email}</span><button type="button" className="btn" onClick={signOut}>Keluar</button></div>
    </div>
    <div className="ad-grid">
      <nav className="ad-side" aria-label="Menu dashboard">
        {SECTIONS.map(s=><NavLink key={s.to} to={s.to} className={({isActive})=>"ad-link"+(isActive?" on":"")}>{s.label}{!s.ready&&<small>segera</small>}</NavLink>)}
      </nav>
      <div className="ad-main"><Outlet/></div>
    </div>
  </section></main>;
}
export const AdminIndex=()=><Navigate to="/admin/testimonials" replace/>;
