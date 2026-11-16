import {Link} from "react-router-dom";
import {activity,blog,projects,settings,testimonials,useData} from "../data/api";
import {PageHeader} from "../ui/Bits";
import {useAuth} from "../auth";
import Icon from "../ui/Icon";
import {fmtTime} from "../ui/useNewParam";

const Stat=({n,label,sub,to,tone})=><Link to={to} className={"adm-stat "+(tone||"")}><span className="adm-stat-n">{n}</span><span className="adm-stat-l">{label}</span><span className="label">{sub}</span></Link>;

export default function Dashboard(){
  const pr=useData(projects),bl=useData(blog),te=useData(testimonials),act=useData(activity),{prefs}=useData(settings),{session}=useAuth(),name=session?.user?.name||"Admin";
  const pending=te.filter(t=>t.status==="pending").length;
  return <>
    <PageHeader kicker="Dashboard" title={"Halo, "+name.split(" ")[0]+"."} desc="Ringkasan konten website. Semua angka berasal dari database."/>
    <div className="adm-stats">
      <Stat n={pr.length} label="Total Projects" sub={pr.filter(p=>p.status==="published").length+" published · "+pr.filter(p=>p.status==="draft").length+" draft"} to="/admin/projects"/>
      <Stat n={bl.length} label="Total Blog Posts" sub={bl.filter(p=>p.status==="published").length+" published · "+bl.filter(p=>p.status==="draft").length+" draft"} to="/admin/blog"/>
      <Stat n={te.length} label="Total Testimonials" sub={te.filter(t=>t.status==="approved").length+" approved · "+te.filter(t=>t.status==="rejected").length+" rejected"} to="/admin/testimonials"/>
      <Stat n={pending} label="Pending Testimonials" sub={pending?"menunggu persetujuan":"tidak ada yang menunggu"} to="/admin/testimonials?status=pending" tone={pending?"hot":""}/>
    </div>
    <div className="adm-dash">
      <section className="adm-sec1" aria-labelledby="qa"><h2 id="qa">Quick Actions</h2>
        <div className="adm-qa">
          <Link className="btn pri adm-btn" to="/admin/projects?new=1"><Icon n="plus"/>Tambah project</Link>
          <Link className="btn adm-btn" to="/admin/blog?new=1"><Icon n="plus"/>Tulis artikel</Link>
          <Link className="btn adm-btn" to="/admin/testimonials?status=pending"><Icon n="note"/>Lihat testimoni pending{pending>0&&<em className="adm-count">{pending}</em>}</Link>
        </div>
        <p className="adm-note-s label">Perubahan tersimpan di database. Website publik membaca Blog, Testimonials, About, Skills, Projects, dan Contact dari database. Bagian yang masih kosong di database memakai data bawaan.</p>
      </section>
      {prefs.showActivity&&<section className="adm-sec1" aria-labelledby="ra"><h2 id="ra">Recent Activity</h2>
        {act.length?<ol className="adm-act">{act.slice(0,8).map(a=><li key={a.id}><span>{a.text}</span><time className="label" dateTime={a.ts}>{fmtTime(a.ts)}</time></li>)}</ol>:<p className="label">Belum ada aktivitas.</p>}</section>}
    </div>
  </>;
}
