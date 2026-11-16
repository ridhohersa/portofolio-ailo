// Testimonial board data: content comes from TESTI (src/data.js), this file only adds how each note looks and where it starts.
// fx / fy are fractions (0..1) of the board's free area, so the layout survives any board size. Colours map to .c-* in index.css.
import {useEffect,useMemo,useState} from "react";
import {TESTI} from "./data";
import {CONFIGURED,pub} from "./lib/api";
import {RELATIONSHIPS} from "./components/testimonials/submitNote";

const PRESETS=[
  {color:"yellow",fx:.03,fy:.10,rot:-5,scale:1.00,deco:"pin-red",  float:true},
  {color:"cream", fx:.20,fy:.64,rot: 4,scale:.95, deco:"tape"},
  {color:"sage",  fx:.40,fy:.05,rot:-2,scale:1.08,deco:"pin-clear"},
  {color:"pink",  fx:.55,fy:.36,rot: 6,scale:.98, deco:"pin-yellow",float:true},
  {color:"red",   fx:.88,fy:.10,rot: 3,scale:.92, deco:"tape-pin"},
  {color:"yellow",fx:.76,fy:.60,rot:-6,scale:1.04,deco:"pin-red"},
  {color:"cream", fx:.42,fy:.80,rot: 5,scale:.96, deco:"tape"},
];
const COLORS=["yellow","cream","sage","pink","red"],DECOS=["pin-red","pin-clear","pin-yellow","tape","tape-pin"];
const frac=n=>n-Math.floor(n);

// Any number of testimonials works: beyond the presets, notes are scattered with a golden-ratio sequence.
const preset=i=>PRESETS[i]||{color:COLORS[i%COLORS.length],fx:.04+.92*frac(i*.618),fy:.04+.92*frac(i*.381+.2),
  rot:((i*37)%13)-6,scale:.94+.04*(i%4),deco:DECOS[i%DECOS.length]};

export function buildNotes(list=TESTI){
  const L=list.filter(t=>t.status==="approved");
  return L.map((t,i)=>({
    id:t.id||"t"+(i+1),name:t.n,quote:t.txt,role:t.rel,org:t.org,cat:t.cat,date:t.d,avatar:t.av||null,...preset(i),
    // narrow boards (phones): notes zig-zag down two columns so every note stays easy to touch
    mx:i%2?.96:.04,my:L.length>1?.02+.94*i/(L.length-1):.5,
  }));
}

// Baris database -> bentuk TESTI. Kolom email tidak pernah diminta oleh halaman publik.
const fromRow=r=>{
  const label=RELATIONSHIPS.find(x=>x.id===r.relationship)?.label||"";
  return {id:"db-"+r.id,n:r.name,rel:label,org:r.organization||r.school_name||r.project_name||r.relationship_detail||"",cat:label,d:r.created_at,txt:r.content,status:"approved"};
};
// Sumber catatan untuk papan publik. Hanya status "approved" yang pernah sampai ke sini (server hanya mengirim itu, tanpa email, dan buildNotes menyaring lagi).
export function useApprovedNotes(){
  const [rows,setRows]=useState(null);
  useEffect(()=>{
    if(!CONFIGURED)return;
    let live=true;
    pub.testimonials().then(r=>live&&setRows((r||[]).map(fromRow))).catch(()=>live&&setRows([]));
    return()=>{live=false};
  },[]);
  const notes=useMemo(()=>buildNotes(CONFIGURED?(rows||[]):TESTI),[rows]);
  return {notes,live:CONFIGURED,loading:CONFIGURED&&rows===null};
}
