import {motion} from "motion/react";
import Icon from "./Icon";

export const Badge=({tone="",children})=><span className={"adm-badge "+tone}>{children}</span>;
export const STATUS_TONE={published:"ok",approved:"ok",draft:"dash",pending:"dash",rejected:"red"};
export const STATUS_LABEL={published:"Published",draft:"Draft",pending:"Pending",approved:"Approved",rejected:"Rejected"};
export const StatusBadge=({s})=><Badge tone={STATUS_TONE[s]}>{STATUS_LABEL[s]||s}</Badge>;

export function PageHeader({kicker,title,desc,actions}){
  return <header className="adm-ph">
    <div><p className="label">{kicker}</p><h1>{title}</h1>{desc&&<p className="adm-desc">{desc}</p>}</div>
    {actions&&<div className="adm-ph-a">{actions}</div>}
  </header>;
}
export function EmptyState({title,text,action}){
  return <div className="adm-empty"><p className="adm-empty-t">{title}</p>{text&&<p>{text}</p>}{action}</div>;
}
export function SearchBar({value,onChange,placeholder="Cari…",label}){
  return <label className="adm-search"><Icon n="search"/><span className="adm-sr">{label||placeholder}</span>
    <input type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>;
}
// Filter berbentuk chip. items: [[id,label,count?]]
export function Chips({value,onChange,items,label}){
  return <div className="adm-chips" role="group" aria-label={label}>{items.map(([id,l,n])=>
    <button key={id} type="button" className="chip" aria-pressed={value===id} onClick={()=>onChange(id)}>{l}{n!=null&&<em>{n}</em>}</button>)}</div>;
}
export function Tabs({value,onChange,items,label}){
  return <div className="adm-tabs" role="tablist" aria-label={label}>{items.map(([id,l,n])=>
    <button key={id} type="button" role="tab" aria-selected={value===id} className="adm-tab" onClick={()=>onChange(id)}>
      {l}{n!=null&&<em>{n}</em>}{value===id&&<motion.span layoutId={"tab-"+label} className="adm-tab-ind"/>}</button>)}</div>;
}
export const Btn=({icon,children,...p})=><button type="button" {...p} className={"btn adm-btn "+(p.className||"")}>{icon&&<Icon n={icon}/>}{children}</button>;
export const IconBtn=({icon,label,...p})=><button type="button" {...p} className={"adm-iconbtn "+(p.className||"")} aria-label={label} title={label}><Icon n={icon}/></button>;
