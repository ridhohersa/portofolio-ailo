import {settings,useData} from "../data/api";
import {useAuth} from "../auth";
import {useToast} from "../ui/Feedback";
import {PageHeader} from "../ui/Bits";
import {useTheme} from "../../theme";

export const APP_VERSION="0.2.0";
const MODES=[["light","Terang","Warm Paper"],["dark","Gelap","Ink"],["system","Ikuti sistem","Otomatis"]];
const Sec=({title,desc,children})=><section className="adm-sec"><div><h2>{title}</h2>{desc&&<p className="adm-desc">{desc}</p>}</div><div>{children}</div></section>;

export default function SettingsPage(){
  const {prefs}=useData(settings),toast=useToast(),{pref,setMode}=useTheme(),{session}=useAuth(),user=session?.user||{};
  const mode=pref||"system";
  const setPref=(k,val,msg)=>{settings.save({prefs:{...prefs,[k]:val}},"mengubah preferensi dashboard");toast(msg)};
  return <>
    <PageHeader kicker="Konfigurasi" title="Settings" desc="Akun yang sedang masuk, tampilan, dan preferensi dashboard. Tema dan preferensi hanya tersimpan di browser ini."/>
    <Sec title="Akun admin" desc="Akun yang sedang masuk (dari server)."><dl className="adm-dl"><div><dt className="label">Nama</dt><dd>{user.name||"—"}</dd></div><div><dt className="label">Email</dt><dd>{user.email||"—"}</dd></div><div><dt className="label">Peran</dt><dd>{user.role||"—"}</dd></div></dl></Sec>
    <Sec title="Tema tampilan" desc="Berlaku juga untuk website. Pilihan disimpan di browser.">
      <div className="adm-radios" role="radiogroup" aria-label="Tema">{MODES.map(([id,l,s])=><label key={id} className={"adm-radio"+(mode===id?" on":"")}>
        <input type="radio" name="theme" value={id} checked={mode===id} onChange={()=>{setMode(id);toast("Tema: "+l+".")}}/><strong>{l}</strong><span className="label">{s}</span></label>)}</div>
    </Sec>
    <Sec title="Preferensi dashboard">
      <div className="adm-checks">
        <div className="adm-check"><label><input type="checkbox" checked={prefs.showActivity} onChange={e=>setPref("showActivity",e.target.checked,"Preferensi disimpan.")}/> Tampilkan Recent Activity di Dashboard</label></div>
        <div className="adm-check"><label><input type="checkbox" checked={prefs.compactTables} onChange={e=>setPref("compactTables",e.target.checked,"Preferensi disimpan.")}/> Tabel dan daftar lebih rapat (compact)</label></div>
        <div className="adm-field half"><label htmlFor="pv">Tampilan awal halaman Projects</label>
          <select id="pv" value={prefs.projectsView} onChange={e=>setPref("projectsView",e.target.value,"Preferensi disimpan.")}><option value="table">Tabel</option><option value="grid">Grid</option></select></div>
      </div>
    </Sec>
    <Sec title="Informasi aplikasi">
      <dl className="adm-dl"><div><dt className="label">Versi</dt><dd>{APP_VERSION}</dd></div><div><dt className="label">Mode</dt><dd>{import.meta.env?.MODE||"development"}</dd></div>
        <div><dt className="label">Penyimpanan konten</dt><dd>Database MySQL lewat API Laravel</dd></div><div><dt className="label">Autentikasi</dt><dd>Token Sanctum, hanya peran admin</dd></div></dl>
    </Sec>
  </>;
}
