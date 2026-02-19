"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiTrendingUp, FiAward, FiTarget, FiClock } from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, BarChart, Bar, Cell
} from "recharts";
import CountUp from "react-countup";
import { getAnalytics } from "@/lib/api";
import type {
  AnalyticsData,
  ProgressionPoint,
  DomainStat
} from "@/lib/types";
import type { IconType } from "react-icons";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

// ---- Local Types ----
interface SkillChartItem {
  skill: string;
  score: number;
}

interface ProgressionChartItem {
  date: string;
  score: number;
}

interface DomainChartItem {
  domain: string;
  score: number;
  count: number;
}

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: IconType;
  color: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const result = await getAnalytics();
      setData(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load analytics";
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.totalInterviews === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center">
        <FiTarget size={48} className="text-dark-600 mb-4" />
        <p className="text-xl font-semibold mb-2">No Analytics Yet</p>
        <p className="text-dark-400 mb-6">Complete some interviews to see your analytics</p>
        <button onClick={() => router.push("/dashboard")} className="btn-primary">
          Start Interview
        </button>
      </div>
    );
  }

  // Transform data for charts with proper types
  const skillData: SkillChartItem[] = Object.entries(data.skillAverages || {}).map(
    ([key, value]: [string, number]) => ({
      skill: key.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
      score: Math.round(value),
    })
  );

  const progressionData: ProgressionChartItem[] = (data.progression || []).map(
    (p: ProgressionPoint) => ({
      date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: Math.round(p.score),
    })
  );

  const domainData: DomainChartItem[] = (data.byDomain || []).map(
    (d: DomainStat) => ({
      domain: d.domain.replace("_", " "),
      score: d.avgScore,
      count: d.count,
    })
  );

  const stats: StatItem[] = [
    { label: "Total Interviews", value: data.totalInterviews, icon: FiClock, color: "from-blue-500 to-cyan-500" },
    { label: "Average Score", value: data.averageScore, suffix: "%", icon: FiTrendingUp, color: "from-green-500 to-emerald-500" },
    { label: "Best Score", value: data.bestScore, suffix: "%", icon: FiAward, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-dark-950 relative">
      <div className="fixed inset-0 particles-bg opacity-10" />

      <header className="relative z-10 flex items-center gap-4 px-6 py-4 border-b border-dark-800">
        <button onClick={() => router.push("/dashboard")} className="text-dark-300 hover:text-white">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Performance Analytics</h1>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat: StatItem, i: number) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  <CountUp end={stat.value} duration={1.5} />{stat.suffix || ""}
                </p>
                <p className="text-sm text-dark-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progression */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Score Progression</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Radar */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Skill Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* By Domain */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold mb-4">Performance by Domain</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="domain" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {domainData.map((_entry: DomainChartItem, i: number) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </main>
    </div>
  );
}