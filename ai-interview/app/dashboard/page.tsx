"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay, FiClock, FiTrendingUp, FiAward, FiLogOut,
  FiBarChart2, FiUser, FiChevronRight, FiZap, FiTarget, FiArrowRight
} from "react-icons/fi";
import { getAnalytics, getHistory } from "@/lib/api";
import type {
  User, AnalyticsData, InterviewRecord,
  DomainOption, LevelOption
} from "@/lib/types";
import type { IconType } from "react-icons";

// --- Config ---
const domains: DomainOption[] = [
  { name: "Frontend", value: "frontend", emoji: "🎨", color: "from-blue-500 to-cyan-500", desc: "React, CSS, JavaScript" },
  { name: "Backend", value: "backend", emoji: "🛠️", color: "from-green-500 to-emerald-500", desc: "Node.js, APIs, Databases" },
  { name: "Fullstack", value: "fullstack", emoji: "💻", color: "from-purple-500 to-pink-500", desc: "End-to-end Development" },
  { name: "Data Science", value: "datascience", emoji: "📊", color: "from-orange-500 to-red-500", desc: "ML, Analytics, Python" },
  { name: "DevOps", value: "devops", emoji: "⚙️", color: "from-yellow-500 to-orange-500", desc: "CI/CD, Cloud, Docker" },
];

