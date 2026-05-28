import { useState } from "react";
import axios from "axios";

import {
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Target,
  ShieldAlert,
  Briefcase,
  Search,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  Award,
  Share2,
  Download,
} from "lucide-react";

/* ======================================================
   ACCORDION COMPONENT
====================================================== */

function Accordion({
  title,
  icon,
  iconColor,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-indigo-50/40 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className={` ${iconColor}`}>{icon}</div>

          <span className="text-sm font-semibold text-slate-800">
            {title}
          </span>
        </div>

        {open ? (
          <ChevronUp className="text-slate-400" size={16} />
        ) : (
          <ChevronDown className="text-slate-400" size={16} />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function ATSScorerPage() {
  const [jobDescription, setJobDescription] = useState("");

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);

  const [responseData, setResponseData] = useState(null);

  const [error, setError] = useState("");

  /* ======================================================
     FILE UPLOAD
  ====================================================== */

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }

    setError("");

    setResume(file);
  };

  /* ======================================================
     API CALL
  ====================================================== */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      setError("");

      setResponseData(null);

      if (!jobDescription.trim()) {
        setError("Please enter a job description.");
        return;
      }

      if (!resume) {
        setError("Please upload a resume.");
        return;
      }

      const formData = new FormData();

      formData.append("pdf", resume);

      formData.append("jd_text", jobDescription);

      const response = await axios.post(
        "http://127.0.0.1:8000/ats-scorer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      /*
        Backend Response:
        {
          success: true,
          data: "JSON STRING"
        }
      */

      const parsedData = {
        ...response.data,
        data: JSON.parse(response.data.data),
      };

      setResponseData(parsedData);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.detail || "Backend error occurred.");
      } else if (err.request) {
        setError("Unable to connect to backend server.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     RESULT
  ====================================================== */

  const result = responseData?.data;

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faff] via-[#fcfcff] to-[#f5f3ff] text-slate-900">
      {/* ======================================================
          TOP NAVBAR
      ====================================================== */}

      <div className="h-14 border-b border-slate-200/70 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          {/* LOGO */}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FileText size={16} className="text-indigo-600" />
            </div>

            <span className="text-lg font-bold text-slate-800">
              ATS Resume Scorer
            </span>
          </div>

          {/* BADGE */}

          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600">
            <Sparkles size={13} />
            AI Powered Analysis
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* ======================================================
            HERO SECTION
        ====================================================== */}

        <section className="mb-10 grid md:grid-cols-[1fr_250px] gap-8 items-center">
          {/* LEFT */}

          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-slate-900">
              ATS Resume Scorer
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">
              Upload your resume and compare it with the job description to get
              detailed ATS insights, recruiter feedback, keyword analysis, and
              improvement suggestions.
            </p>
          </div>

          {/* RIGHT CARD */}

          <div className="hidden md:flex justify-end">
            <div className="relative w-52 h-56 rounded-3xl bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-5">
              {/* SPARKLES */}

              <div className="absolute -left-5 top-14 text-indigo-300 text-2xl">
                ✦
              </div>

              <div className="absolute -right-5 top-5 text-indigo-300 text-2xl">
                ✦
              </div>

              <div className="absolute right-0 top-32 text-indigo-300 text-lg">
                ✦
              </div>

              {/* TOP */}

              <div className="flex items-center gap-2 text-sm font-bold text-indigo-700">
                <FileText size={18} />
                ATS
              </div>

              {/* SCORE */}

              <div className="mt-7 mx-auto w-24 h-24 rounded-full border-[8px] border-emerald-400 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-extrabold text-slate-900">
                  85
                </span>
              </div>

              {/* LINES */}

              <div className="mt-7 space-y-3">
                <div className="h-2 rounded bg-indigo-100" />

                <div className="h-2 rounded bg-indigo-100 w-3/4" />

                <div className="h-2 rounded bg-indigo-100 w-1/2" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            INPUT SECTION
        ====================================================== */}

        <section className="grid lg:grid-cols-2 gap-6">
          {/* ======================================================
              JOB DESCRIPTION
          ====================================================== */}

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)]">
            {/* TITLE */}

            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>

              <h2 className="text-base font-bold text-slate-800">
                Job Description
              </h2>
            </div>

            {/* TEXTAREA */}

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
              placeholder="Paste the job description here..."
              className="w-full rounded-xl border border-slate-200/70 bg-white p-4 resize-none text-sm leading-7 text-slate-700 shadow-inner transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />

            {/* FOOTER */}

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <Target size={13} />
              Paste the job description here
            </div>
          </div>

          {/* ======================================================
              UPLOAD RESUME
          ====================================================== */}

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)]">
            {/* TITLE */}

            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>

              <h2 className="text-base font-bold text-slate-800">
                Upload Resume
              </h2>
            </div>

            {/* DROP AREA */}

            <label className="block cursor-pointer">
              <div className="min-h-[260px] rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-center px-6 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300">
                {/* ICON */}

                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-5">
                  <FileText className="text-indigo-500" size={30} />
                </div>

                {/* TITLE */}

                <p className="text-lg font-semibold text-slate-700">
                  Drag & drop your resume here
                </p>

                <p className="mt-2 text-sm text-slate-400">or</p>

                {/* BUTTON */}

                <span className="mt-4 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm">
                  Choose File
                </span>

                {/* INPUT */}

                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleResumeUpload}
                />
              </div>
            </label>

            {/* SUPPORT */}

            <p className="mt-4 text-xs text-slate-400">
              PDF or DOCX format supported
            </p>

            {/* FILE */}

            {resume && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-white text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-indigo-500" />

                  <span>
                    Uploaded:{" "}
                    <span className="font-semibold text-slate-800">
                      {resume.name}
                    </span>
                  </span>
                </div>

                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 flex items-start gap-3 text-sm">
                <AlertTriangle className="mt-0.5" size={16} />

                <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            BUTTON
        ====================================================== */}

        <div className="mt-7 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-3 rounded-xl px-9 py-4 text-sm font-bold text-white transition-all duration-300 ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-[0_10px_30px_rgba(99,102,241,0.35)] hover:scale-[1.02]"
            }`}
          >
            <Sparkles size={16} />

            {loading ? "Analyzing Resume..." : "Generate ATS Analysis"}
          </button>
        </div>

        {/* ======================================================
            RESULTS
        ====================================================== */}

        {result && (
          <section className="mt-10 space-y-4">
            {/* ======================================================
                TOP STATS
            ====================================================== */}

            <div className="grid md:grid-cols-3 gap-4">
              {/* SCORE */}

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-5 flex items-center gap-5 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)]">
                <div className="w-16 h-16 rounded-full border-[5px] border-emerald-400 shadow-inner flex items-center justify-center">
                  <span className="text-xl font-extrabold">
                    {result.ats_score}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    ATS Score
                  </p>

                  <p className="text-xs text-slate-400">Out of 100</p>
                </div>
              </div>

              {/* MATCH */}

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-5 flex items-center gap-5 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)]">
                <ShieldCheck size={24} className="text-indigo-500" />

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Match Level
                  </p>

                  <p className="text-sm font-semibold text-emerald-500">
                    {result.match_level}
                  </p>
                </div>
              </div>

              {/* FILE */}

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-5 flex items-center gap-5 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)]">
                <FileText size={24} className="text-indigo-500" />

                <div>
                  <p className="text-sm font-bold text-slate-800">File</p>

                  <p className="text-sm text-slate-400">{resume?.name}</p>
                </div>
              </div>
            </div>

            {/* ======================================================
                SUMMARY
            ====================================================== */}

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList size={18} className="text-indigo-500" />

                <h2 className="text-base font-bold text-slate-800">
                  Resume Match Analysis
                </h2>
              </div>

              <p className="text-sm leading-8 text-slate-500">
                {result.summary}
              </p>
            </div>

            {/* ======================================================
                ACCORDIONS
            ====================================================== */}

            <div className="space-y-3">
              {/* STRENGTHS */}

              <Accordion
                title="Strengths"
                icon={<CheckCircle2 size={18} />}
                iconColor="text-emerald-500"
              >
                <div className="space-y-3">
                  {result.strengths?.map((strength, index) => (
                    <div
                      key={index}
                      className="flex gap-3 text-sm text-slate-600"
                    >
                      <CheckCircle2
                        className="text-emerald-500 mt-0.5"
                        size={16}
                      />

                      <p>{strength}</p>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* WEAKNESSES */}

              <Accordion
                title="Weaknesses"
                icon={<AlertTriangle size={18} />}
                iconColor="text-orange-500"
              >
                <div className="space-y-3">
                  {result.weaknesses?.map((weakness, index) => (
                    <div
                      key={index}
                      className="flex gap-3 text-sm text-slate-600"
                    >
                      <XCircle
                        className="text-red-500 mt-0.5"
                        size={16}
                      />

                      <p>{weakness}</p>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* MISSING KEYWORDS */}

              <Accordion
                title="Missing Keywords"
                icon={<Search size={18} />}
                iconColor="text-violet-600"
              >
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Accordion>

              {/* KEYWORD MATCH */}

              <Accordion
                title="Keyword Match Analysis"
                icon={<TrendingUp size={18} />}
                iconColor="text-blue-600"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  {/* MATCHED */}

                  <div>
                    <h3 className="mb-3 text-sm font-bold text-emerald-600">
                      Matched Keywords
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {result.keyword_match_analysis?.matched_keywords?.map(
                        (item, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* MISSING */}

                  <div>
                    <h3 className="mb-3 text-sm font-bold text-red-600">
                      Missing Important Keywords
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {result.keyword_match_analysis?.missing_important_keywords?.map(
                        (item, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Accordion>

              {/* SECTION FEEDBACK */}

              <Accordion
                title="Section Feedback"
                icon={<ClipboardList size={18} />}
                iconColor="text-indigo-600"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(result.section_feedback || {}).map(
                    ([section, value]) => (
                      <div
                        key={section}
                        className="rounded-xl border border-slate-200 p-4 bg-white"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-bold capitalize text-slate-800">
                            {section}
                          </h3>

                          <span className="text-xs font-bold text-indigo-600">
                            {value.score}/100
                          </span>
                        </div>

                        <div className="mb-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{ width: `${value.score}%` }}
                          />
                        </div>

                        <p className="text-xs leading-6 text-slate-500">
                          {value.feedback}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </Accordion>

              {/* IMPROVEMENTS */}

              <Accordion
                title="Improvement Suggestions"
                icon={<TrendingUp size={18} />}
                iconColor="text-emerald-600"
              >
                <div className="space-y-4">
                  {result.improvement_suggestions?.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-amber-50 border border-amber-100 p-4"
                    >
                      <h3 className="text-sm font-bold text-amber-700">
                        {item.issue}
                      </h3>

                      <p className="mt-3 text-xs leading-6 text-slate-600">
                        <span className="font-semibold">Suggestion:</span>{" "}
                        {item.suggestion}
                      </p>

                      <p className="mt-3 text-xs leading-6 text-slate-600">
                        <span className="font-semibold">Example:</span>{" "}
                        {item.example}
                      </p>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* ATS RISKS */}

              <Accordion
                title="ATS Risks"
                icon={<ShieldAlert size={18} />}
                iconColor="text-red-500"
              >
                <div className="space-y-3">
                  {result.ats_risks?.map((risk, index) => (
                    <div
                      key={index}
                      className="flex gap-3 text-sm text-slate-600"
                    >
                      <ShieldAlert
                        className="text-red-500 mt-0.5"
                        size={16}
                      />

                      <p>{risk}</p>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* RECRUITER NOTES */}

              <Accordion
                title="Recruiter Notes"
                icon={<FileText size={18} />}
                iconColor="text-indigo-500"
              >
                <div className="space-y-3">
                  {result.recruiter_notes?.map((note, index) => (
                    <div
                      key={index}
                      className="text-sm leading-7 text-slate-600"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* FINAL RECOMMENDATION */}

              <Accordion
                title="Final Recommendation"
                icon={<Award size={18} />}
                iconColor="text-amber-500"
                defaultOpen={true}
              >
                <div className="rounded-xl bg-indigo-600 p-6 text-white">
                  <div className="text-xl font-extrabold">
                    {result.final_recommendation?.status}
                  </div>

                  <p className="mt-3 text-sm leading-7 opacity-90">
                    {result.final_recommendation?.reason}
                  </p>
                </div>
              </Accordion>
            </div>

            {/* ======================================================
                FOOTER BUTTONS
            ====================================================== */}

            <div className="pt-3 flex justify-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition">
                <Download size={16} />
                Download Report
              </button>

              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                <Share2 size={16} />
                Share Report
              </button>
            </div>

            {/* FOOTER TEXT */}

            <p className="text-center text-xs text-slate-400 pt-2">
              Your data is secure and will not be shared with third parties.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}