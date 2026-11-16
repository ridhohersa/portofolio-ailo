import {Fragment} from "react";
// Pratinjau isi artikel: markdown ringan -> elemen React (tanpa dangerouslySetInnerHTML, jadi aman dari HTML yang diketik).
// "## judul", "> kutipan", "- poin", blok ```kode```, "[gambar: keterangan]", selain itu paragraf.
export default function Lite({text}){
  const out=[],lines=String(text||"").replace(/\r/g,"").split("\n");
  let i=0,k=0;
  while(i<lines.length){
    const l=lines[i];
    if(!l.trim()){i++;continue}
    if(l.startsWith("```")){const buf=[];i++;while(i<lines.length&&!lines[i].startsWith("```")){buf.push(lines[i]);i++}i++;out.push(<pre key={k++}><code>{buf.join("\n")}</code></pre>);continue}
    if(l.startsWith("## ")){out.push(<h3 key={k++}>{l.slice(3)}</h3>);i++;continue}
    if(l.startsWith("> ")){out.push(<blockquote key={k++}>{l.slice(2)}</blockquote>);i++;continue}
    if(l.startsWith("- ")){const b=[];while(i<lines.length&&lines[i].startsWith("- ")){b.push(lines[i].slice(2));i++}out.push(<ul key={k++}>{b.map((x,j)=><li key={j}>{x}</li>)}</ul>);continue}
    const m=/^\[gambar:\s*([^|\]]*?)\s*(?:\|[^\]]*)?\]$/.exec(l.trim());
    if(m){out.push(<div key={k++} className="adm-lite-img" role="img" aria-label={m[1]}>[{m[1]||"gambar"}]</div>);i++;continue}
    const b=[];while(i<lines.length&&lines[i].trim()&&!/^(```|## |> |- |\[gambar:)/.test(lines[i])){b.push(lines[i]);i++}
    out.push(<p key={k++}>{b.map((x,j)=><Fragment key={j}>{j>0&&<br/>}{x}</Fragment>)}</p>);
  }
  return <div className="adm-lite">{out.length?out:<p className="label">Belum ada isi.</p>}</div>;
}
