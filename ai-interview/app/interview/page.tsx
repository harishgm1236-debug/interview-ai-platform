"use client";

import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMic, FiMicOff, FiCamera, FiClock, FiChevronRight, 
  FiAlertCircle, FiType, FiVideo, FiSend, FiEye 
} from "react-icons/fi";
import toast from "react-hot-toast";
import { startInterview as apiStartInterview, evaluateAnswer, saveResult } from "@/lib/api";
import type { SessionData, Question, CurrentScore, EvaluationResponse } from "@/lib/types";

interface ScoreDisplayItem {
  label: string;
  value: number;
}

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get("domain") || "frontend";
  const level = searchParams.get("level") || "all";

  // --- STATE ---
  const [session, setSession] = useState<SessionData | null>(null);
  const [index, setIndex] = useState(0);
  
  // Mode: 'video' | 'text'
  const [mode, setMode] = useState<'video' | 'text'>('video');
  const [textAnswer, setTextAnswer] = useState("");
  
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [feedback, setFeedback] = useState<CurrentScore | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Timer & Proctoring
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [tabSwitches, setTabSwitches] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- CLEANUP ---
  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  useEffect(() => {
    initInterview();
    
    // Proctoring Listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        toast("⚠️ Warning: Tab switching is monitored!", { icon: "👀" });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cleanup();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cleanup]);

  // --- INITIALIZATION ---
  const initInterview = async () => {
    try {
      const data = await apiStartInterview(domain, level);
      setSession(data);
      startCamera(); // Default to video mode
    } catch (err) {
      const message = err instanceof Error ? err.message : "Initialization failed";
      toast.error(message);
    } finally {
      setInitLoading(false);
    }
  };

  // --- CAMERA CONTROL ---
  const startCamera = async () => {
    try {
      if (streamRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.warn("Camera access denied");
      toast.error("Camera access denied. Switching to Text Mode.");
      setMode('text');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const toggleMode = () => {
    if (mode === 'video') {
      setMode('text');
      stopCamera();
      setIsRecording(false);
    } else {
      setMode('video');
      startCamera();
    }
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    // Only run timer if recording (video) OR just active (text mode needs timer too?)
    // Let's run timer ALWAYS for the question
    if (loading || showFeedback) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [index, loading, showFeedback]); // Reset on new question

  useEffect(() => {
    setTimeLeft(120); // Reset timer on new question
  }, [index]);

  const handleAutoSubmit = () => {
    toast("⏰ Time's up! Submitting answer...");
    if (mode === 'video' && isRecording) {
      stopAndSubmitVideo();
    } else if (mode === 'text') {
      submitText();
    } else {
      // Force move if idle
      toast.error("No answer provided. Moving to next question.");
      nextQuestion();
    }
  };

  // --- RECORDING ---
  const startRecording = () => {
    if (!streamRef.current) return;
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start();
    setIsRecording(true);
  };

  const stopAndSubmitVideo = async () => {
    if (!mediaRecorderRef.current || !session || !videoRef.current) return;
    setLoading(true);
    setIsRecording(false);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(videoRef.current, 0, 0);
    const imageBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.8));

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      if (!imageBlob) {
        toast.error("Failed to capture frame");
        setLoading(false);
        return;
      }
      submitData("", imageBlob, audioBlob);
    };
    mediaRecorderRef.current.stop();
  };

  // --- TEXT SUBMISSION ---
  const submitText = async () => {
    if (!textAnswer.trim()) {
      // If auto-submit triggers this and empty, just skip
      if (timeLeft <= 1) {
        nextQuestion();
        return;
      }
      toast.error("Please type an answer first.");
      return;
    }
    setLoading(true);
    const dummyBlob = new Blob([""], { type: "text/plain" });
    submitData(textAnswer, dummyBlob, dummyBlob);
  };

  // --- SHARED SUBMIT LOGIC ---
  const submitData = async (text: string, img: Blob, audio: Blob) => {
    if (!session) return;
    try {
      const result: EvaluationResponse = await evaluateAnswer(
        session.session_id, index, text, img, audio
      );

      await saveResult(
        session.interviewId,
        result.current_score,
        result.finished,
        result.final_result
      );

      setFeedback(result.current_score);
      setShowFeedback(true);

      if (result.finished) {
        setTimeout(() => {
          router.push(`/report?id=${session.interviewId}&session_id=${session.session_id}`);
        }, 3000);
      }
    } catch (err) {
      toast.error("Evaluation failed.");
      console.error(err);
    } finally {
      setLoading(false);
      setTextAnswer("");
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setFeedback(null);
    setIndex(prev => prev + 1);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  if (initLoading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Loading...</div>;
  if (!session) return <div className="min-h-screen bg-dark-950 text-white p-10">Failed to load session.</div>;

  const currentQ: Question | undefined = session.questions[index];
  const progress = (index / session.total_questions) * 100;
  const feedbackScores: ScoreDisplayItem[] = feedback ? [
    { label: "Overall", value: feedback.overall_percentage },
    { label: "Relevance", value: feedback.breakdown?.relevance ?? 0 },
    { label: "Clarity", value: feedback.breakdown?.clarity ?? 0 },
    { label: "Confidence", value: feedback.breakdown?.text_confidence ?? 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden text-white">
      <div className="fixed inset-0 particles-bg opacity-10" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-xs font-bold">AI</div>
          <div>
            <p className="font-semibold text-sm capitalize">{domain} Interview</p>
            <p className="text-xs text-dark-400 capitalize">{level} Level</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${timeLeft < 30 ? "bg-red-500/20 border-red-500 text-red-400" : "bg-dark-800 border-dark-600 text-white"}`}>
             <FiClock size={14} />
             <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>

          <button 
            onClick={toggleMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-all text-sm font-medium"
          >
            {mode === 'video' ? <><FiType /> Text Mode</> : <><FiVideo /> Video Mode</>}
          </button>
          
          <div className="text-sm text-dark-300">
            Q <span className="text-white font-bold">{index + 1}</span> / {session.total_questions}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 h-1 bg-dark-800">
        <motion.div className="h-full gradient-bg" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Tab Warning */}
        {tabSwitches > 0 && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-black px-4 py-1 rounded-full text-xs font-bold z-50 flex items-center gap-2">
             <FiEye /> Focus Alert: {tabSwitches} switches detected
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Question & Feedback */}
          <div className="space-y-6">
            <motion.div key={index} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-8 neon-border">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium capitalize">{currentQ?.category || "technical"}</span>
                <span className="px-3 py-1 rounded-full bg-dark-800 text-dark-300 text-xs font-medium capitalize">{currentQ?.difficulty || "medium"}</span>
              </div>
              <h2 className="text-xl font-semibold leading-relaxed">{currentQ?.q}</h2>
            </motion.div>

            <AnimatePresence>
              {showFeedback && feedback && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 border-l-4 border-primary-500">
                  <h3 className="font-semibold text-primary-400 mb-3">📝 AI Feedback</h3>
                  <p className="text-sm text-dark-200 mb-4">{feedback.feedback}</p>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {feedbackScores.map((s, i) => (
                      <div key={i} className="text-center p-2 rounded-lg bg-dark-900/50">
                        <p className={`text-lg font-bold ${getScoreColor(s.value)}`}>{Math.round(s.value)}%</p>
                        <p className="text-[10px] text-dark-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={nextQuestion} className="btn-primary mt-4 flex items-center gap-2">Next Question <FiChevronRight /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Input Area (Video or Text) */}
          <div className="space-y-6">
            {mode === 'video' ? (
              // VIDEO MODE
              <>
                <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative aspect-video bg-dark-900 rounded-2xl overflow-hidden border-2 border-dark-700">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                  {isRecording && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 backdrop-blur px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-xs font-bold">REC</span>
                    </motion.div>
                  )}
                  {!streamRef.current && <div className="absolute inset-0 flex items-center justify-center"><p className="text-dark-400">Starting Camera...</p></div>}
                </motion.div>

                <div className="flex flex-col items-center gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    disabled={loading || showFeedback}
                    onClick={isRecording ? stopAndSubmitVideo : startRecording}
                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isRecording ? "bg-red-500 hover:bg-red-600" : "gradient-bg"}`}
                  >
                    {loading ? "Analyzing..." : isRecording ? <><FiMicOff /> Stop & Submit</> : <><FiMic /> Start Recording</>}
                  </motion.button>
                </div>
              </>
            ) : (
              // TEXT MODE
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={loading || showFeedback}
                    className="w-full h-64 bg-dark-800/50 border border-dark-700 rounded-2xl p-6 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none text-lg leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-dark-500">
                    {textAnswer.length} chars
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={loading || showFeedback || !textAnswer.trim()}
                  onClick={submitText}
                  className="w-full py-4 rounded-xl font-bold text-lg gradient-bg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
                >
                  {loading ? "Analyzing Text..." : <><FiSend /> Submit Answer</>}
                </motion.button>
              </motion.div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Loading...</div>}>
      <InterviewContent />
    </Suspense>
  );
}