'use client';

import React from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, 
  ResponsiveContainer 
} from 'recharts';
// Use the shared type we created in types/interview.ts
import { InterviewResult } from '@/lib/types';

export default function ReportDashboard({ results }: { results: InterviewResult }) {
  if (!results || !results.scores?.length) {
    return (
      <main className="min-h-screen bg-[#030406] flex items-center justify-center text-white">
        <p>No interview data found.</p>
      </main>
    );
  }

  // Calculate Averages
  const avgTech: number = results.scores.reduce((acc, curr) => acc + curr.breakdown.technical_accuracy, 0) / results.scores.length;
  const avgVisual: number = results.scores.reduce((acc, curr) => acc + curr.breakdown.visual_confidence, 0) / results.scores.length;
  const avgVocal: number = results.scores.reduce((acc, curr) => acc + curr.breakdown.vocal_confidence, 0) / results.scores.length;

  const chartData = [
    { subject: 'Technical', A: avgTech * 10, fullMark: 100 },
    { subject: 'Visual', A: avgVisual * 10, fullMark: 100 },
    { subject: 'Vocal', A: avgVocal * 10, fullMark: 100 },
  ];

  return (
    <main className="min-h-screen bg-[#030406] text-slate-200 selection:bg-cyan-500/30 p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Interview Analysis
            </h1>
            <p className="text-slate-500 mt-2 font-mono">ID: {results.session_id}</p>
          </div>
          <button 
            onClick={() => window.open(`http://localhost:8000/interview/download-pdf/${results.session_id}`)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Download PDF
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md h-[400px]">
            <h3 className="text-xl font-bold mb-4">Competency Map</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                <Radar
                  name="Candidate"
                  dataKey="A"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <StatCard title="Technical" value={avgTech} color="text-cyan-400" />
            <StatCard title="Visual Confidence" value={avgVisual} color="text-purple-400" />
            <StatCard title="Speech Quality" value={avgVocal} color="text-green-400" />
          </div>
        </div>

        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-8">Detailed Feedback</h2>
          <div className="space-y-6">
            {results.scores.map((score, i) => (
              <div key={i} className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-slate-300">Q{i+1}: {results.questions[i]?.q}</h4>
                  <span className="text-cyan-400 font-mono text-lg">{score.overall_marks.toFixed(1)}/10</span>
                </div>
                <div className="flex gap-4">
                  <span className="bg-slate-900 px-3 py-1 rounded-md text-xs border border-slate-700">
                    Mood: <span className="uppercase text-cyan-500">{score.emotion_detected}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const percentage = Math.min(Math.max((value / 10) * 100, 0), 100);
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
      <p className="text-slate-500 text-sm mb-1">{title}</p>
      <div className="flex items-center gap-4">
        <h2 className={`text-4xl font-black ${color}`}>{percentage.toFixed(0)}%</h2>
        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-current ${color}`} 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    </div>
  );
}