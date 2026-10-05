import { useState } from "react";
import "../style/interView.scss";
import { useInterview } from "../hooks/useInterview";

const sections = [
  { id: "technical", label: "Technical questions" },
  { id: "behavioral", label: "Behavioral questions" },
  { id: "roadmap", label: "Road Map" },
];

const InterView = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const { report, loading, getResumePdf } = useInterview();

  const [expandedDay, setExpandedDay] = useState(null);
  const reportFile = report;

  if (loading || !report) {
    return (
      <main className="loading-section">
        <h1>Loading...Loading....</h1>
      </main>
    );
  }
  

  return (
    <main className="interview-page">
      <header className="interview-navbar">
        <a className="interview-brand" href="/" aria-label="Interview AI home">
          Interview<span>AI</span>
        </a>

        <nav className="interview-main-nav" aria-label="Main navigation">
          <a className="interview-nav-link" href="/">
            Home
          </a>
          <a className="interview-nav-link" href="/#history">
            History
          </a>
          <a className="interview-nav-link" href="/#how-it-works">
            How it Works
          </a>
          <a className="interview-nav-link active" href="#reportFile" aria-current="page">
            reportFile
          </a>
        </nav>

        <button
          className="interview-profile-menu"
          type="button"
          aria-label="Profile menu"
        >
          <span className="interview-profile-avatar" aria-hidden="true">
            SL
          </span>
          <span className="interview-profile-name">Sanku Lumbini</span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </header>

      <div className="interview-layout">
        <nav className="interview-sidebar" aria-label="Interview plan sections">
          <div className="interview-sidebar-links">
            {sections.map((section) => (
              <button
                className={`interview-nav-item${activeSection === section.id ? " active" : ""}`}
                type="button"
                key={section.id}
                aria-current={activeSection === section.id ? "page" : undefined}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
          <button
          className = 'button primary-button' onClick={() => getResumePdf(reportFile._id)}>
              <svg height={"0.8rem"} style={{'margin-right': "0.8rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
              Download Resume
            </button>
        </nav>

        <section className="interview-content" aria-live="polite">
          <div className="interview-content-heading">
            <div>
              <p className="interview-eyebrow">YOUR INTERVIEW PLAN</p>
              <h1>
                {activeSection === "technical" && "Technical questions"}
                {activeSection === "behavioral" && "Behavioral questions"}
                {activeSection === "roadmap" && "Your 7-day road map"}
              </h1>
            </div>
          </div>

          {activeSection === "technical" && (
            <div className="question-list">
              {reportFile.technicalQuestions.map((item, index) => (
                <article className="plan-card question-card" key={item.question}>
                  <div className="question-card-topline">
                    <span className="question-number">
                      Question {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`difficulty difficulty-${item.difficulty.toLowerCase()}`}
                    >
                      {item.difficulty}
                    </span>
                  </div>
                  <h2>{item.question}</h2>
                  <p>{item.reason}</p>
                </article>
              ))}
            </div>
          )}

          {activeSection === "behavioral" && (
            <div className="question-list">
              {reportFile.behavioralQuestions.map((item, index) => (
                <article className="plan-card question-card" key={item.question}>
                  <span className="question-number">
                    Question {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2>{item.question}</h2>
                  <p>{item.reason}</p>
                </article>
              ))}
            </div>
          )}

          {activeSection === "roadmap" && (
            <div className="roadmap-content">
              <p className="recommendation">
                {reportFile.overallRecommendation}
              </p>
              <div className="roadmap-list">
                {reportFile.preparationPlan.map((day) => (
                  <article className="plan-card roadmap-card" key={day.day}>
                    <button
                      className="roadmap-day-toggle"
                      type="button"
                      aria-expanded={expandedDay === day.day}
                      aria-controls={`roadmap-day-${day.day}`}
                      onClick={() =>
                        setExpandedDay(expandedDay === day.day ? null : day.day)
                      }
                    >
                      <span className="roadmap-day">DAY {day.day}</span>
                      <span className="roadmap-day-topic">{day.focus}</span>
                      <svg
                        className="roadmap-chevron"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="m4 6 4 4 4-4" />
                      </svg>
                    </button>
                    {expandedDay === day.day && (
                      <div
                        className="roadmap-day-details"
                        id={`roadmap-day-${day.day}`}
                      >
                        <h3>Preparation tasks</h3>
                        <ul>
                          {day.tasks.map((task) => (
                            <li key={task}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="interview-skill-gaps" aria-labelledby="skill-gaps-title">
          <div
            className="match-score"
            aria-label={`Profile match score ${reportFile.matchScore} percent`}
          >
            <span>{reportFile.matchScore}%</span>
            <small>Profile match</small>
          </div>
          <h2 id="skill-gaps-title">Skill Gaps</h2>
          <p className="skill-gaps-caption">
            Areas to focus on before your interview
          </p>
          <ul className="skill-gap-list">
            {reportFile.skillGaps.map((gap) => (
              <li className="skill-gap-item" key={gap.skill} title={gap.reason}>
                <span>{gap.skill}</span>
                <span className={`importance importance-${gap.importance.toLowerCase()}`}>
                  {gap.importance}
                </span>
              </li>
            ))}
          </ul>
          <div className="skill-gap-note">
            <span className="skill-gap-note-indicator" aria-hidden="true" />
            Prioritize high-importance skills in your preparation plan.
          </div>
        </aside>
      </div>
    </main>
  );
};

export default InterView;
