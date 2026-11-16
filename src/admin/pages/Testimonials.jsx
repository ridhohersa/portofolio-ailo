import {useMemo,useState} from "react";
import {useSearchParams} from "react-router-dom";
import {motion} from "motion/react";
import {testimonials,useData} from "../data/api";
import {useToast,useConfirm} from "../ui/Feedback";
import Sheet from "../ui/Sheet";
import ItemForm from "../ui/ItemForm";
import DataTable from "../ui/DataTable";
import {PageHeader,SearchBar,Chips,Btn,IconBtn,EmptyState,StatusBadge,Badge} from "../ui/Bits";
import {fmtDate} from "../ui/useNewParam";

const COLORS=["y","c","s","p","r"],ROT=[-3,2,-1.5,3,-2.5,1.5];
const FIELDS=[
  {name:"name",label:"Nama pengirim",type:"text",req:true,minLength:2,maxLength:80},
  {name:"relation",label:"Hubungan",type:"text",maxLength:60,half:true,placeholder:"Teman, guru, klien…"},
  {name:"org",label:"Instansi / organisasi",type:"text",maxLength:100,half:true},
  {name:"message",label:"Isi testimoni",type:"textarea",rows:6,req:true,minLength:20,maxLength:600},
  {name:"status",label:"Status",type:"select",options:[["pending","Pending"],["approved","Approved"],["rejected","Rejected"]]}];
const excerpt=(s,n=90)=>s.length>n?s.slice(0,n)+"…":s;

