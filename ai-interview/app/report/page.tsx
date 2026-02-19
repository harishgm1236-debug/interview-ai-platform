"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowLeft, FiAward, FiTarget, FiTrendingUp,
  FiSmile, FiMic, FiBookOpen, FiBarChart2, FiDownload
} from "react-icons/fi";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from "recharts";
import CountUp from "react-countup";
import { getInterviewResult, getSessionData } from "@/lib/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import type {
  InterviewRecord, SessionResponse, FinalResult,
  SkillChartData, QuestionScoreData, CurrentScore, AnswerRecord
} from "@/lib/types";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

interface StatDisplayItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

interface MetricItem {
  label: string;
  value: number;
}

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const interviewId = searchParams.get("id");
  const sessionId = searchParams.get("session_id");
  
  const reportRef = useRef<HTMLDivElement>(null); // Ref for PDF capture

  const [interview, setInterview] = useState<InterviewRecord | null>(null);
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      if (interviewId) {
        const result = await getInterviewResult(interviewId);
        setInterview(result.interview);
      }
      if (sessionId) {
        const session = await getSessionData(sessionId);
        setSessionData(session);
      }
    } catch (err) {
      console.error("Report load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      // 1. Capture the element
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // High resolution
        backgroundColor: "#020617", // Ensure dark background
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 2. Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 3. Add extra pages if long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Interview-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF Downloaded!", { id: toastId });
    } catch (err) {
      console.error("PDF Error:", err);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getGradeColor = (grade: string): string => {
    if (grade?.startsWith("A")) return "text-green-400";
    if (grade?.startsWith("B")) return "text-blue-400";
    if (grade?.startsWith("C")) return "text-yellow-400";
    return "text-red-400";
  };

  const getGradeBorderClass = (grade: string): string => {
    if (grade?.startsWith("A")) return "bg-green-500/10 border border-green-500/30";
    if (grade?.startsWith("B")) return "bg-blue-500/10 border border-blue-500/30";
    return "bg-yellow-500/10 border border-yellow-500/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full" />
      </div>
    );
  }

  const reportDomain = interview?.domain || sessionData?.domain || "unknown";
  const reportLevel = interview?.level || sessionData?.level || "all";
  const scores: CurrentScore[] = sessionData?.scores || [];
  const answerRecords: AnswerRecord[] = interview?.answers || [];

  const finalResult: FinalResult = sessionData?.final_result || {
    percentage: interview?.percentage || 0,
    average_score: interview?.average_score || 0,
    total_marks: 0,
    total_questions: interview?.total_questions || 0,
    max_possible: (interview?.total_questions || 0) * 10,
    grade: interview?.grade || "N/A",
    skill_averages: interview?.skill_averages || { technical: 0, communication: 0, problem_solving: 0, confidence: 0 },
    strengths: interview?.strengths || [],
    weaknesses: interview?.weaknesses || [],
    dominant_emotion: interview?.dominant_emotion || "neutral",
  };

  const skillData: SkillChartData[] = Object.entries(finalResult.skill_averages || {}).map(
    ([key, value]: [string, number]) => ({
      skill: key.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
      score: Math.round(value),
      fullMark: 100,
    })
  );

  const questionScores: QuestionScoreData[] = scores.length > 0
    ? scores.map((s: CurrentScore, i: number) => ({ name: `Q${i + 1}`, score: Math.round(s.overall_percentage || (s.overall_marks || 0) * 10), category: s.category || "" }))
    : answerRecords.map((a: AnswerRecord, i: number) => ({ name: `Q${i + 1}`, score: Math.round(a.scores?.overall_percentage || (a.scores?.overall_marks || 0) * 10), category: a.category || "" }));

  const displayStats: StatDisplayItem[] = [
    { icon: FiTarget, label: "Questions", value: scores.length || answerRecords.length, color: "from-blue-500 to-cyan-500" },
    { icon: FiSmile, label: "Emotion", value: finalResult.dominant_emotion, color: "from-purple-500 to-pink-500" },
    { icon: FiTrendingUp, label: "Avg Score", value: `${finalResult.average_score}/10`, color: "from-green-500 to-emerald-500" },
    { icon: FiMic, label: "Grade", value: finalResult.grade, color: "from-orange-500 to-red-500" },
  ];

  const detailedScores = scores.length > 0 ? scores : answerRecords.map((a: AnswerRecord): CurrentScore => ({
    question: a.question, question_index: 0, category: a.category, difficulty: a.difficulty, weight: a.weight, transcript: a.transcript,
    overall_marks: a.scores.overall_marks, overall_percentage: a.scores.overall_percentage, emotion: a.emotion, emotion_details: {}, sentiment: a.sentiment,
    feedback: a.feedback,
    breakdown: { technical_accuracy: a.scores.technical_accuracy, relevance: a.scores.relevance, completeness: a.scores.completeness, clarity: a.scores.clarity, visual_confidence: a.scores.visual_confidence, vocal_confidence: a.scores.vocal_confidence, text_confidence: a.scores.text_confidence },
    skill_scores: a.skill_scores, voice_analysis: a.voice_analysis, keywords: a.keywords,
  }));

  return (
    <div className="min-h-screen bg-dark-950 relative">
      <div className="fixed inset-0 particles-bg opacity-10" />

      <header className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-dark-800">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-dark-300 hover:text-white transition-colors">
          <FiArrowLeft /> Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
          >
            {downloading ? "Generating..." : <><FiDownload /> Download PDF</>}
          </button>
        </div>
      </header>

      {/* Capture Area */}
      <main ref={reportRef} className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8 bg-dark-950">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold gradient-text">Interview Performance Report</h1>
          <p className="text-dark-400 text-sm mt-1">{new Date().toLocaleDateString()} • {reportDomain.toUpperCase()}</p>
        </div>

        {/* Score Card */}
        <div className="glass-card p-10 text-center neon-border">
          <p className="text-dark-400 mb-2 capitalize">{reportDomain.replace("_", " ")} • {reportLevel} Level</p>
          <div className="relative w-40 h-40 mx-auto my-6">
            <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
              <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={finalResult.percentage >= 70 ? "#22c55e" : finalResult.percentage >= 50 ? "#eab308" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round" initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: `${finalResult.percentage}, 100` }} transition={{ duration: 2, ease: "easeOut" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(finalResult.percentage)}`}>
                <CountUp end={Math.round(finalResult.percentage)} duration={2} />%
              </span>
              <span className="text-xs text-dark-400">Overall Score</span>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full ${getGradeBorderClass(finalResult.grade)}`}>
            <FiAward className={getGradeColor(finalResult.grade)} />
            <span className={`text-xl font-bold ${getGradeColor(finalResult.grade)}`}>Grade: {finalResult.grade}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat: StatDisplayItem, i: number) => (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}><stat.icon size={20} className="text-white" /></div>
              <div><p className="text-lg font-bold capitalize">{stat.value}</p><p className="text-xs text-dark-400">{stat.label}</p></div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiTarget className="text-primary-400" /> Skill Breakdown</h3>
            {skillData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : <p className="text-dark-400 text-center py-10">No skill data available</p>}
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiBarChart2 className="text-primary-400" /> Question Scores</h3>
            {questionScores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {questionScores.map((_: QuestionScoreData, i: number) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-dark-400 text-center py-10">No data available</p>}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><FiBookOpen className="text-primary-400" /> Detailed Answer Analysis</h3>
          <div className="space-y-4">
            {detailedScores.map((score: CurrentScore, i: number) => {
              const overallPct = score.overall_percentage || (score.overall_marks || 0) * 10;
              const metrics: MetricItem[] = [
                { label: "Relevance", value: score.breakdown?.relevance ?? 0 },
                { label: "Completeness", value: score.breakdown?.completeness ?? 0 },
                { label: "Clarity", value: score.breakdown?.clarity ?? 0 },
                { label: "Confidence", value: score.breakdown?.text_confidence ?? 0 },
              ];
              return (
                <div key={i} className="p-5 rounded-xl bg-dark-800/50 border border-dark-700/50 page-break-inside-avoid">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 capitalize">{score.category || "technical"}</span>
                        <span className="text-xs text-dark-500">Q{i + 1}</span>
                      </div>
                      <p className="font-medium text-sm">{score.question || `Question ${i + 1}`}</p>
                    </div>
                    <span className={`text-xl font-bold ${getScoreColor(overallPct)}`}>{Math.round(overallPct)}%</span>
                  </div>
                  {score.transcript && (
                    <div className="p-3 rounded-lg bg-dark-900/50 mb-3">
                      <p className="text-xs text-dark-400 mb-1">Your Answer:</p>
                      <p className="text-sm text-dark-200">{score.transcript}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                    {metrics.map((metric: MetricItem, j: number) => (
                      <div key={j} className="text-center p-2 rounded-lg bg-dark-900/30">
                        <p className={`text-sm font-bold ${getScoreColor(metric.value)}`}>{Math.round(metric.value)}%</p>
                        <p className="text-[10px] text-dark-500">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  {score.feedback && <p className="text-xs text-dark-300 italic">{score.feedback}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>}>
      <ReportContent />
    </Suspense>
  );
}