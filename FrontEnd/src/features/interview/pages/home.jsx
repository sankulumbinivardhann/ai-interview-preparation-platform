import React, {useState, useRef} from "react";
import "../style/Home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

const Home = () => {

  const navigate = useNavigate();

  const {loading, generateReport, reports} = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();

  const handleGenerateReport = async () => {
    if (!jobDescription || !selfDescription || !resumeInputRef.current?.files[0]) {
      alert("Please fill all the fields and upload your resume.");
      return;
    }
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({ jobDescription, selfDescription, resumeFile });
    navigate(`/interview/${data._id}`);
  };

  if(loading){
    return(
      <main className="loading-screen">
        <h1>Loading Your Interview plan</h1>
      </main>
    )
  }

  return (
    <main className="home">
      <header className="navBar">
        <a className="brand" href="/" aria-label="Interview AI home">
          Interview<span>AI</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="/">
            Home
          </a>
          <a className="nav-link" href="#history">
            History
          </a>
          <a className="nav-link" href="#how-it-works">
            How it Works
          </a>
        </nav>

        <button className="profile-menu" type="button" aria-label="Profile menu">
          <span className="profile-avatar" aria-hidden="true">
            SL
          </span>
          <span className="profile-name">Sanku Lumbini</span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </header>

      <section className="mainHome" aria-labelledby="page-title">
        <div className="page-intro">
          <h1 id="page-title">
            Create your custom <span>interview plan</span>
          </h1>
          <p>
            let our ai analyze the job requirements and your unique profile to
            build a winning strategy
          </p>
        </div>

        <form className="interview-input-group">
          <section className="form-column job-column">
            <label className="field-heading" htmlFor="jobDescription">
              Job Description
            </label>
            <p className="field-help">
              Paste the complete job description
              <br />
              here to get a tailored interview plan.
            </p>
            <textarea
              onChange={(e)=>{setJobDescription(e.target.value)}}
              className="text-area job-description"
              name="jobDescription"
              id="jobDescription"
              placeholder="Enter job description here..."
            />
          </section>

          <section className="form-column details-column">
            <div className="resume-section">
              <h2 className="field-heading">Resume</h2>
              <p className="field-help">
                Upload your latest resume (PDF format).
              </p>
              <label className="resume-dropzone" htmlFor="resume">
                <svg
                  className="pdf-icon"
                  viewBox="0 0 40 48"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 2.5h15l13.5 13.6v26.4A3.5 3.5 0 0 1 33 46H8a3.5 3.5 0 0 1-3.5-3.5V6A3.5 3.5 0 0 1 8 2.5Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 3v13h13M10 33h3.3a3 3 0 1 0 0-6H10v11m11-11h2.2a5 5 0 0 1 0 10H21V27Zm11 0h-6v11m0-5h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Drag and drop your resume here</span>
                <span className="browse-prompt">
                  or <strong>click to browse</strong>
                </span>
                <input
                  ref = {resumeInputRef}
                  className="resume-input"
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf,application/pdf"
                />
              </label>
            </div>

            <div className="self-description-section">
              <label className="field-heading" htmlFor="selfDescription">
                Self Description
              </label>
              <p className="field-help">
                Tell us about yourself, your skills, experience, goals, or
                anything else you want to highlight.
              </p>
              <textarea
                onChange = {(e)=>{setSelfDescription(e.target.value)}}
                className="text-area self-description"
                name="selfDescription"
                id="selfDescription"
                placeholder="Enter your self description here..."
              />
            </div>

            <button
              onClick={handleGenerateReport}
              className="generate-button"
              type="button"
            >
              Generate Interview Plan
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M3.5 10h12m-5-5 5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </section>
        </form>
      </section>


      {/* Recent Reports List */}
      {reports.length > 0 && (<section className="recent-reports">
        <h2>My Recent Interview Plans</h2>
        <ul className="reports-list">
          {reports.map(report=>(
            <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
              <h3>{report.title || 'Untitled Position'}</h3>
              <p className="report-meta">
                Generated <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </p>
              <p className={`match-score ${report.matchScore >= 80 ? 'high' : report.matchScore >= 50 ? 'medium' : 'low'}`} >
                Match Score: {report.matchScore}%
              </p>
            </li>
          ))}
        </ul>
      </section>)}


      <footer className="home-footer">
        <nav className="footer-links" aria-label="Footer links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Services</a>
          <a href="/help-center">Help center</a>
        </nav>
      </footer>
    </main>
  );
};

export default Home;
