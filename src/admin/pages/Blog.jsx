import {useMemo,useState} from "react";
import {blog,useData,nowIso,useBlogCategories} from "../data/api";
import {useToast,useConfirm} from "../ui/Feedback";
import Sheet from "../ui/Sheet";
import ItemForm from "../ui/ItemForm";
import DataTable from "../ui/DataTable";
import Lite from "../ui/lite";
import {PageHeader,SearchBar,Chips,Btn,IconBtn,EmptyState,StatusBadge} from "../ui/Bits";
import useNewParam,{fmtDate} from "../ui/useNewParam";

const FIELDS=(rows,editId,CATS)=>[
  {name:"title",label:"Judul",type:"text",req:true,minLength:3,maxLength:120},
  {name:"slug",label:"Slug (alamat artikel)",type:"text",req:true,maxLength:80,slugFrom:"title",pattern:/^[a-z0-9]+(-[a-z0-9]+)*$/,patternMsg:"Slug hanya huruf kecil, angka, dan tanda hubung.",
    validate:v=>rows.some(r=>r.slug===v&&r.id!==editId)?"Slug sudah dipakai artikel lain.":"",hint:"Terisi otomatis dari judul. Contoh: catatan-belajar-figma."},
  {name:"excerpt",label:"Excerpt",type:"textarea",rows:2,req:true,minLength:10,maxLength:240},
  {name:"body",label:"Isi artikel",type:"textarea",rows:12,req:true,minLength:20,maxLength:20000,hint:"Format ringan: “## Subjudul”, “> Kutipan”, “- Poin”, blok kode di antara ```, dan “[gambar: keterangan]”. Baris kosong memisahkan paragraf."},
  {name:"category",label:"Kategori",type:"select",options:CATS,req:true,half:true},
  {name:"status",label:"Status",type:"select",options:[["draft","Draft"],["published","Published"]],half:true},
  {name:"date",label:"Tanggal",type:"date",req:true,half:true},
  {name:"thumb",label:"Cover / thumbnail",type:"image",hint:"Tampil di beranda, daftar blog, dan halaman artikel. Unggah gambar (JPG, PNG, WebP, atau GIF, maks 4 MB) atau isi tautan gambar. Rasio landscape 16:9 paling pas."},
  {name:"kind",label:"Jenis tulisan (opsional)",type:"text",maxLength:30,half:true,hint:"Contoh: Puisi, Esai. Tampil di samping kategori."},
  {name:"featured",label:"Jadikan artikel unggulan (tampil besar di beranda)",type:"checkbox"}];

