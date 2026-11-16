// Ikon garis minimal (24px). Hanya dekoratif: selalu aria-hidden, label ada di teks tombol.
const P={
  grid:"M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  user:"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6",
  bars:"M4 20V10M10 20V4M16 20v-7M22 20H2",
  folder:"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  note:"M5 4h14v11l-5 5H5zM14 20v-5h5",
  pen:"M4 20l1-4L16 5l3 3L8 19zM14 7l3 3",
  mail:"M3 6h18v12H3zM3 7l9 7 9-7",
  cog:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .5-1.5-1.5L17 5l-3-1-1 2h-2L10 4 7 5l.5 2L6 8.5 4 8l-1 3 2 1v2l-2 1 1 3 2-.5L7.5 19 7 21l3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1z",
  out:"M9 4H5v16h4M16 8l4 4-4 4M20 12H9",
  back:"M10 6l-6 6 6 6M4 12h16",
  plus:"M12 5v14M5 12h14",
  search:"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  menu:"M4 7h16M4 12h16M4 17h16",
  x:"M6 6l12 12M18 6L6 18",
  chev:"M15 6l-6 6 6 6",
  up:"M6 15l6-6 6 6",
  down:"M6 9l6 6 6-6",
  edit:"M4 20l1-4L16 5l3 3L8 19z",
  trash:"M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  check:"M5 12l5 5 9-10",
  sun:"M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon:"M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z",
  list:"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  tiles:"M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  undo:"M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
};
export default function Icon({n,size=18}){
  return <svg className="adm-ic" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={P[n]||""}/></svg>;
}
