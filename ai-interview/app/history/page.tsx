"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { getHistory } from "@/lib/api";
import type { InterviewRecord, HistoryResponse } from "@/lib/types";

const domainEmojis: Record<string, string> = {
  frontend: "🎨", backend: "🛠️", fullstack: "💻",
  datascience: "📊", devops: "⚙️"
};

export default function HistoryPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data: HistoryResponse = await getHistory(page, 10);
      setInterviews(data.interviews);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setLoading(false);
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
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-dark-950 relative">
      <div className="fixed inset-0 particles-bg opacity-10" />

      <header className="relative z-10 flex items-center gap-4 px-6 py-4 border-b border-dark-800">
        <button onClick={() => router.push("/dashboard")} className="text-dark-300 hover:text-white">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Interview History</h1>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-20">
            <FiClock size={48} className="mx-auto text-dark-600 mb-4" />
            <p className="text-dark-400 mb-4">No completed interviews yet</p>
            <button onClick={() => router.push("/dashboard")} className="btn-primary">
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview: InterviewRecord, i: number) => (
              <motion.div
                key={interview._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/report?id=${interview._id}`)}
                className="glass-card-hover p-5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{domainEmojis[interview.domain] || "📋"}</span>
                  <div>
                    <p className="font-semibold capitalize">{interview.domain?.replace("_", " ")}</p>
                    <p className="text-xs text-dark-400">
                      {new Date(interview.completed_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                      })} • {interview.level} • {interview.total_questions || "?"} questions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getScoreColor(interview.percentage || 0)}`}>
                      {interview.percentage || 0}%
                    </p>
                    <p className={`text-xs font-medium ${getGradeColor(interview.grade || "")}`}>
                      Grade: {interview.grade || "N/A"}
                    </p>
                  </div>
                  <FiChevronRight className="text-dark-500" />
                </div>
              </motion.div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm disabled:opacity-30"
                >
                  Previous
                </button>
                <span className="flex items-center text-sm text-dark-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary text-sm disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}