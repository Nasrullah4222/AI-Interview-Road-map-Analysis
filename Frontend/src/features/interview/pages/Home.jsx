import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";
import "../style/home.scss";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [formError, setFormError] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    if (!jobDescription.trim()) {
      setFormError("Add the target job description before generating a plan.");
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      setFormError(
        "Upload a resume or add a short self-description to continue.",
      );
      return;
    }

    setFormError("");
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    if (data?._id) {
      navigate(`/interview/${data._id}`);
    } else {
      setFormError("We could not create the plan right now. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="home">
      <div className="interview-shell">
        {/* Page Header */}
        <header className="page-heading">
          <div>
            <p className="eyebrow">Interview intelligence</p>
            <h1>
              Turn preparation into <span className="highlight">momentum.</span>
            </h1>
            <p className="intro">
              Bring the role and your experience. We&apos;ll shape the
              questions, gaps, and practice plan that get you ready.
            </p>
          </div>
          <div
            className="step-indicator"
            aria-label="Interview plan step 1 of 1"
          >
            <span className="step-number">01</span>
            <span>Build your brief</span>
          </div>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </header>

        {/* Main Card */}
        <div className="interview-card">
          <div className="interview-input-group">
            {/* Left Panel - Job Description */}
            <div className="panel left">
              <div className="section-heading">
                <span className="panel__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <h2>Target Job Description</h2>
                <span className="badge badge--required">Required</span>
              </div>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                aria-label="Target job description"
                className="panel__textarea"
                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                maxLength={5000}
              />
              <div className="field-meta">
                <span>Paste the complete listing for a sharper match.</span>
                <span className="char-counter">
                  {jobDescription.length} / 5000
                </span>
              </div>
            </div>

            {/* Right Panel - Profile */}
            <div className="panel right">
              <div className="section-heading">
                <span className="panel__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <h2>Your Profile</h2>
              </div>

              {/* Upload Resume */}
              <div className="input-group upload-section">
                <label className="field-label section-label">
                  Upload Resume
                  <span className="badge badge--best">Best Results</span>
                </label>
                <label className="file-label dropzone" htmlFor="resume">
                  <span className="upload-icon dropzone__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </span>
                  <div>
                    <p className="dropzone__title">
                      {resumeFileName || "Click to upload your resume"}
                    </p>
                    <p className="dropzone__subtitle">PDF or DOCX, up to 5MB</p>
                  </div>
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.docx"
                    onChange={(event) =>
                      setResumeFileName(event.target.files[0]?.name ?? "")
                    }
                  />
                </label>
              </div>

              {/* OR Divider */}
              <div className="or-divider">
                <span>OR</span>
              </div>

              {/* Quick Self-Description */}
              <div className="input-group self-description-group self-description">
                <label
                  className="field-label section-label"
                  htmlFor="selfDescription"
                >
                  Quick Self-Description
                </label>
                <textarea
                  onChange={(e) => setSelfDescription(e.target.value)}
                  id="selfDescription"
                  name="selfDescription"
                  className="panel__textarea panel__textarea--short"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>

              {/* Info Box */}
              <div className="info-box">
                <span className="info-box__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      stroke="#1a1f27"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      stroke="#1a1f27"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <p>
                  Either a <strong>Resume</strong> or a{" "}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="interview-card__footer">
            <span className="footer-info">
              AI-Powered Strategy Generation &bull; Approx 30s
            </span>
            <button
              onClick={handleGenerateReport}
              className="button primary-button generate-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              Generate My Interview Strategy
            </button>
          </div>
        </div>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        {/* Recent Reports List */}
        {reports.length > 0 && (
          <section className="recent-reports">
            <h2>My Recent Interview Plans</h2>
            <ul className="reports-list">
              {reports.map((report) => (
                <li
                  key={report._id}
                  className="report-item"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <h3>{report.title || "Untitled Position"}</h3>
                  <p className="report-meta">
                    Generated on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                  >
                    Match Score: {report.matchScore}%
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Page Footer */}
        <footer className="page-footer">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </footer>
      </div>
    </div>
  );
};

export default Home;
