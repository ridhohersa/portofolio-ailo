// Leave a Note: relationship config, validation and submission.
// When VITE_API_URL is set, the note is POSTed to the Laravel API (POST /api/testimonials), which validates it again, forces status = pending
// and rate-limits it. Without it this runs as a MOCK: nothing is stored anywhere, and the UI says so.
import {CONFIGURED,pub} from "../../lib/api";


export const IS_MOCK=!CONFIGURED;

// column = which testimonials column the answer is stored in. Only the fields of the chosen relationship are ever sent.
export const RELATIONSHIPS=[
  {id:"professional",label:"Coworker",fields:[
    {column:"organization",label:"Company name",req:true,autoComplete:"organization"},
    {column:"position",label:"Job title",hint:"optional",autoComplete:"organization-title"}]},
  {id:"student",label:"Student",fields:[
    {column:"school_name",label:"School name",req:true},
    {column:"position",label:"Grade / level",hint:"optional"}]},
  {id:"teacher",label:"Teacher",fields:[
    {column:"school_name",label:"School or institution",req:true},
    {column:"position",label:"Subject / field",hint:"optional"}]},
  {id:"client",label:"Client",fields:[
    {column:"project_name",label:"Project name",req:true},
    {column:"organization",label:"Company or brand",hint:"optional",autoComplete:"organization"}]},
  {id:"friend",label:"Friend",fields:[
    {column:"relationship_detail",label:"How we know each other",hint:"optional"}]},
  {id:"collaborator",label:"Organization",fields:[
    {column:"organization",label:"Organization or community",req:true},
    {column:"position",label:"Your role",hint:"optional"}]},
  {id:"other",label:"Other",fields:[
    {column:"relationship_detail",label:"How do we know each other?",req:true,placeholder:"In a few words"}]},
];

const MAX={name:80,email:120,content:600,extra:100,detail:160};
const MIN_CONTENT=20,MIN_FILL_MS=2500,COOLDOWN_MS=60_000,DAILY_MAX=3;
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean=s=>String(s??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").trim();
const limitFor=c=>c==="relationship_detail"?MAX.detail:MAX.extra;

// values: {name,email,relationship,content,extra:{[column]:string}}. Returns {errors:{[key]:msg}}.
export function validate(v){
  const e={},rel=RELATIONSHIPS.find(r=>r.id===v.relationship);
  const name=clean(v.name),content=clean(v.content),email=clean(v.email);
  if(name.length<2)e.name="Please add your name (at least 2 letters).";
  else if(name.length>MAX.name)e.name=`Keep your name under ${MAX.name} characters.`;
  if(!rel)e.relationship="Pick how you know Ridho.";
  if(email&&(!EMAIL.test(email)||email.length>MAX.email))e.email="That email doesn't look right.";
  if(content.length<MIN_CONTENT)e.content=`Write at least ${MIN_CONTENT} characters (${content.length}/${MIN_CONTENT}).`;
  else if(content.length>MAX.content)e.content=`Keep it under ${MAX.content} characters.`;
  rel?.fields.forEach(f=>{
    const x=clean(v.extra?.[f.column]);
    if(f.req&&!x)e["x:"+f.column]=`${f.label} is required.`;
    else if(x.length>limitFor(f.column))e["x:"+f.column]="That's a bit long. Shorten it.";
  });
  return e;
}

// The payload never contains `status` or `created_at`: the server sets status = 'pending' itself.
export function toRow(v){
  const rel=RELATIONSHIPS.find(r=>r.id===v.relationship),row={
    name:clean(v.name),email:clean(v.email)||null,relationship:v.relationship,
    organization:null,position:null,project_name:null,school_name:null,relationship_detail:null,content:clean(v.content)};
  rel.fields.forEach(f=>{row[f.column]=clean(v.extra?.[f.column])||null});
  return row;
}

const store={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,x)=>{try{localStorage.setItem(k,x)}catch{}}};
function throttled(){
  const now=Date.now(),log=JSON.parse(store.get("ailo-note-log")||"[]").filter(t=>now-t<864e5);
  if(log.length&&now-log[log.length-1]<COOLDOWN_MS)return "You just sent a note. Give it a minute before the next one.";
  if(log.length>=DAILY_MAX)return "That's plenty of notes for today. Thank you! Try again tomorrow.";
  return null;
}
const record=()=>{const now=Date.now(),log=JSON.parse(store.get("ailo-note-log")||"[]").filter(t=>now-t<864e5);store.set("ailo-note-log",JSON.stringify([...log,now]))};

// opts: {honeypot, openedAt}. Resolves {ok:true,mock} or {ok:false,error}. Never throws.
export async function submitNote(v,opts={}){
  try{
    const errs=validate(v);if(Object.keys(errs).length)return {ok:false,error:"Please check the highlighted fields.",errors:errs};
    // bots: a filled honeypot or an implausibly fast fill gets a silent fake success and nothing is sent
    if(opts.honeypot||Date.now()-(opts.openedAt||0)<MIN_FILL_MS)return {ok:true,mock:IS_MOCK,dropped:true};
    const wait=throttled();if(wait)return {ok:false,error:wait};
    const row=toRow(v);
    if(IS_MOCK){
      await new Promise(r=>setTimeout(r,900));
      if(typeof navigator!=="undefined"&&navigator.onLine===false)throw new Error("offline");
      console.info("[Leave a Note] MOCK submission, not stored anywhere. Set VITE_API_URL to save for real.",row);
      record();return {ok:true,mock:true};
    }
    await pub.submitTestimonial(row);
    record();return {ok:true,mock:false};
  }catch{
    return {ok:false,error:"Couldn't send your note. Your words are still here, so try again in a moment."};
  }
}