const levels: LevelOption[] = [
  { name: "Easy", value: "easy", desc: "Background & Behavioral", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  { name: "Medium", value: "medium", desc: "Technical & Domain", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  { name: "Hard", value: "hard", desc: "Project & Problem Solving", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  { name: "All Rounds", value: "all", desc: "Complete Interview (15 Qs)", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
];

interface StatItem {
  label: string;
  value: string | number;
  icon: IconType;
  color: string;
}

export default function Dashboard() {
  const router = useRouter();
  
  // Initialize with null to ensure Server & Client match initially
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentHistory, setRecentHistory] = useState<InterviewRecord[]>([]);
  const [showSetup, setShowSetup] = useState(false);

  // 1. Single Effect for Auth & Data Loading
  useEffect(() => {
    let isMounted = true;

    const initDashboard = async () => {
      // Auth Check
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        if (isMounted) setUser(parsedUser);

        // Load Data
        const [analyticsData, historyData] = await Promise.all([
          getAnalytics().catch(() => null),
          getHistory(1, 5).catch(() => ({ interviews: [], pagination: { page: 1, limit: 5, total: 0, pages: 0 } })),
        ]);

        if (isMounted) {
          if (analyticsData) setAnalytics(analyticsData);
          setRecentHistory(historyData.interviews || []);
          setIsLoading(false); // Only set loading to false at the end
        }
      } catch (err) {
        console.error("Initialization error:", err);
        router.push("/login");
      }
    };

    initDashboard();

    return () => { isMounted = false; };
  }, [router]);

  const startInterview = () => {
    if (!selectedDomain) return;
    router.push(`/interview?domain=${selectedDomain}&level=${selectedLevel}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Prevent Hydration Mismatch & Flash of Content
  if (isLoading || !user) {
    return <div className="min-h-screen bg-dark-950" />; 
  }

  const stats: StatItem[] = [
    { label: "Interviews", value: analytics?.totalInterviews || 0, icon: FiClock, color: "from-blue-500 to-cyan-500" },
    { label: "Avg Score", value: `${analytics?.averageScore || 0}%`, icon: FiTrendingUp, color: "from-green-500 to-emerald-500" },
    { label: "Best Score", value: `${analytics?.bestScore || 0}%`, icon: FiAward, color: "from-purple-500 to-pink-500" },
  ];

  const getScoreColor = (score: number): string => score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
  const getGradeColor = (grade: string): string => grade?.startsWith("A") ? "text-green-400" : grade?.startsWith("B") ? "text-blue-400" : "text-yellow-400";

  return (
    <div className="min-h-screen bg-dark-950 relative">
      <div className="fixed inset-0 particles-bg opacity-20" />

      {/* Top Bar */}
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center font-bold text-sm">AI</div>
          <span className="text-lg font-bold hidden sm:block">InterviewAI</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/history")} className="btn-ghost text-sm flex items-center gap-1"><FiClock size={16} /> History</button>
          <button onClick={() => router.push("/analytics")} className="btn-ghost text-sm flex items-center gap-1"><FiBarChart2 size={16} /> Analytics</button>
          {user.role === "admin" && (
            <button onClick={() => router.push("/admin")} className="btn-ghost text-sm flex items-center gap-1"><FiZap size={16} /> Admin</button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-700">
            <FiUser size={14} className="text-primary-400" />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-dark-800 text-dark-400 hover:text-red-400 transition-colors"><FiLogOut size={18} /></button>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="gradient-text">{user.name}</span> 👋</h1>
          <p className="text-dark-400">Ready to ace your next interview?</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}><stat.icon size={22} className="text-white" /></div>
              <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-dark-400">{stat.label}</p></div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
          <button onClick={() => setShowSetup(!showSetup)} className="w-full glass-card-hover p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><FiPlay size={24} className="text-white ml-1" /></div>
              <div className="text-left"><h2 className="text-xl font-bold">Start New Interview</h2><p className="text-dark-400 text-sm">Choose your domain and difficulty level</p></div>
            </div>
            <motion.div animate={{ rotate: showSetup ? 90 : 0 }}><FiChevronRight size={24} className="text-dark-400" /></motion.div>
          </button>
        </motion.div>

        <AnimatePresence>
          {showSetup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
              <div className="glass-card p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiTarget className="text-primary-400" /> Select Domain</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {domains.map((domain, i) => (
                      <motion.button key={domain.value} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedDomain(domain.value)} className={`p-5 rounded-2xl border-2 text-center transition-all ${selectedDomain === domain.value ? "border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20" : "border-dark-700 hover:border-dark-500 bg-dark-800/50"}`}>
                        <span className="text-3xl block mb-2">{domain.emoji}</span><p className="font-semibold text-sm">{domain.name}</p><p className="text-xs text-dark-400 mt-1">{domain.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiZap className="text-primary-400" /> Select Difficulty</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {levels.map((level, i) => (
                      <motion.button key={level.value} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedLevel(level.value)} className={`p-4 rounded-2xl border-2 text-center transition-all ${selectedLevel === level.value ? `${level.bg} border-2` : "border-dark-700 bg-dark-800/50"}`}>
                        <p className={`font-semibold ${selectedLevel === level.value ? level.color : ""}`}>{level.name}</p><p className="text-xs text-dark-400 mt-1">{level.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startInterview} disabled={!selectedDomain} className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3">🚀 Launch Interview <FiArrowRight /></motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-semibold">Recent Interviews</h2><button onClick={() => router.push("/history")} className="text-sm text-primary-400 hover:underline">View All →</button></div>
          {recentHistory.length === 0 ? (
            <div className="text-center py-12"><div className="text-5xl mb-4">🎯</div><p className="text-dark-400 mb-4">No interviews yet. Start your first one!</p><button onClick={() => setShowSetup(true)} className="btn-primary">Start Interview</button></div>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((interview: InterviewRecord, i: number) => (
                <motion.div key={interview._id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} onClick={() => router.push(`/report?id=${interview._id}`)} className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 hover:bg-dark-700/50 cursor-pointer transition-all border border-dark-700/50 hover:border-dark-600">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{domains.find(d => d.value === interview.domain)?.emoji || "📋"}</span>
                    <div><p className="font-medium capitalize">{interview.domain?.replace("_", " ")}</p><p className="text-xs text-dark-400">{new Date(interview.completed_at).toLocaleDateString()} • {interview.level}</p></div>
                  </div>
                  <div className="flex items-center gap-4"><div className="text-right"><p className={`text-lg font-bold ${getScoreColor(interview.percentage || 0)}`}>{interview.percentage || 0}%</p><p className={`text-xs ${getGradeColor(interview.grade || "")}`}>Grade: {interview.grade || "N/A"}</p></div><FiChevronRight className="text-dark-500" /></div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}