export default function TestimonialsPage(){
  const rows=useData(testimonials),toast=useToast(),confirm=useConfirm();
  const [sp]=useSearchParams();
  const [st,setSt]=useState(["pending","approved","rejected"].includes(sp.get("status"))?sp.get("status"):"all"),[q,setQ]=useState(""),[view,setView]=useState("list");
  const [sel,setSel]=useState(null),[mode,setMode]=useState("view");   // sel = id
  const cur=rows.find(r=>r.id===sel)||null;
  const cnt=s=>rows.filter(r=>r.status===s).length;
  const list=useMemo(()=>{
    const k=q.trim().toLowerCase();
    return rows.filter(r=>(st==="all"||r.status===st)&&(!k||[r.name,r.message,r.org,r.relation].join(" ").toLowerCase().includes(k))).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  },[rows,st,q]);
  const open=(id,m="view")=>{setSel(id);setMode(m)};
  const close=()=>setSel(null);
  const done=(r,msg)=>r.ok?toast(msg):toast("Data tidak ditemukan. Muat ulang halaman.","err");
  const setStatus=(r,s,msg)=>done(testimonials.update(r.id,{status:s}),msg);
  const approve=r=>setStatus(r,"approved","Disetujui. Kini tampil di papan publik.");
  const reject=r=>setStatus(r,"rejected","Ditolak. Tidak tampil di papan publik.");
  const pend=r=>setStatus(r,"pending","Dikembalikan ke Pending.");
  const del=async r=>{if(await confirm({title:"Hapus testimoni?",message:`Testimoni dari “${r.name}” akan dihapus permanen.`,confirmLabel:"Hapus"})){done(testimonials.remove(r.id),"Testimoni dihapus.");if(sel===r.id)close()}};
  const save=v=>{done(testimonials.update(cur.id,v),"Perubahan disimpan.");setMode("view")};
  const approved=rows.filter(r=>r.status==="approved");
  const empty=<EmptyState title={rows.length?"Tidak ada testimoni yang cocok":"Belum ada testimoni"} text={rows.length?"Ubah kata kunci atau filter status.":"Testimoni baru dari pengunjung akan muncul di sini sebagai Pending."}
    action={rows.length?<Btn onClick={()=>{setQ("");setSt("all")}}>Hapus filter</Btn>:null}/>;
  return <>
    <PageHeader kicker="Konten" title="Testimonials" desc="Setujui, tolak, ubah, atau hapus testimoni. Hanya yang berstatus Approved yang tampil sebagai konten publik."/>
    <div className="adm-bar">
      <SearchBar value={q} onChange={setQ} placeholder="Cari nama, isi, atau instansi" label="Cari testimoni"/>
      <Chips label="Filter status" value={st} onChange={setSt} items={[["all","Semua",rows.length],["pending","Pending",cnt("pending")],["approved","Approved",cnt("approved")],["rejected","Rejected",cnt("rejected")]]}/>
      <div className="adm-seg" role="group" aria-label="Tampilan"><IconBtn icon="list" label="Tampilan daftar" aria-pressed={view==="list"} onClick={()=>setView("list")}/><IconBtn icon="note" label="Tampilan papan publik" aria-pressed={view==="board"} onClick={()=>setView("board")}/></div>
    </div>
    {view==="list"?<>
      <p className="label adm-count-l" role="status" aria-live="polite">{list.length} dari {rows.length} testimoni</p>
      <DataTable caption="Daftar testimoni" rows={list} empty={empty} cols={[
        {key:"name",label:"Pengirim",render:r=><div className="adm-cell"><strong>{r.name}</strong><span className="label">{[r.relation,r.org].filter(Boolean).join(" · ")}{r.demo&&" · demo"}</span></div>},
        {key:"message",label:"Isi",render:r=>excerpt(r.message)},
        {key:"status",label:"Status",render:r=><StatusBadge s={r.status}/>},{key:"date",label:"Dikirim",render:r=>fmtDate(r.date)},
        {key:"a",label:"Aksi",hideLabel:true,cls:"c-a",render:r=><div className="adm-row-a">
          <IconBtn icon="eye" label={"Lihat detail "+r.name} onClick={()=>open(r.id)}/>
          {r.status!=="approved"&&<IconBtn icon="check" label={"Setujui "+r.name} onClick={()=>approve(r)}/>}
          {r.status!=="rejected"&&<IconBtn icon="x" label={"Tolak "+r.name} onClick={()=>reject(r)}/>}
          <IconBtn icon="edit" label={"Ubah "+r.name} onClick={()=>open(r.id,"edit")}/>
          <IconBtn icon="trash" label={"Hapus "+r.name} className="danger" onClick={()=>del(r)}/></div>}]}/></>
    :<section aria-label="Papan sticky note publik">
      <p className="adm-boardnote"><Badge tone="ok">Approved saja</Badge> Papan ini meniru corkboard di website: hanya {approved.length} testimoni Approved yang tampil. Klik note untuk membuka detail.</p>
      {approved.length?<ul className="adm-board">{approved.filter(r=>!q.trim()||[r.name,r.message].join(" ").toLowerCase().includes(q.trim().toLowerCase())).map((r,i)=><li key={r.id}>
        <motion.button type="button" className={"adm-note n-"+COLORS[i%COLORS.length]} style={{rotate:ROT[i%ROT.length]}} onClick={()=>open(r.id)} aria-label={"Buka testimoni dari "+r.name}
          initial={{opacity:0,scale:.85,y:-14}} animate={{opacity:1,scale:1,y:0}} transition={{type:"spring",stiffness:170,damping:18,delay:i*.06}} whileHover={{y:-4,rotate:0}}>
          <i className="adm-pin" aria-hidden="true"/><span className="adm-note-q">{excerpt(r.message,120)}</span><span className="adm-note-n">{r.name}</span></motion.button></li>)}</ul>
      :<EmptyState title="Belum ada testimoni Approved" text="Setujui testimoni Pending agar tampil di papan."/>}
    </section>}
    <Sheet open={!!cur} onClose={close} title={mode==="edit"?"Ubah testimoni":"Detail testimoni"}>
      {cur&&(mode==="edit"?<ItemForm key={cur.id} fields={FIELDS} initial={cur} onSubmit={save} onCancel={()=>setMode("view")}/>
        :<article className="adm-detail">
          <p><StatusBadge s={cur.status}/> <span className="label">Dikirim {fmtDate(cur.date)}{cur.demo&&" · data demo"}</span></p>
          <blockquote className="adm-quote">{cur.message}</blockquote>
          <dl className="adm-dl"><div><dt className="label">Nama</dt><dd>{cur.name}</dd></div><div><dt className="label">Hubungan</dt><dd>{cur.relation||"—"}</dd></div><div><dt className="label">Instansi</dt><dd>{cur.org||"—"}</dd></div><div><dt className="label">Email</dt><dd>{cur.email||"—"}</dd></div></dl>
          <p className="label">{cur.status==="approved"?"Tampil di papan publik.":"Tidak tampil di papan publik."}</p>
          <div className="adm-form-a wrap">
            {cur.status!=="approved"&&<Btn className="pri" icon="check" onClick={()=>approve(cur)}>Setujui</Btn>}
            {cur.status!=="rejected"&&<Btn icon="x" onClick={()=>reject(cur)}>Tolak</Btn>}
            {cur.status!=="pending"&&<Btn icon="undo" onClick={()=>pend(cur)}>Kembalikan ke Pending</Btn>}
            <Btn icon="edit" onClick={()=>setMode("edit")}>Ubah</Btn><Btn icon="trash" className="danger" onClick={()=>del(cur)}>Hapus</Btn>
          </div></article>)}
    </Sheet>
  </>;
}
