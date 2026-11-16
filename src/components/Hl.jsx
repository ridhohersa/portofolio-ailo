import {motion,useReducedMotion} from "motion/react";
// Garis highlight tulisan tangan untuk SUBJUDUL section (bukan judul halaman, nama proyek, kartu, atau label).
// Goresan SVG organik berwarna Signal Red, tepat di bawah teks, sedikit melewati kedua sisinya, tergambar sekali saat terlihat.
// Dua bentuk goresan dipilih dari panjang teks agar subjudul yang berdekatan tidak terlihat identik.
const STROKES=[
  "M3 8.2C22 3.6 41 10.6 66 6.4S112 3.2 138 7.4s44 3.2 59-.8",
  "M2 6.4c20 4.2 36-2.6 62 .6s50 5.6 78 1.4 38-3.4 56-.4"
];
export default function Hl({children,tag:T="span"}){
  const still=useReducedMotion();
  const d=STROKES[String(children).length%2];
  return <T className="hl"><span className="hl-t">{children}</span>
    <svg className="hl-s" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <motion.path d={d} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        initial={still?false:{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true,amount:"some"}} transition={{duration:.7,delay:.25,ease:[.5,.1,.2,1]}}/>
    </svg></T>;
}
