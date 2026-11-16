import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {about,useData} from "../data/api";
import {useToast} from "../ui/Feedback";
import {PageHeader,Tabs,Btn,IconBtn} from "../ui/Bits";
import ManagedList from "../ui/ManagedList";
import {splitList} from "../ui/fields";

const T=(name,label,o={})=>({name,label,type:"text",maxLength:120,...o});
const TA=(name,label,o={})=>({name,label,type:"textarea",maxLength:500,rows:3,...o});

const SECTIONS={
  education:{label:"Education",noun:"jenjang pendidikan",coll:about.education,titleOf:r=>r.lv+" · "+r.n,subOf:r=>[r.p,r.now&&"Saat ini"].filter(Boolean).join(" · "),
    fields:[T("lv","Jenjang",{req:true,maxLength:8,placeholder:"SD / SMP / SMK",half:true}),T("kk","Nama jenjang",{half:true,placeholder:"Sekolah Menengah Kejuruan"}),
      T("n","Nama sekolah",{req:true}),T("p","Periode",{half:true,placeholder:"Juli 2024 – sekarang"}),{name:"now",label:"Tandai sebagai saat ini",type:"checkbox"},
      T("t","Program / jurusan"),TA("d","Deskripsi"),TA("focus","Fokus"),T("act","Kegiatan",{maxLength:200,hint:"Pisahkan dengan koma."})],
    preview:items=><ol className="adm-tl">{items.map(e=><li key={e.id} className={e.now?"now":""}><b>{e.lv}</b><div><strong>{e.n}</strong>{e.p&&<span className="label">{e.p}</span>}{e.t&&<p>{e.t}</p>}
      {splitList(e.act).length>0&&<p className="label">{splitList(e.act).join(" · ")}</p>}</div></li>)}</ol>},
  expertise:{label:"Expertise",noun:"keahlian",coll:about.expertise,titleOf:r=>r.t,subOf:r=>r.d.slice(0,70),
    fields:[T("t","Nama keahlian",{req:true}),TA("d","Deskripsi",{req:true,maxLength:300})],
    preview:items=><div className="adm-cards">{items.map((x,i)=><div key={x.id} className="adm-mini"><span className="label">{String(i+1).padStart(2,"0")}</span><strong>{x.t}</strong><p>{x.d}</p></div>)}</div>},
  experience:{label:"Experience",noun:"pengalaman",coll:about.experience,titleOf:r=>r.n,subOf:r=>r.p,
    fields:[T("n","Peran dan tempat",{req:true}),T("p","Periode"),TA("d","Deskripsi")],
    preview:items=><div className="adm-cards">{items.map(x=><div key={x.id} className="adm-mini"><span className="label">{x.p}</span><strong>{x.n}</strong><p>{x.d}</p></div>)}</div>},
  organization:{label:"Organization",noun:"organisasi",coll:about.organization,titleOf:r=>r.n,subOf:r=>[r.r,r.p].filter(Boolean).join(" · "),
    fields:[T("n","Nama organisasi",{req:true}),T("r","Jabatan / seksi",{half:true}),T("p","Periode",{half:true}),TA("d","Deskripsi")],
    preview:items=><div className="adm-cards">{items.map(x=><div key={x.id} className="adm-mini"><span className="label">{[x.r,x.p].filter(Boolean).join(" · ")}</span><strong>{x.n}</strong><p>{x.d}</p></div>)}</div>},
  certificates:{label:"Certificates",noun:"sertifikat",coll:about.certificates,titleOf:r=>r.n,subOf:r=>[r.k,r.date].filter(Boolean).join(" · "),
    fields:[T("n","Nama sertifikat",{req:true}),T("k","Kategori",{half:true,placeholder:"Kompetisi / Pelatihan"}),T("hi","Skor / sorotan",{half:true,maxLength:20,hint:"Opsional, mis. 710."}),
      T("by","Penyelenggara"),{name:"date",label:"Waktu",type:"month",half:true},{name:"doc",label:"Tautan dokumentasi",type:"url",hint:"Opsional. Diawali https://"}],
    preview:items=><div className="adm-cards">{items.map(x=><div key={x.id} className="adm-mini"><span className="label">{x.k}</span>{x.hi&&<b className="adm-hi">{x.hi}</b>}<strong>{x.n}</strong><p>{x.by}{x.date&&" · "+x.date}</p></div>)}</div>},
};

