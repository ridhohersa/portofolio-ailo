import {useMemo,useState} from "react";
import {Link} from "react-router-dom";
import {projects,settings,useData} from "../data/api";
import {PROJECT_CATS as CATS} from "../../data";
import {useToast,useConfirm} from "../ui/Feedback";
import Sheet from "../ui/Sheet";
import ItemForm from "../ui/ItemForm";
import DataTable from "../ui/DataTable";
import {PageHeader,SearchBar,Chips,Btn,IconBtn,EmptyState,StatusBadge} from "../ui/Bits";
import useNewParam from "../ui/useNewParam";
import {splitList} from "../ui/fields";

const FIELDS=cats=>[
  {name:"title",label:"Judul project",type:"text",req:true,minLength:2,maxLength:80},
  {name:"desc",label:"Deskripsi",type:"textarea",rows:4,req:true,minLength:10,maxLength:400},
  {name:"category",label:"Kategori",type:"text",req:true,maxLength:40,list:cats,half:true,hint:"Pilih dari saran atau ketik kategori baru."},
  {name:"status",label:"Status publikasi",type:"select",options:[["published","Published"],["draft","Draft"]],half:true},
  {name:"tech",label:"Teknologi / tools",type:"text",maxLength:120,hint:"Pisahkan dengan koma, mis. Figma, Mobile UI."},
  {name:"thumb",label:"Thumbnail",type:"image"},
  {name:"link",label:"Tautan project",type:"url",hint:"Opsional. https://… atau alamat internal seperti /project/0."}];

const Thumb=({src,title})=>src?<img className="adm-thumb" src={src} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility="hidden"}}/>:<span className="adm-thumb none" aria-hidden="true">{title.slice(0,1)}</span>;

