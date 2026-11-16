import {useCallback,useEffect,useMemo,useState} from "react";
import {adminTestimonials} from "../lib/supabase";
import {RELATIONSHIPS} from "../components/testimonials/submitNote";

const STATUS={pending:"Pending",approved:"Approved",rejected:"Rejected"};
const FILTERS=[["all","Semua"],["pending","Pending"],["approved","Approved"],["rejected","Rejected"]];
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const relLabel=id=>RELATIONSHIPS.find(r=>r.id===id)?.label||id;
const when=d=>d?new Date(d).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"";
const EXTRA=[["organization","Organisasi / perusahaan"],["role","Peran / jabatan"],["school_name","Sekolah"],["project_name","Proyek"],["relationship_detail","Keterangan hubungan"]];

function Badge({s}){return <span className={"ad-badge "+s}>{STATUS[s]||s}</span>}

function EditForm({item,onSave,onCancel,busy}){
  const [v,setV]=useState(()=>({name:item.name||"",email:item.email||"",relationship:item.relationship||"other",content:item.content||"",
    ...Object.fromEntries(EXTRA.map(([k])=>[k,item[k]||""]))}));
  const [err,setErr]=useState({});
  const set=k=>e=>setV(x=>({...x,[k]:e.target.value}));
  const submit=e=>{
    e.preventDefault();const er={},name=v.name.trim(),content=v.content.trim(),email=v.email.trim();
    if(name.length<2||name.length>80)er.name="Nama 2–80 karakter.";
    if(content.length<20||content.length>600)er.content="Isi 20–600 karakter ("+content.length+").";
    if(email&&(!EMAIL.test(email)||email.length>120))er.email="Email tidak valid.";
    setErr(er);if(Object.keys(er).length)return;
    onSave({name,email:email||null,relationship:v.relationship,content,...Object.fromEntries(EXTRA.map(([k])=>[k,v[k].trim()||null]))});
  };
  return <form className="ad-edit" onSubmit={submit} noValidate>
    <div className="fg"><label htmlFor="e-name">Nama</label><input id="e-name" value={v.name} onChange={set("name")} maxLength={80}/><span className="err">{err.name}</span></div>
    <div className="fg"><label htmlFor="e-mail">Email (privat, tidak tampil di publik)</label><input id="e-mail" type="email" value={v.email} onChange={set("email")} maxLength={120}/><span className="err">{err.email}</span></div>
    <div className="fg"><label htmlFor="e-rel">Hubungan</label><select id="e-rel" value={v.relationship} onChange={set("relationship")}>{RELATIONSHIPS.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></div>
    {EXTRA.map(([k,l])=><div className="fg" key={k}><label htmlFor={"e-"+k}>{l}</label><input id={"e-"+k} value={v[k]} onChange={set(k)} maxLength={160}/></div>)}
    <div className="fg"><label htmlFor="e-c">Isi testimoni</label><textarea id="e-c" rows={6} value={v.content} onChange={set("content")} maxLength={600}/><span className="err">{err.content}</span></div>
    <div className="ad-acts"><button className="btn pri" type="submit" disabled={busy}>{busy?"Menyimpan…":"Simpan"}</button><button className="btn" type="button" onClick={onCancel} disabled={busy}>Batal</button></div>
  </form>;
}

// Pengelolaan Testimonials: baca isi + info pengirim, setujui / tolak / kembalikan ke Pending, ubah, hapus.
// Hanya status "approved" yang dibaca oleh halaman publik (kebijakan RLS "public reads approved").
export default function TestimonialsAdmin(){
  const [items,setItems]=useState(null),[error,setError]=useState(""),[filter,setFilter]=useState("pending"),[q,setQ]=useState("");
  const [sel,setSel]=useState(null),[mode,setMode]=useState("view"),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
  const load=useCallback(async()=>{setError("");try{setItems(await adminTestimonials.list())}catch(e){setItems([]);setError(e.message)}},[]);
  useEffect(()=>{load()},[load]);

  const counts=useMemo(()=>{const c={all:items?.length||0,pending:0,approved:0,rejected:0};items?.forEach(t=>{if(c[t.status]!=null)c[t.status]++});return c},[items]);
  const list=useMemo(()=>{
    const k=q.trim().toLowerCase();
    return (items||[]).filter(t=>(filter==="all"||t.status===filter)&&(!k||[t.name,t.email,t.content,t.organization,t.school_name,t.project_name].join(" ").toLowerCase().includes(k)));
  },[items,filter,q]);
  const cur=items?.find(t=>t.id===sel)||null;
  useEffect(()=>{if(sel&&!cur)setSel(null)},[sel,cur]);

  const run=async(fn,ok)=>{
    setBusy(true);setError("");setNotice("");
    try{await fn();setNotice(ok)}catch(e){setError(e.message)}finally{setBusy(false)}
  };
  const patch=(id,p,ok)=>run(async()=>{const row=await adminTestimonials.update(id,p);setItems(a=>a.map(t=>t.id===id?row:t));setMode("view")},ok);
  const del=id=>run(async()=>{await adminTestimonials.remove(id);setItems(a=>a.filter(t=>t.id!==id));setSel(null);setMode("view")},"Testimoni dihapus.");

  return <div className="ad-t">
    <h3>Testimonials</h3>
    <p className="ad-lead">Hanya testimoni berstatus <strong>Approved</strong> yang tampil di halaman publik. Pengirim baru selalu masuk sebagai <strong>Pending</strong>.</p>
    <div className="ad-bar">
      <div role="group" aria-label="Filter status" className="ad-filters">{FILTERS.map(([id,l])=><button key={id} type="button" className="chip" aria-pressed={filter===id} onClick={()=>setFilter(id)}>{l} <em>{counts[id]}</em></button>)}</div>
      <input type="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama, isi, atau organisasi" aria-label="Cari testimoni"/>
      <button type="button" className="btn" onClick={load} disabled={busy}>Muat ulang</button>
    </div>
    <p className="err" role="alert">{error}</p>
    <p className="label" role="status" aria-live="polite">{notice}</p>
    {items===null?<p className="label">Memuat…</p>:<div className="ad-split">
      <ul className="ad-list" aria-label="Daftar testimoni">
        {list.map(t=><li key={t.id}><button type="button" className={"ad-item"+(t.id===sel?" on":"")} aria-current={t.id===sel} onClick={()=>{setSel(t.id);setMode("view");setNotice("")}}>
          <span className="ad-i1"><strong>{t.name}</strong><Badge s={t.status}/></span>
          <span className="ad-i2">{t.content}</span>
          <span className="label">{relLabel(t.relationship)} · {when(t.created_at)}</span>
        </button></li>)}
        {!list.length&&<li className="empty">{items.length?"Tidak ada testimoni yang cocok.":"Belum ada testimoni."}</li>}
      </ul>
      <div className="ad-detail" aria-live="polite">
        {!cur?<p className="label">Pilih testimoni di sebelah kiri untuk membaca isinya.</p>
        :mode==="edit"?<EditForm key={cur.id} item={cur} busy={busy} onCancel={()=>setMode("view")} onSave={p=>patch(cur.id,p,"Perubahan disimpan.")}/>
        :<article>
          <p className="ad-st"><Badge s={cur.status}/> <span className="label">Dikirim {when(cur.created_at)}</span></p>
          <blockquote className="ad-q">{cur.content}</blockquote>
          <dl className="ad-meta">
            <div><dt className="label">Nama</dt><dd>{cur.name}</dd></div>
            <div><dt className="label">Email</dt><dd>{cur.email?<a href={"mailto:"+cur.email}>{cur.email}</a>:"Tidak diisi"}</dd></div>
            <div><dt className="label">Hubungan</dt><dd>{relLabel(cur.relationship)}</dd></div>
            {EXTRA.filter(([k])=>cur[k]).map(([k,l])=><div key={k}><dt className="label">{l}</dt><dd>{cur[k]}</dd></div>)}
          </dl>
          <div className="ad-acts">
            {cur.status!=="approved"&&<button className="btn pri" type="button" disabled={busy} onClick={()=>patch(cur.id,{status:"approved"},"Disetujui. Testimoni kini tampil di halaman publik.")}>Setujui</button>}
            {cur.status!=="rejected"&&<button className="btn" type="button" disabled={busy} onClick={()=>patch(cur.id,{status:"rejected"},"Ditolak. Testimoni tidak tampil di halaman publik.")}>Tolak</button>}
            {cur.status!=="pending"&&<button className="btn" type="button" disabled={busy} onClick={()=>patch(cur.id,{status:"pending"},"Dikembalikan ke Pending.")}>Kembalikan ke Pending</button>}
            <button className="btn" type="button" disabled={busy} onClick={()=>setMode("edit")}>Ubah</button>
            {mode==="confirm"?<span className="ad-confirm" role="alertdialog" aria-label="Konfirmasi hapus">Hapus permanen?
              <button className="btn pri" type="button" disabled={busy} onClick={()=>del(cur.id)}>Ya, hapus</button><button className="btn" type="button" onClick={()=>setMode("view")}>Batal</button></span>
            :<button className="btn" type="button" disabled={busy} onClick={()=>setMode("confirm")}>Hapus</button>}
          </div>
        </article>}
      </div>
    </div>}
  </div>;
}