// Introduction: satu dokumen (bio, tujuan, fakta singkat)
function Intro(){
  const d=useData(about.intro),toast=useToast();
  const [v,setV]=useState(()=>({bio:d.bio,goal:d.goal,facts:d.facts.map(f=>({...f}))})),[err,setErr]=useState({});
  const setFact=(i,k,x)=>setV(s=>({...s,facts:s.facts.map((f,j)=>j===i?{...f,[k]:x}:f)}));
  const save=e=>{
    e.preventDefault();const er={};
    if(v.bio.trim().length<20)er.bio="Biografi minimal 20 karakter.";
    if(v.bio.length>700)er.bio="Biografi maksimal 700 karakter.";
    if(v.goal.length>400)er.goal="Tujuan karier maksimal 400 karakter.";
    if(v.facts.some(f=>!f.k.trim()||!f.v.trim()))er.facts="Isi label dan nilai di setiap baris, atau hapus barisnya.";
    setErr(er);if(Object.keys(er).length)return;
    const r=about.intro.save({bio:v.bio.trim(),goal:v.goal.trim(),facts:v.facts.map(f=>({k:f.k.trim(),v:f.v.trim()}))},"memperbarui Introduction");
    toast(r.ok?"Introduction disimpan.":"Data tidak ditemukan. Muat ulang halaman.",r.ok?"ok":"err");
  };
  return <div className="adm-split">
    <form className="adm-form" onSubmit={save} noValidate>
      <div className={"adm-field"+(err.bio?" bad":"")}><label htmlFor="i-bio">Biografi singkat <span className="adm-req">*</span></label><textarea id="i-bio" rows={5} value={v.bio} onChange={e=>setV(s=>({...s,bio:e.target.value}))}/><p className="adm-hint">{v.bio.length}/700</p>{err.bio&&<p className="adm-err" role="alert">{err.bio}</p>}</div>
      <div className={"adm-field"+(err.goal?" bad":"")}><label htmlFor="i-goal">Tujuan karier</label><textarea id="i-goal" rows={3} value={v.goal} onChange={e=>setV(s=>({...s,goal:e.target.value}))}/>{err.goal&&<p className="adm-err" role="alert">{err.goal}</p>}</div>
      <fieldset className="adm-fieldset"><legend>Fakta singkat</legend>
        {v.facts.map((f,i)=><div className="adm-kv" key={i}>
          <input aria-label={"Label fakta "+(i+1)} value={f.k} placeholder="Label" onChange={e=>setFact(i,"k",e.target.value)}/>
          <input aria-label={"Nilai fakta "+(i+1)} value={f.v} placeholder="Nilai" onChange={e=>setFact(i,"v",e.target.value)}/>
          <IconBtn icon="trash" label={"Hapus fakta "+(i+1)} className="danger" onClick={()=>setV(s=>({...s,facts:s.facts.filter((_,j)=>j!==i)}))}/></div>)}
        {err.facts&&<p className="adm-err" role="alert">{err.facts}</p>}
        <Btn icon="plus" onClick={()=>setV(s=>({...s,facts:[...s.facts,{k:"",v:""}]}))}>Tambah fakta</Btn>
      </fieldset>
      <div className="adm-form-a"><button className="btn pri" type="submit">Simpan Introduction</button></div>
    </form>
    <aside className="adm-preview" aria-label="Pratinjau"><p className="label">Pratinjau sederhana (belum disimpan)</p>
      <div className="adm-pv"><p className="adm-lead">{v.bio||"…"}</p><dl className="adm-facts">{v.facts.filter(f=>f.k||f.v).map((f,i)=><div key={i}><dt className="label">{f.k}</dt><dd>{f.v}</dd></div>)}</dl>
      {v.goal&&<p className="adm-goal"><span className="label">Tujuan karier</span>{v.goal}</p>}</div></aside>
  </div>;
}

export default function AboutPage(){
  const [sp,setSp]=useSearchParams(),tab=sp.get("tab")||"intro";
  const S=SECTIONS[tab];
  const counts={education:useData(about.education).length,expertise:useData(about.expertise).length,experience:useData(about.experience).length,organization:useData(about.organization).length,certificates:useData(about.certificates).length};
  return <>
    <PageHeader kicker="Konten" title="About" desc="Kelola isi halaman About. Perubahan disimpan di database. Halaman About di website publik membaca dari sini."/>
    <Tabs label="Bagian About" value={tab} onChange={t=>setSp({tab:t},{replace:true})} items={[["intro","Introduction"],...Object.entries(SECTIONS).map(([id,s])=>[id,s.label,counts[id]])]}/>
    <div className="adm-panel" role="tabpanel">
      {tab==="intro"||!S?<Intro key="intro"/>:<ManagedList key={tab} coll={S.coll} fields={S.fields} noun={S.noun} titleOf={S.titleOf} subOf={S.subOf} preview={S.preview}/>}
    </div>
  </>;
}
