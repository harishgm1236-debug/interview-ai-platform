"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiCpu, FiCheckCircle, FiArrowRight, FiVideo, FiBarChart2, FiMic } from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      title: "AI Mock Interviews",
      desc: "Experience realistic interview simulations with real-time audio and video analysis.",
      icon: FiVideo,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Instant Feedback",
      desc: "Get immediate AI-driven feedback on your answers, clarity, and confidence.",
      icon: FiMic,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Smart Analytics",
      desc: "Track your progress with detailed performance reports and skill breakdowns.",
      icon: FiBarChart2,
      color: "from-purple-500 to-pink-500",
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-white relative overflow-hidden font-sans">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-950 to-dark-950" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-10 pb-32 max-w-7xl">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center mb-20">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-lg">AI</div>
            InterviewAI
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push('/login')} className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">Log In</button>
            <button onClick={() => router.push('/register')} className="px-6 py-2 rounded-full bg-white text-dark-950 font-bold hover:bg-slate-200 transition-colors text-sm">Sign Up</button>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">AI-Powered Evaluation 2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
            Master Your <br />
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Technical Interview</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Practice mock interviews with real-time AI feedback on your answers, confidence, and body language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/login')} 
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/20 hover:scale-105 hover:shadow-primary-500/40 transition-all flex items-center gap-2"
            >
              Get Started Free <FiArrowRight />
            </button>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {features.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              whileHover={{ y: -8 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              {/* Subtle Gradient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="text-2xl" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-slate-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 font-medium"
        >
          <div className="flex items-center gap-2"><FiCheckCircle className="text-primary-500" /> Real-time Feedback</div>
          <div className="flex items-center gap-2"><FiCheckCircle className="text-primary-500" /> 5+ Tech Domains</div>
          <div className="flex items-center gap-2"><FiCheckCircle className="text-primary-500" /> Secure & Private</div>
        </motion.div>

      </div>
    </div>
  );
}