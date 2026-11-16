// Validasi dan utilitas untuk ItemForm. Semua validasi ada di frontend dan hanya untuk kenyamanan pengguna.
export const URL_RE=/^(https?:\/\/[^\s]+|\/[^\s]*)$/i;
export const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const slugify=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
export const splitList=s=>String(s||"").split(",").map(x=>x.trim()).filter(Boolean);

// field: {name,label,type,req,min,max,maxLength,minLength,pattern,patternMsg,validate(value,all),showIf(all)}
export function validateField(f,v,all){
  if(f.showIf&&!f.showIf(all))return "";
  const s=typeof v==="string"?v.trim():v;
  if(f.type==="checkbox")return "";
  const empty=s===""||s==null||(f.type==="number"&&Number.isNaN(s));
  if(empty)return f.req?`${f.label} wajib diisi.`:"";
  if(f.type==="number"){
    if(typeof s!=="number"||Number.isNaN(s))return `${f.label} harus berupa angka.`;
    if(f.int&&!Number.isInteger(s))return `${f.label} harus bilangan bulat.`;
    if(f.min!=null&&s<f.min||f.max!=null&&s>f.max)return `${f.label} harus antara ${f.min} dan ${f.max}.`;
  }
  if(typeof s==="string"){
    if(f.minLength&&s.length<f.minLength)return `${f.label} minimal ${f.minLength} karakter (sekarang ${s.length}).`;
    if(f.maxLength&&s.length>f.maxLength)return `${f.label} maksimal ${f.maxLength} karakter (sekarang ${s.length}).`;
    if(f.type==="email"&&!EMAIL_RE.test(s))return "Format email tidak valid.";
    if((f.type==="url"||f.type==="image"&&!s.startsWith("data:"))&&!URL_RE.test(s))return "Gunakan tautan https://… atau alamat internal yang diawali /.";
    if(f.pattern&&!f.pattern.test(s))return f.patternMsg||`${f.label} tidak valid.`;
  }
  return f.validate?f.validate(s,all)||"":"";
}
