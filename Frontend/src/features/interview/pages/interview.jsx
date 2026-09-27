import { Link, useLocation } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import "../style/interview.scss";

const emptyReport = {
  matchScore: null,
  technicalQuestions: [],
  behaviouralQuestions: [],
  skillGap: [],
  preparationPlan: [],
};

const formatScore = (score) =>
  typeof score === "number" ? `${Math.round(score)}%` : "--";

const QuestionList = ({ title, questions, number }) => (
  <section className="report-section question-section">
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{questions.length} questions to work through</p>
      </div>
    </div>
    {questions.length ? (
      <div className="question-list">
        {questions.map((item, index) => (
          <article className="question-card" key={`${item.question}-${index}`}>
            <span className="card-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.question}</h3>
              <p className="question-intention">{item.intention}</p>
              <p className="answer">{item.answer}</p>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <p className="empty-copy">
        No questions have been added to this report yet.
      </p>
    )}
  </section>
);

const Interview = ({ report: reportProp }) => {
  const location = useLocation();
  const { loading, report: fetchedReport } = useInterview();
  const report =
    reportProp ?? location.state?.report ?? fetchedReport ?? emptyReport;
  const behaviouralQuestions =
    report.behaviouralQuestions ?? report.behavioralQuestions ?? [];
  const skillGap = report.skillGap ?? report.skillGaps ?? [];

  if (loading && !fetchedReport && !reportProp && !location.state?.report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview report...</h1>
      </main>
    );
  }

  return (
    <main className="interview-report">
      <div className="report-shell">
        <nav className="report-nav" aria-label="Main navigation">
          <Link to="/" className="report-nav__home">
            <span aria-hidden="true">&larr;</span>
            Home
          </Link>
          <span className="report-nav__context">Interview intelligence</span>
        </nav>
        <header className="report-header">
          <div>
            <p className="eyebrow">Interview report</p>
            <h1>Your preparation map.</h1>
            <p className="intro">
              A focused view of the questions to practice, the skills to
              strengthen, and the plan to get ready.
            </p>
          </div>
          <div
            className="match-score"
            aria-label={`Match score ${formatScore(report.matchScore)}`}
          >
            <span>Match score</span>
            <strong>{formatScore(report.matchScore)}</strong>
          </div>
        </header>

        <div className="report-layout">
          <aside className="report-sidebar">
            <p className="sidebar-label">In this report</p>
            <nav aria-label="Report sections">
              <a href="#technical-questions">Technical questions</a>
              <a href="#behavioural-questions">Behavioural questions</a>
              <a href="#preparation-plan">Preparation plan</a>
            </nav>
            <div className="sidebar-rule" />
            <p className="sidebar-meta">Generated interview intelligence</p>
          </aside>

          <div className="report-main">
            <div id="technical-questions">
              <QuestionList
                title="Technical questions"
                questions={report.technicalQuestions ?? []}
                number="01"
              />
            </div>
            <div id="behavioural-questions">
              <QuestionList
                title="Behavioural questions"
                questions={behaviouralQuestions}
                number="02"
              />
            </div>
            <section className="report-section" id="preparation-plan">
              <div className="section-heading">
                <span className="section-number">03</span>
                <div>
                  <h2>Preparation plan</h2>
                  <p>A practical route from now to ready.</p>
                </div>
              </div>
              {report.preparationPlan?.length ? (
                <div className="plan-list">
                  {report.preparationPlan.map((item, index) => (
                    <article className="plan-item" key={`${item.day}-${index}`}>
                      <span className="plan-day">Day {item.day}</span>
                      <div>
                        <h3>{item.focus}</h3>
                        <ul>
                          {(item.tasks ?? []).map((task) => (
                            <li key={task}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-copy">
                  Your preparation plan will appear here.
                </p>
              )}
            </section>
          </div>

          <aside className="skill-gap-panel">
            <div className="section-heading compact">
              <span className="section-number">04</span>
              <div>
                <h2>Skill gap</h2>
                <p>Areas worth your attention.</p>
              </div>
            </div>
            {skillGap.length ? (
              <div className="skill-list">
                {skillGap.map((item) => (
                  <div
                    className={`skill-chip ${String(item.severity ?? "").toLowerCase()}`}
                    key={item.skill}
                  >
                    <span>{item.skill}</span>
                    <small>{item.severity}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-copy">No skill gaps identified yet.</p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Interview;
