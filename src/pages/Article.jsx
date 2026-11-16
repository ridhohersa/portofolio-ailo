import {useState} from "react";
import {Link,useParams} from "react-router-dom";
import {CATS,CCOL} from "../data";
import {usePosts,usePostsReady} from "../posts";
import {Reveal,RevealImage} from "../components/Reveal";
const VP={once:true,amount:"some"};
import {fd,mins} from "../util";
// every body block reveals the same way (same tag, so the typography is untouched); tall blocks trigger as soon as any part shows
const block=([t,v,s],k)=>t==="h"?<Reveal as="h3" key={k} viewport={VP}>{v}</Reveal>:t==="p"?<Reveal as="p" key={k} viewport={VP}>{v}</Reveal>:t==="q"?<Reveal as="blockquote" key={k} viewport={VP}>{v}</Reveal>:t==="ul"?<Reveal as="ul" key={k} viewport={VP}>{v.map(x=><li key={x}>{x}</li>)}</Reveal>:t==="poem"?<Reveal as="p" className="poem" key={k} viewport={VP}>{v}</Reveal>:t==="sig"?<Reveal as="p" className="poem-sig" key={k} viewport={VP}>{v}</Reveal>:t==="img"?<Fig key={k} cap={v} src={s}/>:<Reveal as="pre" key={k} viewport={VP}><code>{v}</code></Reveal>;
// Foto di dalam artikel. Tanpa file (atau file belum ada) tampil kotak placeholder bertuliskan keterangannya.
function Fig({cap,src}){
  const [bad,setBad]=useState(false);
  return <RevealImage as="figure" className="ab-fig" viewport={{once:true,amount:"some"}}>
    {src&&!bad?<img src={src} alt={cap} loading="lazy" onError={()=>setBad(true)}/>:<div className="pi" role="img" aria-label={cap}>[Foto — {cap}]</div>}
    <figcaption className="label">{cap}</figcaption>
  </RevealImage>;
}
// Cover di kepala artikel. Bila gambar gagal dimuat, tampil blok berwarna kategori (bukan area kosong).
function Cover({a}){
  const [bad,setBad]=useState(false),ci=Math.max(0,CATS.indexOf(a.cat));
  return <RevealImage className="ad-cover" delay={.15} style={{background:CCOL[ci]}}>
    {a.img&&!bad?<img src={a.img} alt={"Cover "+a.t} onError={()=>setBad(true)}/>:<span className="ad-cph" aria-hidden="true">{a.kind||a.cat}</span>}
  </RevealImage>;
}
export default function Article(){
  const ART=usePosts(),ready=usePostsReady(),a=ART.find(x=>x.slug===useParams().slug);
  if(!a&&!ready)return <main id="main" className="adet"><section className="s" id="adetail"><p className="label" role="status">Memuat artikel…</p></section></main>;
  if(!a)return <main id="main" className="adet"><section className="s" id="adetail"><Link className="btn" to="/#blog">Kembali ke Blog</Link><p>Artikel tidak ditemukan.</p></section></main>;
  const rel=ART.filter(x=>x!==a).sort((x,y)=>(y.cat===a.cat)-(x.cat===a.cat)).slice(0,2);
  return <main id="main" className="adet"><section className="s" id="adetail"><Link className="btn" to="/#blog">Kembali ke Blog</Link>
    <article id="ad">
      <header className="ad-head">
        <div className="ad-ht"><Reveal as="p" className="label">{a.kind?a.kind+" · ":""}{a.cat}</Reveal><Reveal as="h2" tabIndex={-1} delay={.08}>{a.t}</Reveal><Reveal as="p" className="ad-sub" delay={.16}>{a.ex}</Reveal></div>
        <Cover a={a}/>
      </header>
      <div className="ad-body">
        <div className="ab">{a.body.map(block)}</div>
        <aside className="ad-aside" aria-label="Tentang artikel">
          <Reveal className="ad-by" viewport={VP}><img src="/assets/images/avatar.png" alt="" width="56" height="56"/><div><strong>{a.author}</strong><span className="label">UI/UX Designer · XII PPLG A</span></div></Reveal>
          <Reveal as="dl" className="ad-meta" delay={.08} viewport={VP}>
            {a.kind&&<div><dt className="label">Jenis</dt><dd>{a.kind}</dd></div>}
            <div><dt className="label">Kategori</dt><dd>{a.cat}</dd></div>
            <div><dt className="label">Tanggal</dt><dd>{fd(a.d)}</dd></div>
            <div><dt className="label">Waktu baca</dt><dd>{mins(a)} menit</dd></div>
          </Reveal>
          {rel.length>0&&<Reveal className="ad-rel" delay={.16} viewport={VP}><p className="label">Baca juga</p>
            {rel.map(x=><Link key={x.slug} to={"/blog/"+x.slug}><span className="label">{x.cat}</span><strong>{x.t}</strong></Link>)}</Reveal>}
        </aside>
      </div>
    </article></section></main>;
}
