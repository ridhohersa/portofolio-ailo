export const BIO="<p>Senang mempelajari hal baru, mengeksplorasi berbagai pendekatan, dan mengubah gagasan menjadi sesuatu yang bernilai. Terbiasa bekerja dengan perhatian pada detail, rasa ingin tahu yang tinggi, dan mampu beradaptasi di berbagai situasi dan lingkungan kerja.</p>";
// Tautan eksternal memakai target="_blank" rel="noopener noreferrer". Email memakai mailto.
export const CONTACT_LINKS=[
  {href:"mailto:ridhohersa110@gmail.com",name:"Email",label:"ridhohersa110@gmail.com"},
  {href:"https://www.behance.net/ridhohersa1",name:"Behance",label:"behance.net/ridhohersa1",ext:1},
  {href:"https://github.com/ridhohersa1",name:"GitHub",label:"github.com/ridhohersa1",ext:1},
  {href:"https://www.instagram.com/the0newhosdream",name:"Instagram",label:"instagram.com/the0newhosdream",ext:1},
  {href:"https://www.linkedin.com/in/ridhohersa",name:"LinkedIn",label:"linkedin.com/in/ridhohersa",ext:1}];
// string versi lama tetap diekspor (tidak dipakai lagi oleh Home, yang kini merender CONTACT_LINKS agar bisa dianimasikan satu per satu)
export const CONTACT=`<ul class="links">
${CONTACT_LINKS.map(l=>`<li><a href="${l.href}"${l.ext?' target="_blank" rel="noopener noreferrer"':""}>${l.name} <span style="font:400 1rem var(--mono)">${l.label}</span></a></li>`).join("\n")}
</ul>`;
