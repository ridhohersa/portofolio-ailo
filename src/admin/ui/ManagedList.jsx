import {useState} from "react";
import {AnimatePresence,motion} from "motion/react";
import {useData} from "../data/api";
import {useToast,useConfirm} from "./Feedback";
import Sheet from "./Sheet";
import ItemForm from "./ItemForm";
import {EmptyState,Btn,IconBtn} from "./Bits";

// Daftar yang bisa ditambah, diubah, dihapus, dan diurutkan, dengan pratinjau di sampingnya. Dipakai oleh bagian About.
// coll = koleksi dari data/api.js · fields = definisi ItemForm · titleOf/subOf = teks baris · preview(items) = pratinjau sederhana
export default function ManagedList({coll,fields,noun,titleOf,subOf,preview,pre}){
  const items=useData(coll),toast=useToast(),confirm=useConfirm();
  const [edit,setEdit]=useState(null);   // null | "new" | item
  const done=(r,msg)=>r.ok?toast(msg):toast("Data tidak ditemukan. Muat ulang halaman.","err");
  const submit=v=>{
    const r=edit==="new"?coll.create(v):coll.update(edit.id,v);
    done(r,edit==="new"?noun+" ditambahkan.":"Perubahan disimpan.");setEdit(null);
  };
  const del=async it=>{
    if(await confirm({title:"Hapus "+noun+"?",message:`“${titleOf(it)}” akan dihapus dari daftar. Tindakan ini tidak bisa dibatalkan.`,confirmLabel:"Hapus"}))
      done(coll.remove(it.id),noun+" dihapus.");
  };
  return <div className="adm-split">
    <section aria-label={"Daftar "+noun}>
      <div className="adm-bar"><Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tambah {noun}</Btn><span className="label">{items.length} item{coll.sortable?" · urutan sama dengan di website":" · diurutkan otomatis (terbaru dulu)"}</span></div>
      {!items.length?<EmptyState title={"Belum ada "+noun} text="Tambahkan item pertama untuk bagian ini." action={<Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tambah {noun}</Btn>}/>
      :<ul className="adm-rows"><AnimatePresence initial={false}>{items.map((it,i)=><motion.li key={it.id} layout="position" exit={{opacity:0,height:0}} transition={{duration:.25}}>
        <div className="adm-row-t"><strong>{titleOf(it)}</strong>{subOf&&subOf(it)&&<span className="label">{subOf(it)}</span>}</div>
        <div className="adm-row-a">
          {coll.sortable&&<><IconBtn icon="up" label={"Naikkan "+titleOf(it)} disabled={i===0} onClick={()=>coll.move(it.id,-1)}/>
          <IconBtn icon="down" label={"Turunkan "+titleOf(it)} disabled={i===items.length-1} onClick={()=>coll.move(it.id,1)}/></>}
          <IconBtn icon="edit" label={"Ubah "+titleOf(it)} onClick={()=>setEdit(it)}/>
          <IconBtn icon="trash" label={"Hapus "+titleOf(it)} className="danger" onClick={()=>del(it)}/>
        </div></motion.li>)}</AnimatePresence></ul>}
    </section>
    <aside className="adm-preview" aria-label="Pratinjau"><p className="label">Pratinjau sederhana</p><div className="adm-pv">{preview(items)}</div></aside>
    <Sheet open={!!edit} onClose={()=>setEdit(null)} title={edit==="new"?"Tambah "+noun:"Ubah "+noun}>
      {edit&&<ItemForm key={edit==="new"?"new":edit.id} fields={fields} initial={edit==="new"?null:pre?pre(edit):edit} onSubmit={submit} onCancel={()=>setEdit(null)} submitLabel={edit==="new"?"Tambahkan":"Simpan"}/>}
    </Sheet>
  </div>;
}
