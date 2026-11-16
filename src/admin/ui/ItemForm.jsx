import {useId,useMemo,useRef,useState} from "react";
import {slugify,validateField} from "./fields";
import {admin as http} from "../../lib/api";

const MAX_IMG=4*1024*1024;   // sama dengan batas di server (4 MB)
// Form berbasis konfigurasi: satu definisi field dipakai untuk tambah dan ubah. Nilai dikembalikan setelah lolos validasi.
// field.type: text | textarea | number | select | checkbox | month | date | url | email | image
export default function ItemForm({fields,initial,onSubmit,onCancel,submitLabel="Simpan",busy,formId}){
  const uid=useId();
  const [v,setV]=useState(()=>Object.fromEntries(fields.map(f=>[f.name,initial?.[f.name]??(f.type==="checkbox"?false:f.type==="number"?"":f.def??"")])));
  const [err,setErr]=useState({}),[up,setUp]=useState(false),touched=useRef({});
  const byName=useMemo(()=>Object.fromEntries(fields.map(f=>[f.name,f])),[fields]);
  const set=(name,val)=>setV(x=>{
    touched.current[name]=true;
    const n={...x,[name]:val};
    // field turunan (mis. slug dari judul) ikut berubah selama belum diubah manual
    fields.forEach(f=>{if(f.slugFrom===name&&!touched.current[f.name]&&!initial?.[f.name])n[f.name]=slugify(val)});
    return n;
  });
  const blur=f=>setErr(e=>({...e,[f.name]:validateField(f,prep(f,v[f.name]),v)}));
  const prep=(f,val)=>f.type==="number"?(val===""?"":Number(val)):val;
  const submit=e=>{
    e.preventDefault();
    const out={},er={};
    fields.forEach(f=>{
      if(f.showIf&&!f.showIf(v)){return}
      const val=prep(f,v[f.name]);const m=validateField(f,val,v);if(m)er[f.name]=m;
      out[f.name]=typeof val==="string"?val.trim():val;
    });
    setErr(er);
    if(Object.keys(er).length){const first=fields.find(f=>er[f.name]);document.getElementById(uid+first.name)?.focus();return}
    onSubmit(out);
  };
  // Gambar diunggah ke server (POST /admin/uploads); yang disimpan di form hanyalah URL hasilnya. Server tetap memeriksa jenis dan ukuran.
  const pickImage=async(f,file)=>{
    if(!file)return;
    if(!/^image\/(jpeg|png|webp|gif)$/.test(file.type))return setErr(e=>({...e,[f.name]:"Gunakan gambar JPG, PNG, WebP, atau GIF."}));
    if(file.size>MAX_IMG)return setErr(e=>({...e,[f.name]:"Gambar terlalu besar (maks 4 MB)."}));
    setUp(true);setErr(e=>({...e,[f.name]:""}));
    try{const r=await http.upload(file);set(f.name,r.url)}
    catch(x){setErr(e=>({...e,[f.name]:x.message||"Gagal mengunggah gambar."}))}
    finally{setUp(false)}
  };
  return <form id={formId} className="adm-form" onSubmit={submit} noValidate>
    {fields.map((f,i)=>{
      if(f.showIf&&!f.showIf(v))return null;
      const id=uid+f.name,msg=err[f.name],val=v[f.name],common={id,"aria-invalid":!!msg,"aria-describedby":msg?id+"-e":f.hint?id+"-h":undefined,disabled:busy};
      let control;
      if(f.type==="textarea")control=<textarea {...common} rows={f.rows||4} maxLength={f.maxLength?f.maxLength+50:undefined} value={val} placeholder={f.placeholder} onChange={e=>set(f.name,e.target.value)} onBlur={()=>blur(f)} data-autofocus={i===0?"":undefined}/>;
      else if(f.type==="select")control=<select {...common} value={val} onChange={e=>set(f.name,e.target.value)}>{f.options.map(o=>Array.isArray(o)?<option key={o[0]} value={o[0]}>{o[1]}</option>:<option key={o} value={o}>{o}</option>)}</select>;
      else if(f.type==="checkbox")return <div key={f.name} className="adm-check"><label><input {...common} type="checkbox" checked={!!val} onChange={e=>set(f.name,e.target.checked)}/> {f.label}</label>{f.hint&&<p className="adm-hint" id={id+"-h"}>{f.hint}</p>}</div>;
      else if(f.type==="image")control=<div className="adm-img">
        <input {...common} type="text" value={val} placeholder="/assets/images/… atau https://…" onChange={e=>set(f.name,e.target.value)} onBlur={()=>blur({...f,type:"url"})}/>
        <label className="btn adm-btn adm-file" aria-disabled={up}>{up?"Mengunggah…":"Unggah gambar"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden disabled={up||busy} onChange={e=>{pickImage(f,e.target.files[0]);e.target.value=""}}/></label>
        {val&&<button type="button" className="btn adm-btn" onClick={()=>set(f.name,"")}>Hapus</button>}
        {val&&<img className="adm-img-p" src={val} alt="Pratinjau thumbnail" onError={e=>{e.currentTarget.style.display="none"}} onLoad={e=>{e.currentTarget.style.display=""}}/>}
      </div>;
      else control=<input {...common} type={f.type==="url"||f.type==="image"?"text":f.type||"text"} inputMode={f.type==="number"?"numeric":undefined} min={f.min} max={f.max} step={f.type==="number"?1:undefined}
        value={val} placeholder={f.placeholder} list={f.list?id+"-l":undefined} onChange={e=>set(f.name,e.target.value)} onBlur={()=>blur(f)} data-autofocus={i===0?"":undefined}/>;
      return <div key={f.name} className={"adm-field"+(msg?" bad":"")+(f.half?" half":"")}>
        <label htmlFor={id}>{f.label}{f.req&&<span className="adm-req" aria-hidden="true"> *</span>}</label>
        {control}
        {f.list&&<datalist id={id+"-l"}>{f.list.map(o=><option key={o} value={o}/>)}</datalist>}
        {f.hint&&!msg&&<p className="adm-hint" id={id+"-h"}>{f.hint}</p>}
        {msg&&<p className="adm-err" id={id+"-e"} role="alert">{msg}</p>}
      </div>;
    })}
    <div className="adm-form-a">{onCancel&&<button type="button" className="btn" onClick={onCancel} disabled={busy}>Batal</button>}<button type="submit" className="btn pri" disabled={busy||up}>{submitLabel}</button></div>
  </form>;
}
