import {Link} from "react-router-dom";
import {CVD} from "../html";
export default function Cv(){
  return <main id="main" className="cdet"><section className="s dark" id="cvdetail" aria-label="Detail CV">
    <Link className="btn" to="/#cv">Kembali ke CV</Link>
    <h2 tabIndex={-1}>Detail CV</h2>
    <p className="btns"><a className="btn pri" href="/assets/cv/CV_Muhammad_Ridho_Hersa.pdf" download>Unduh CV (PDF)</a></p>
    <div dangerouslySetInnerHTML={{__html:CVD}}/>
  </section></main>;
}
