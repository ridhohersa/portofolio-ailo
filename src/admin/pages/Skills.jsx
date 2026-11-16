import {useMemo,useState} from "react";
import {useSearchParams} from "react-router-dom";
import {AnimatePresence,motion} from "motion/react";
import {skills,useData} from "../data/api";
import {useToast,useConfirm} from "../ui/Feedback";
import Sheet from "../ui/Sheet";
import ItemForm from "../ui/ItemForm";
import {PageHeader,Tabs,Btn,IconBtn,EmptyState} from "../ui/Bits";

const CATS=[["hard","Hard Skills"],["soft","Soft Skills"],["tools","Tools"]];
const GROUPS=["Web & kode","Desain"];
const FIELDS=(groups)=>[
  {name:"name",label:"Nama skill",type:"text",req:true,minLength:2,maxLength:60},
  {name:"cat",label:"Kategori",type:"select",options:CATS,req:true},
  {name:"group",label:"Grup (khusus Tools)",type:"text",list:groups,maxLength:40,showIf:v=>v.cat==="tools",hint:"Mis. Web & kode atau Desain."},
  {name:"pct",label:"Persentase (0–100)",type:"number",req:true,min:0,max:100,int:true},
  {name:"desc",label:"Deskripsi",type:"textarea",rows:3,maxLength:300}];

export default function SkillsPage(){
  const all=useData(skills),toast=useToast(),confirm=useConfirm();
  const [sp,setSp]=useSearchParams(),tab=CATS.some(c=>c[0]===sp.get("tab"))?sp.get("tab"):"hard";
  const [edit,setEdit]=useState(null);
  // urutan sama dengan website: dari persentase tertinggi (stabil untuk nilai sama)
  const list=useMemo(()=>all.map((s,i)=>({s,i})).filter(x=>x.s.cat===tab).sort((a,b)=>b.s.pct-a.s.pct||a.i-b.i).map(x=>x.s),[all,tab]);
  const groups=useMemo(()=>[...new Set([...GROUPS,...all.map(s=>s.group).filter(Boolean)])],[all]);
  const fields=useMemo(()=>FIELDS(groups),[groups]);
  const done=r=>r.ok||toast("Data tidak ditemukan. Muat ulang halaman.","err");
  const submit=v=>{
    const row={...v,group:v.cat==="tools"?(v.group||""):""};
    if(edit==="new"){done(skills.create(row));toast("Skill ditambahkan.")}else{done(skills.update(edit.id,row));toast("Skill disimpan.")}
    if(row.cat!==tab)setSp({tab:row.cat},{replace:true});
    setEdit(null);
  };
  const del=async s=>{if(await confirm({title:"Hapus skill?",message:`“${s.name}” akan dihapus dari ${CATS.find(c=>c[0]===s.cat)[1]}.`,confirmLabel:"Hapus"})){done(skills.remove(s.id));toast("Skill dihapus.")}};
  const grouped=tab==="tools"?[...new Set(list.map(s=>s.group||"Lainnya"))]:[null];
  return <>
    <PageHeader kicker="Konten" title="Skills" desc="Kelola Hard Skills, Soft Skills, dan Tools. Daftar otomatis terurut dari persentase tertinggi, seperti di website."
      actions={<Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tambah skill</Btn>}/>
    <Tabs label="Kategori skill" value={tab} onChange={t=>setSp({tab:t},{replace:true})} items={CATS.map(([id,l])=>[id,l,all.filter(s=>s.cat===id).length])}/>
    <div className="adm-split adm-panel">
      <section aria-label="Daftar skill">
        {!list.length?<EmptyState title="Belum ada skill di kategori ini" action={<Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tambah skill</Btn>}/>
        :grouped.map(g=><div key={g||"x"}>{g&&<p className="label adm-grp">{g}</p>}
          <ul className="adm-rows"><AnimatePresence initial={false}>{list.filter(s=>g==null||(s.group||"Lainnya")===g).map(s=><motion.li key={s.id} layout="position" exit={{opacity:0,height:0}} transition={{duration:.25}}>
            <div className="adm-row-t"><strong>{s.name}</strong>{s.desc&&<span className="label">{s.desc.length>80?s.desc.slice(0,80)+"…":s.desc}</span>}</div>
            <span className="adm-pct">{s.pct}%</span>
            <div className="adm-row-a"><IconBtn icon="edit" label={"Ubah "+s.name} onClick={()=>setEdit(s)}/><IconBtn icon="trash" label={"Hapus "+s.name} className="danger" onClick={()=>del(s)}/></div>
          </motion.li>)}</AnimatePresence></ul></div>)}
      </section>
      <aside className="adm-preview" aria-label="Pratinjau skill"><p className="label">Pratinjau tampilan</p>
        <div className="adm-pv">{list.length?list.map(s=><div className="adm-sk" key={s.id}>
          <div className="adm-sk-h"><strong>{s.name}</strong><b>{s.pct}%</b></div>
          <div className="adm-sk-bar" role="progressbar" aria-valuenow={s.pct} aria-valuemin={0} aria-valuemax={100} aria-label={s.name}><motion.i key={s.pct} initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:.9,ease:[.2,.8,.2,1]}} style={{width:s.pct+"%"}}/></div>
        </div>):<p className="label">Tidak ada yang ditampilkan.</p>}</div></aside>
    </div>
    <Sheet open={!!edit} onClose={()=>setEdit(null)} title={edit==="new"?"Tambah skill":"Ubah skill"}>
      {edit&&<ItemForm key={edit==="new"?"new":edit.id} fields={fields} initial={edit==="new"?{cat:tab,pct:""}:edit} onSubmit={submit} onCancel={()=>setEdit(null)} submitLabel={edit==="new"?"Tambahkan":"Simpan"}/>}
    </Sheet>
  </>;
}