export default function BlogPage(){
  const rows=useData(blog),CATS=useBlogCategories(),toast=useToast(),confirm=useConfirm();
  const [q,setQ]=useState(""),[cat,setCat]=useState("all"),[st,setSt]=useState("all"),[edit,setEdit]=useState(null),[pv,setPv]=useState(null);
  useNewParam(()=>setEdit("new"));
  const list=useMemo(()=>{
    const k=q.trim().toLowerCase();
    return rows.filter(r=>(cat==="all"||r.category===cat)&&(st==="all"||r.status===st)&&(!k||[r.title,r.slug,r.excerpt,r.body].join(" ").toLowerCase().includes(k)))
      .sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  },[rows,q,cat,st]);
  const fields=useMemo(()=>FIELDS(rows,edit&&edit!=="new"?edit.id:null,CATS),[rows,edit,CATS]);
  const done=r=>r.ok||toast("Data tidak ditemukan. Muat ulang halaman.","err");
  const submit=v=>{
    // hanya satu artikel unggulan: yang lama dilepas
    if(v.featured)rows.filter(r=>r.featured&&r.id!==(edit&&edit!=="new"?edit.id:null)).forEach(r=>blog.update(r.id,{featured:false}));
    if(edit==="new"){done(blog.create(v));toast(v.status==="published"?"Artikel dipublikasikan.":"Draf artikel disimpan.")}else{done(blog.update(edit.id,v));toast("Artikel disimpan.")}
    setEdit(null);
  };
  const del=async r=>{if(await confirm({title:"Hapus artikel?",message:`“${r.title}” akan dihapus. Tindakan ini tidak bisa dibatalkan.`,confirmLabel:"Hapus"})){done(blog.remove(r.id));toast("Artikel dihapus.")}};
  const toggle=r=>{const n=r.status==="published"?"draft":"published";done(blog.update(r.id,{status:n}));toast(n==="published"?"Artikel dipublikasikan.":"Artikel dijadikan draf.")};
  const reset=()=>{setQ("");setCat("all");setSt("all")};
  const empty=<EmptyState title={rows.length?"Tidak ada artikel yang cocok":"Belum ada artikel"} text={rows.length?"Ubah kata kunci atau filter.":"Tulis artikel pertama."}
    action={rows.length?<Btn onClick={reset}>Hapus filter</Btn>:<Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tulis artikel</Btn>}/>;
  return <>
    <PageHeader kicker="Konten" title="Blog" desc="Tulis dan kelola artikel. Hanya artikel Published yang tampil di website publik (disimpan di database)." actions={<Btn icon="plus" className="pri" onClick={()=>setEdit("new")}>Tulis artikel</Btn>}/>
    <div className="adm-bar">
      <SearchBar value={q} onChange={setQ} placeholder="Cari judul, slug, atau isi" label="Cari artikel"/>
      <label className="adm-sel"><span className="adm-sr">Filter kategori</span><select value={cat} onChange={e=>setCat(e.target.value)}><option value="all">Semua kategori</option>{CATS.map(c=><option key={c}>{c}</option>)}</select></label>
      <Chips label="Filter status" value={st} onChange={setSt} items={[["all","Semua",rows.length],["published","Published",rows.filter(r=>r.status==="published").length],["draft","Draft",rows.filter(r=>r.status==="draft").length]]}/>
    </div>
    <p className="label adm-count-l" role="status" aria-live="polite">{list.length} dari {rows.length} artikel</p>
    <DataTable caption="Daftar artikel" rows={list} empty={empty} cols={[
      {key:"title",label:"Artikel",render:r=><div className="adm-cell"><strong>{r.title}</strong><span className="label">/blog/{r.slug}</span></div>},
      {key:"category",label:"Kategori"},{key:"date",label:"Tanggal",render:r=>fmtDate(r.date)},
      {key:"status",label:"Status",render:r=><StatusBadge s={r.status}/>},
      {key:"a",label:"Aksi",hideLabel:true,cls:"c-a",render:r=><div className="adm-row-a">
        <IconBtn icon="eye" label={"Pratinjau "+r.title} onClick={()=>setPv(r)}/>
        <IconBtn icon={r.status==="published"?"undo":"check"} label={(r.status==="published"?"Jadikan draf ":"Publikasikan ")+r.title} onClick={()=>toggle(r)}/>
        <IconBtn icon="edit" label={"Ubah "+r.title} onClick={()=>setEdit(r)}/>
        <IconBtn icon="trash" label={"Hapus "+r.title} className="danger" onClick={()=>del(r)}/></div>}]}/>
    <Sheet open={!!edit} onClose={()=>setEdit(null)} wide title={edit==="new"?"Tulis artikel":"Ubah artikel"}>
      {edit&&<ItemForm key={edit==="new"?"new":edit.id} fields={fields} initial={edit==="new"?{status:"draft",category:CATS[0],date:nowIso().slice(0,10)}:edit} onSubmit={submit} onCancel={()=>setEdit(null)} submitLabel={edit==="new"?"Simpan artikel":"Simpan"}/>}
    </Sheet>
    <Sheet open={!!pv} onClose={()=>setPv(null)} wide title="Pratinjau artikel">
      {pv&&<article className="adm-article"><p className="label">{pv.category} · {fmtDate(pv.date)} · <StatusBadge s={pv.status}/></p>
        <h3>{pv.title}</h3><p className="adm-lead">{pv.excerpt}</p>{pv.thumb&&<img className="adm-article-img" src={pv.thumb} alt=""/>}<Lite text={pv.body}/></article>}
    </Sheet>
  </>;
}
