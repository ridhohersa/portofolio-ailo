import {useMemo,useState} from "react";
import {contact,useData} from "../data/api";
import {useToast} from "../ui/Feedback";
import {PageHeader,Btn,IconBtn} from "../ui/Bits";
import {EMAIL_RE} from "../ui/fields";

const uid=()=>"so"+Math.random().toString(36).slice(2,7);
const HTTPS=/^https:\/\/[^\s]+\.[^\s]+$/i;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export default function ContactPage(){
  const saved=useData(contact),toast=useToast();
  const [v,setV]=useState(()=>({email:saved.email,location:saved.location,socials:saved.socials.map(s=>({...s}))})),[err,setErr]=useState({});
  const dirty=useMemo(()=>!same(v,{email:saved.email,location:saved.location,socials:saved.socials}),[v,saved]);
  const setS=(id,k,x)=>setV(s=>({...s,socials:s.socials.map(o=>o.id===id?{...o,[k]:x}:o)}));
  const save=e=>{
    e.preventDefault();const er={};
    if(!EMAIL_RE.test(v.email.trim()))er.email="Masukkan email yang valid.";
    if(v.location.length>80)er.location="Lokasi maksimal 80 karakter.";
    v.socials.forEach(s=>{
      if(!s.label.trim())er["l"+s.id]="Nama wajib diisi.";
      if(!HTTPS.test(s.url.trim()))er["u"+s.id]="Gunakan tautan lengkap yang diawali https://";
    });
    setErr(er);if(Object.keys(er).length){toast("Periksa kolom yang ditandai.","err");return}
    const r=contact.save({email:v.email.trim(),location:v.location.trim(),socials:v.socials.map(s=>({...s,label:s.label.trim(),url:s.url.trim()}))},"memperbarui informasi kontak");
    toast(r.ok?"Informasi kontak disimpan.":"Data tidak ditemukan. Muat ulang halaman.",r.ok?"ok":"err");
  };
  const undo=()=>{setV({email:saved.email,location:saved.location,socials:saved.socials.map(s=>({...s}))});setErr({})};
  return <>
    <PageHeader kicker="Konten" title="Contact" desc="Ubah email, lokasi umum, dan tautan sosial media. Pratinjau di kanan langsung mengikuti isian Anda. Tautan kontak di website publik membaca dari sini."/>
    <div className="adm-split">
      <form className="adm-form" onSubmit={save} noValidate>
        <div className={"adm-field"+(err.email?" bad":"")}><label htmlFor="c-mail">Email <span className="adm-req">*</span></label><input id="c-mail" type="email" value={v.email} onChange={e=>setV(s=>({...s,email:e.target.value}))}/>{err.email&&<p className="adm-err" role="alert">{err.email}</p>}</div>
        <div className={"adm-field"+(err.location?" bad":"")}><label htmlFor="c-loc">Lokasi umum</label><input id="c-loc" value={v.location} onChange={e=>setV(s=>({...s,location:e.target.value}))} placeholder="Kota, negara"/><p className="adm-hint">Cukup kota atau wilayah, bukan alamat lengkap.</p>{err.location&&<p className="adm-err" role="alert">{err.location}</p>}</div>
        <fieldset className="adm-fieldset"><legend>Tautan sosial media</legend>
          {v.socials.map(s=><div className="adm-kv" key={s.id}>
            <div className={"adm-field"+(err["l"+s.id]?" bad":"")}><input aria-label={"Nama platform"} value={s.label} placeholder="Nama (mis. GitHub)" onChange={e=>setS(s.id,"label",e.target.value)}/>{err["l"+s.id]&&<p className="adm-err" role="alert">{err["l"+s.id]}</p>}</div>
            <div className={"adm-field"+(err["u"+s.id]?" bad":"")}><input aria-label={"Tautan "+(s.label||"platform")} value={s.url} placeholder="https://…" onChange={e=>setS(s.id,"url",e.target.value)}/>{err["u"+s.id]&&<p className="adm-err" role="alert">{err["u"+s.id]}</p>}</div>
            <IconBtn icon="trash" label={"Hapus "+(s.label||"tautan")} className="danger" onClick={()=>setV(x=>({...x,socials:x.socials.filter(o=>o.id!==s.id)}))}/></div>)}
          {!v.socials.length&&<p className="label">Belum ada tautan sosial media.</p>}
          <Btn icon="plus" onClick={()=>setV(x=>({...x,socials:[...x.socials,{id:uid(),label:"",url:""}]}))}>Tambah tautan</Btn>
        </fieldset>
        <div className="adm-form-a"><button type="button" className="btn" onClick={undo} disabled={!dirty}>Batalkan perubahan</button><button className="btn pri" type="submit" disabled={!dirty}>Simpan</button></div>
        {dirty&&<p className="label" role="status">Ada perubahan yang belum disimpan.</p>}
      </form>
      <aside className="adm-preview" aria-label="Pratinjau"><p className="label">Pratinjau (belum disimpan bila ada perubahan)</p>
        <div className="adm-pv"><h3 className="adm-pv-h">Contact</h3>{v.location&&<p className="label">{v.location}</p>}
          <ul className="adm-links">{v.email&&<li><span>Email</span><span className="label">{v.email}</span></li>}{v.socials.filter(s=>s.label).map(s=><li key={s.id}><span>{s.label}</span><span className="label">{s.url.replace(/^https?:\/\//,"")}</span></li>)}</ul></div></aside>
    </div>
  </>;
}
