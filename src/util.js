export const fd=d=>new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
export const mins=a=>Math.max(1,Math.ceil(a.body.map(b=>[].concat(b[1]).join(" ")).join(" ").split(/\s+/).length/200));
export const fmy=ym=>{const[y,m]=String(ym).split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("id-ID",{month:"long",year:"numeric"})};
