// Tabel reusable. Di layar sempit setiap baris menjadi kartu bertumpuk (label diambil dari data-label), tanpa scroll horizontal.
// cols: [{key,label,render?,cls?,hideLabel?}]
export default function DataTable({cols,rows,rowKey="id",caption,empty}){
  if(!rows.length)return empty||null;
  return <div className="adm-tw"><table className="adm-table">
    {caption&&<caption className="adm-sr">{caption}</caption>}
    <thead><tr>{cols.map(c=><th key={c.key} scope="col" className={c.cls}>{c.hideLabel?<span className="adm-sr">{c.label}</span>:c.label}</th>)}</tr></thead>
    <tbody>{rows.map(r=><tr key={r[rowKey]}>{cols.map(c=><td key={c.key} data-label={c.hideLabel?undefined:c.label} className={c.cls}>{c.render?c.render(r):r[c.key]}</td>)}</tr>)}</tbody>
  </table></div>;
}