export default function ProjectsPage(){
  const rows=useData(projects),{prefs}=useData(settings),toast=useToast(),confirm=useConfirm();
  const [q,setQ]=useState(""),[cat,setCat]=useState("all"),[st,setSt]=useState("all"),[view,setView]=useState(prefs.projectsView||"table");
  const [edit,setEdit]=useState(null),[pv,setPv]=useState(null);
  useNewParam(()=>setEdit("new"));
  const cats=useMemo(()=>[...new Set([...CATS,...rows.map(r=>r.category)])],[rows]);
  const fields=useMemo(()=>FIELDS(cats),[cats]);
  const list=useMemo(()=>{
    const k=q.trim().toLowerCase();
    return rows.filter(r=>(cat==="all"||r.category===cat)&&(st==="all"||r.status===st)&&(!k||[r.title,r.desc,r.tech,r.category].join(" ").toLowerCase().includes(k)));
  },[rows,q,cat,st]);
  const done=r=>r.ok||toast("Data tidak ditemukan. Muat ulang halaman.","err");
  const submit=v=>{
    if(edit==="new"){done(projects.create(v));toast("Project ditambahkan.")}else{done(projects.update(edit.id,v));toast("Project disimpan.")}
    setEdit(null);
  };
  const del=async r=>{if(await confirm({title:"Hapus project?",message:`“${r.title}” akan dihapus. Tindakan ini tidak bisa dibatalkan.`,confirmLabel:"Hapus"})){done(projects.remove(r.id));toast("Project dihapus.")}};
  const toggle=r=>{const n=r.status==="published"?"draft":"published";done(projects.update(r.id,{status:n}));toast(n==="published"?"Project dipublikasikan.":"Project dijadikan draf.")};
  const acts=r=><div className="adm-row-a">
    <IconBtn icon="eye" label={"Pratinjau "+r.title} onClick={()=>setPv(r)}/>
    <IconBtn icon={r.status==="published"?"undo":"check"} label={(r.status==="published"?"Jadikan draf ":"Publikasikan ")+r.title} onClick={()=>toggle(r)}/>
    <IconBtn icon="edit" label={"Ubah "+r.title} onClick={()=>setEdit(r)}/>
    <IconBtn icon="trash" label={"Hapus "+r.title} className="danger" onClick={()=>del(r)}/></div>;
  const reset=()=>{setQ("");setCat("all");setSt("all")};
  const empty=<EmptyState title={rows.length?"Tidak ada project yang cocok":"Belum ada project"} text={rows.length?"Ubah kata kunci atau filter.":"Tambahkan project pertama."}
    action={rows.length?<Btn onClick={reset}>Hapus filter</Btn>:<Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tambah project</Btn>}/>;
  return <>
    <PageHeader kicker="Konten" title="Projects" desc="Kelola galeri project. Hanya yang berstatus Published yang dianggap tampil publik. Website publik membaca daftar project dari database; isi studi kasus Memento dan Moku tetap statis." actions={<Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tambah project</Btn>}/>
    <div className="adm-bar">
      <SearchBar value={q} onChange={setQ} placeholder="Cari judul, deskripsi, atau teknologi" label="Cari project"/>
      <label className="adm-sel"><span className="adm-sr">Filter kategori</span><select value={cat} onChange={e=>setCat(e.target.value)}><option value="all">Semua kategori</option>{cats.map(c=><option key={c}>{c}</option>)}</select></label>
      <Chips label="Filter status" value={st} onChange={setSt} items={[["all","Semua",rows.length],["published","Published",rows.filter(r=>r.status==="published").length],["draft","Draft",rows.filter(r=>r.status==="draft").length]]}/>
      <div className="adm-seg" role="group" aria-label="Tampilan"><IconBtn icon="list" label="Tampilan tabel" aria-pressed={view==="table"} onClick={()=>setView("table")}/><IconBtn icon="tiles" label="Tampilan grid" aria-pressed={view==="grid"} onClick={()=>setView("grid")}/></div>
    </div>
    <p className="label adm-count-l" role="status" aria-live="polite">{list.length} dari {rows.length} project</p>
    {view==="table"?<DataTable caption="Daftar project" rows={list} empty={empty} cols={[
      {key:"th",label:"Thumbnail",hideLabel:true,cls:"c-th",render:r=><Thumb src={r.thumb} title={r.title}/>},
      {key:"title",label:"Project",render:r=><div className="adm-cell"><strong>{r.title}</strong><span className="label">{r.desc.length>90?r.desc.slice(0,90)+"…":r.desc}</span></div>},
      {key:"category",label:"Kategori"},
      {key:"status",label:"Status",render:r=><StatusBadge s={r.status}/>},
      {key:"link",label:"Tautan",render:r=>r.link?(r.link.startsWith("/")?<Link to={r.link} target="_blank">{r.link}</Link>:<a href={r.link} target="_blank" rel="noopener noreferrer">{r.link.replace(/^https?:\/\//,"").slice(0,26)}</a>):<span className="label">—</span>},
      {key:"a",label:"Aksi",hideLabel:true,cls:"c-a",render:acts}]}/>
    :list.length?<ul className="adm-grid">{list.map(r=><li key={r.id} className="adm-gcard"><Thumb src={r.thumb} title={r.title}/><div className="adm-cell"><strong>{r.title}</strong><span className="label">{r.category}</span></div><StatusBadge s={r.status}/>{acts(r)}</li>)}</ul>:empty}
    <Sheet open={!!edit} onClose={()=>setEdit(null)} title={edit==="new"?"Tambah project":"Ubah project"}>
      {edit&&<ItemForm key={edit==="new"?"new":edit.id} fields={fields} initial={edit==="new"?{status:"draft"}:edit} onSubmit={submit} onCancel={()=>setEdit(null)} submitLabel={edit==="new"?"Tambahkan":"Simpan"}/>}
    </Sheet>
    <Sheet open={!!pv} onClose={()=>setPv(null)} title="Pratinjau project">
      {pv&&<article className="adm-pcard"><div className="adm-pcard-img"><Thumb src={pv.thumb} title={pv.title}/></div>
        <h3>{pv.title}</h3><p className="label">{pv.category}{splitList(pv.tech).length>0&&" · "+splitList(pv.tech).join(", ")}</p><p>{pv.desc}</p>
        <p><StatusBadge s={pv.status}/> {pv.status==="draft"&&<span className="label">Draft tidak tampil publik.</span>}</p>
        {pv.link&&<p className="label">Tautan: {pv.link}</p>}</article>}
    </Sheet>
  </>;
}
