// Logika UI: tema, filter, routing, transisi, form.
// Membutuhkan js/data.js dimuat lebih dulu.
const $=s=>document.querySelector(s);
// theme
const root=document.documentElement;
try{const t=localStorage.getItem("ailo-theme");if(t)root.dataset.theme=t}catch(e){}
$("#theme").onclick=()=>{const dark=getComputedStyle(root).getPropertyValue("--bg").trim()==="#171717";root.dataset.theme=dark?"light":"dark";try{localStorage.setItem("ailo-theme",root.dataset.theme)}catch(e){}};
// skills
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
$("#skillcols").innerHTML=[["Hard skills",SKILLS.hard],["Soft skills",SKILLS.soft]].map(([h,l])=>`<div><p class="label">${h}</p>${l.map(([n,v])=>`<div class="sk"><div class="row"><span>${n}</span><span>${v}%</span></div><div class="bar" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100" aria-label="${n}"><b data-w="${v}"></b></div></div>`).join("")}</div>`).join("");
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll("b[data-w]").forEach(b=>b.style.width=b.dataset.w+"%");io.unobserve(e.target)}}),{threshold:.3});
io.observe($("#skills"));
// projects search + filter
let cat="Semua";
const cats=["Semua",...new Set(PROJECTS.map(p=>p.c))];
$("#chips").style.cssText="display:flex;flex-wrap:wrap;gap:.5rem";
$("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cat}">${c}</button>`).join("");
$("#chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.textContent;[...$("#chips").children].forEach(x=>x.setAttribute("aria-pressed",x===b));render()};
$("#q").oninput=render;
function render(){
const q=$("#q").value.trim().toLowerCase();
const r=PROJECTS.filter(p=>(cat==="Semua"||p.c===cat)&&(!q||[p.t,p.d,...p.tech].join(" ").toLowerCase().includes(q)));
$("#plist").innerHTML=r.length?r.map(p=>`<a class="card" data-i="${p.i}" href="#project-${p.i}"><div class="thumb" style="background:${p.col}"><img src="${p.img}" alt="Cover ${p.t}"${p.pos?` style="object-position:${p.pos}"`:""}></div><h3>${p.t}</h3><p class="label">${p.c} · ${p.tech.join(", ")}</p><p>${p.d}</p></a>`).join(""):`<p class="empty">Tidak ada proyek yang cocok. Hapus kata kunci atau pilih kategori lain.</p>`;
}
render();
// back to top
const tb=$("#top");addEventListener("scroll",()=>tb.classList.toggle("on",scrollY>600),{passive:true});
tb.onclick=()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"});
// cursor (desktop only)
if(matchMedia("(hover:hover) and (pointer:fine)").matches&&!reduce){document.body.classList.add("cur");const c=$("#cur");addEventListener("pointermove",e=>{c.style.transform=`translate(${e.clientX-7}px,${e.clientY-7}px)`},{passive:true})}
// easter egg: type "ailo"
let buf="";addEventListener("keydown",e=>{if(e.target.matches("input"))return;buf=(buf+e.key.toLowerCase()).slice(-4);if(buf==="ailo"){$("#egg").classList.add("on");$("#egg").focus()}if(e.key==="Escape")$("#egg").classList.remove("on")});
$("#egg").onclick=()=>$("#egg").classList.remove("on");
// scroll reveal (added by JS so content stays visible if JS fails)
document.querySelectorAll("section.s h2,.about-r,.cols>div,.tools,.links li,#cv p").forEach(el=>el.classList.add("rv"));
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rio.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll(".rv").forEach(el=>rio.observe(el));
// active nav indicator
const nl=[...document.querySelectorAll("nav a.l")];
// active nav indicator: section under a reading line near the top; a clicked link stays active until the visitor scrolls by hand
const secs=[...document.querySelectorAll("main section[id]")];let lock=null,nraf=0;
const setAct=id=>nl.forEach(a=>a.classList.toggle("act",a.getAttribute("href")==="#"+id));
function navUpdate(){nraf=0;if(lock)return;const line=document.querySelector("header.top").offsetHeight+innerHeight*.25;let cur="";
secs.forEach(s=>{if(s.offsetParent!==null&&s.getBoundingClientRect().top<=line)cur=s.id});setAct(cur)}
const navReq=()=>{if(!nraf)nraf=requestAnimationFrame(navUpdate)};
addEventListener("scroll",navReq,{passive:true});addEventListener("resize",navReq);
["wheel","touchstart","keydown"].forEach(t=>addEventListener(t,()=>{if(lock){lock=null;navReq()}},{passive:true}));
nl.forEach(a=>a.addEventListener("click",()=>{lock=a.getAttribute("href").slice(1);setAct(lock)}));
navUpdate();
// simple mouse parallax on hero shapes
if(!reduce&&matchMedia("(hover:hover)").matches){const fl=[...document.querySelectorAll(".fl")];$("#home").addEventListener("pointermove",e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;fl.forEach((f,i)=>f.style.transform=`translate(${x*(i+1)*-28}px,${y*(i+1)*-28}px)`)},{passive:true})}
// cursor grows over links and buttons
document.addEventListener("pointerover",e=>{$("#cur").classList.toggle("hov",!!e.target.closest("a,button"))});
// ---- Testimonials (mock data, kept separate from UI; nothing is saved to a database) ----
const PENDING=[];let ti=0;
const fd=d=>new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
function tr(dir){const L=TESTI.filter(t=>t.status==="approved");ti=(ti+(dir||0)+L.length)%L.length;const t=L[ti],q=$("#tq");
q.innerHTML=`<blockquote class="q">${t.txt}</blockquote><figcaption>${t.av?`<img class="av" src="${t.av}" alt="">`:`<span class="av" aria-hidden="true">${t.n[0]}</span>`}<span class="label">${String(ti+1).padStart(2,"0")} / ${String(L.length).padStart(2,"0")} · ${t.cat}</span><strong>${t.n}</strong><span>${t.rel}, ${t.org}</span><time datetime="${t.d}">${fd(t.d)}</time></figcaption>`;
q.classList.remove("sw-n","sw-p");void q.offsetWidth;if(dir)q.classList.add(dir>0?"sw-n":"sw-p");$("#tcount").textContent=`${ti+1} dari ${L.length}`}
$("#tprev").onclick=()=>tr(-1);$("#tnext").onclick=()=>tr(1);tr(0);
$("#tf").onsubmit=async e=>{e.preventDefault();const tf=e.target,f=new FormData(tf),msg=$("#tmsg"),btn=$("#tsend");if(f.get("website"))return;
const name=f.get("name").trim(),rel=f.get("rel"),txt=f.get("txt").trim(),er={};
if(name.length<2)er.name="Isi nama minimal 2 huruf.";if(!rel)er.rel="Pilih hubungan denganmu.";if(txt.length<20)er.txt="Tulis minimal 20 karakter.";
tf.querySelectorAll("[data-e]").forEach(s=>s.textContent=er[s.dataset.e]||"");
if(Object.keys(er).length){msg.textContent="Periksa kolom yang ditandai.";msg.className="msg bad";return}
btn.disabled=true;btn.textContent="Mengirim…";msg.textContent="";
try{await new Promise(r=>setTimeout(r,700));PENDING.push({name,rel,txt,status:"pending",created:new Date().toISOString()});tf.reset();msg.textContent="Terkirim, terima kasih! (Mode demo: belum disimpan ke database.)";msg.className="msg ok"}catch(_){msg.textContent="Gagal mengirim. Coba lagi sebentar lagi.";msg.className="msg bad"}
btn.disabled=false;btn.textContent="Kirim"};
// ---- Journal (mock data) ----
const esc=s=>s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const mins=a=>Math.max(1,Math.ceil(a.body.map(b=>[].concat(b[1]).join(" ")).join(" ").split(/\s+/).length/200));
let jcat="Semua",jn=3;
$("#jchips").innerHTML=["Semua",...CATS].map(c=>`<button class="chip" aria-pressed="${c===jcat}">${c}</button>`).join("");
$("#jchips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;jcat=b.textContent;jn=3;[...$("#jchips").children].forEach(x=>x.setAttribute("aria-pressed",x===b));jr()};
$("#jq").oninput=()=>{jn=3;jr()};$("#jmore").onclick=()=>{jn+=3;jr()};
function jr(){const q=$("#jq").value.trim().toLowerCase(),r=ART.filter(a=>(jcat==="Semua"||a.cat===jcat)&&(!q||(a.t+" "+a.ex).toLowerCase().includes(q))).sort((a,b)=>(b.feat||0)-(a.feat||0));
const plain=!q&&jcat==="Semua";
$("#jlist").innerHTML=r.length?r.slice(0,jn).map((a,i)=>`<a class="ja${plain&&i===0&&a.feat?" f":""}" href="#article-${a.slug}"><div class="jc" style="background:${CCOL[CATS.indexOf(a.cat)]}">[Cover — ${a.cat}]</div><div><p class="label">${a.cat} · ${fd(a.d)} · ${mins(a)} menit baca</p><h3>${a.t}</h3><p>${a.ex}</p><span class="rd">Read Article</span></div></a>`).join(""):`<p class="empty" style="grid-column:1/-1">Tidak ada artikel yang cocok. Hapus kata kunci atau pilih kategori lain.</p>`;
$("#jmore").hidden=r.length<=jn}
jr();
function fillArticle(slug){const a=ART.find(x=>x.slug===slug),rel=ART.filter(x=>x!==a).sort((x,y)=>(y.cat===a.cat)-(x.cat===a.cat)).slice(0,2);
const B=a.body.map(([t,v])=>t==="h"?`<h3>${v}</h3>`:t==="p"?`<p>${v}</p>`:t==="q"?`<blockquote>${v}</blockquote>`:t==="ul"?`<ul>${v.map(x=>`<li>${x}</li>`).join("")}</ul>`:t==="img"?`<div class="pi" role="img" aria-label="${v}">[${v} — placeholder]</div>`:`<pre><code>${esc(v)}</code></pre>`).join("");
$("#ad").innerHTML=`<p class="label">${a.cat} · ${a.author} · ${fd(a.d)} · ${mins(a)} menit baca</p><h2 tabindex="-1">${a.t}</h2><p class="ad-sub">${a.ex}</p><div class="jc" style="background:${CCOL[CATS.indexOf(a.cat)]};margin:2rem 0">[Cover — ${a.cat}]</div><div class="ab">${B}</div><h3 style="font:700 1.6rem var(--display);margin:3rem 0 1rem">Artikel terkait</h3><div class="jgrid">${rel.map(x=>`<a class="ja" href="#article-${x.slug}"><p class="label">${x.cat}</p><h3>${x.t}</h3><span class="rd">Read Article</span></a>`).join("")}</div>`}
// routing + transitions (hash based: #project-N opens a detail view)
const M=$("#main"),W=$("#wipe"),card=i=>document.querySelector(`.card[data-i="${i}"]`);
const SECT=["Project overview","Problem and objectives","Research and exploration","Design process","Final interface","Technology and implementation","Project features","Demo and source code","User feedback"];
const SECL=["Ringkasan proyek","Masalah dan tujuan","Riset dan eksplorasi","Proses desain","Antarmuka akhir","Teknologi dan implementasi","Fitur proyek","Demo dan kode sumber","Umpan balik pengguna"];
let cur=-1,busy=0;
function fillDetail(i){const p=PROJECTS[i];$("#dh").innerHTML=`<div class="thumb big" style="background:${p.col}"><img src="${p.img}" alt="Cover ${p.t}"${p.pos?` style="object-position:${p.pos}"`:""}></div><h3 class="dt" tabindex="-1">${p.t}</h3><p class="label">${p.c} · ${p.tech.join(", ")}</p><p>${p.d}</p>`;$("#dbody").innerHTML=p.full?`<figure class="fig full"><img src="${p.full}" alt="${p.fullAlt||"Studi kasus "+p.t}" width="851" height="8000"></figure>`:SECT.map((s,k)=>p.hide&&p.hide.includes(s)?"":`<h4>${SECL[k]}</h4>${p.sec&&p.sec[s]||`<p><span class="ph">Placeholder</span> Isi bagian ini dengan konten asli.</p>`}`).join("")}
function tag(el,on){if(!el)return;[el.querySelector(".thumb"),el.querySelector("h3")].forEach((x,k)=>{if(x)x.style.viewTransitionName=on?(k?"ptitle":"pthumb"):""})}
function show(n){M.classList.toggle("det",n>=0);if(n>=0){fillDetail(n);scrollTo({top:0,behavior:"instant"})}}
// flash + directional slide: old page slides left, red panel wipes across, new page enters from the right (~520ms)
async function wipe(swap){
M.animate([{transform:"none",opacity:1},{transform:"translateX(-8vw)",opacity:.4}],{duration:220,easing:"cubic-bezier(.7,0,.84,0)",fill:"forwards"});
await W.animate([{transform:"translateX(100%)"},{transform:"translateX(0)"}],{duration:230,easing:"cubic-bezier(.7,0,.3,1)",fill:"forwards"}).finished;
swap();M.getAnimations().forEach(a=>a.cancel());
M.animate([{transform:"translateX(8vw)",opacity:0,filter:"blur(6px)"},{transform:"none",opacity:1,filter:"blur(0)"}],{duration:300,easing:"cubic-bezier(.2,.8,.2,1)"});
await W.animate([{transform:"translateX(0)"},{transform:"translateX(-100%)"}],{duration:260,easing:"cubic-bezier(.7,0,.3,1)",fill:"forwards"}).finished;
W.getAnimations().forEach(a=>a.cancel());}
function route(){
const m=location.hash.match(/^#project-(\d+)$/),n=m&&PROJECTS[+m[1]]?+m[1]:-1,prev=cur;
if(n===prev&&n>=0)return;
const swap=()=>{cur=n;show(n);if(n<0){const t=location.hash.length>1&&document.getElementById(location.hash.slice(1));t?t.scrollIntoView({behavior:"instant",block:"start"}):scrollTo({top:0,behavior:"instant"})}else $("#dh h3").focus({preventScroll:true})};
if(reduce||busy){swap();return}
const open=prev<0&&n>=0,close=prev>=0&&n<0,k=open?n:prev,c=card(k);
const r=c&&c.getBoundingClientRect(),vis=r&&r.bottom>0&&r.top<innerHeight;
if(document.startViewTransition&&(close||(open&&vis))){
// shared element: thumbnail + title travel between gallery card and detail hero, each project with its own easing
const root=document.documentElement,oldEl=open?c:$("#dh");tag(oldEl,1);root.style.setProperty("--ease",PROJECTS[k].ease);root.style.setProperty("--dur",PROJECTS[k].dur);busy=1;
const t=document.startViewTransition(()=>{tag(oldEl,0);M.classList.add("nv");cur=n;show(n);const nc=card(k);if(close&&nc)nc.scrollIntoView({behavior:"instant",block:"center"});tag(open?$("#dh"):nc,1)});
t.finished.finally(()=>{tag(card(k),0);tag($("#dh"),0);busy=0});
}else{busy=1;wipe(swap).finally(()=>busy=0)}}
document.addEventListener("click",e=>{const a=e.target.closest('a[href^="#"]');if(!a||a.classList.contains("skip")||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;const h=a.getAttribute("href");if(h.length<2)return;e.preventDefault();
if(h===location.hash){if(cur<0){const t=document.getElementById(h.slice(1));t&&t.scrollIntoView({behavior:reduce?"auto":"smooth"})}return}
try{history.pushState(null,"",h)}catch(_){location.hash=h;return}route()});
addEventListener("popstate",()=>route());
// article routing wraps the project router; same red wipe transition as other pages
const routeP=route;let curA=null;
route=function(){const m=location.hash.match(/^#article-([a-z0-9-]+)$/),a=m&&ART.some(x=>x.slug===m[1])?m[1]:null;
if(!a&&!curA)return routeP();if(a===curA)return;
const swap=()=>{curA=a;M.classList.toggle("adet",!!a);if(a){fillArticle(a);scrollTo({top:0,behavior:"instant"});$("#ad h2").focus({preventScroll:true})}else{const t=location.hash.length>1&&document.getElementById(location.hash.slice(1));t?t.scrollIntoView({behavior:"instant",block:"start"}):scrollTo({top:0,behavior:"instant"})}};
if(reduce||busy){swap();return}busy=1;wipe(swap).finally(()=>busy=0)};
if(/^#(project-\d+|article-[a-z0-9-]+)$/.test(location.hash))route();

// About timeline: scroll-linked fill. Progress follows the scroll position both ways (down fills, up rewinds).
(function(){const tl=document.querySelector("ol.tl");if(!tl)return;
const items=[...tl.children],rm=matchMedia("(prefers-reduced-motion:reduce)");tl.classList.add("live");
if(rm.matches){tl.style.setProperty("--p",1);items.forEach(li=>li.classList.add("on"));return}
let raf=0;
function update(){raf=0;const y=innerHeight*.55,r=tl.getBoundingClientRect();
tl.style.setProperty("--p",Math.min(1,Math.max(0,(y-r.top)/r.height)).toFixed(4));
items.forEach(li=>li.classList.toggle("on",li.getBoundingClientRect().top+8<=y))}
const req=()=>{if(!raf)raf=requestAnimationFrame(update)};
addEventListener("scroll",req,{passive:true});addEventListener("resize",req);update()})();

// CV detail view (#cv-detail), same red wipe transition as the other pages
const routeA2=route;let curC=false;
route=function(){const c=location.hash==="#cv-detail";if(!c&&!curC)return routeA2();if(c===curC)return;
const swap=()=>{curC=c;M.classList.toggle("cdet",c);if(c){scrollTo({top:0,behavior:"instant"});$("#cvdetail h2").focus({preventScroll:true})}else{const t=location.hash.length>1&&document.getElementById(location.hash.slice(1));t?t.scrollIntoView({behavior:"instant",block:"start"}):scrollTo({top:0,behavior:"instant"})}};
if(reduce||busy){swap();return}busy=1;wipe(swap).finally(()=>busy=0)};
if(location.hash==="#cv-detail")route();
