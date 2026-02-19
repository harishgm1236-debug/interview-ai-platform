// =================== AUTH ===================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "candidate" | "admin";
  avatar?: string;
  totalInterviews?: number;
  averageScore?: number;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// =================== INTERVIEW ===================
export interface Question {
  q: string;
  category?: string;
  difficulty?: string;
  weight?: number;
}

export interface SessionData {
  interviewId: string;
  session_id: string;
  domain: string;
  level: string;
  total_questions: number;
  questions: Question[];
}

export interface VoiceAnalysis {
  wpm: number;
  pace: string;
  duration: number;
}

export interface Keywords {
  matched: string[];
  missed: string[];
}

export interface ScoreBreakdown {
  technical_accuracy: number;
  relevance: number;
  completeness: number;
  clarity: number;
  visual_confidence: number;
  vocal_confidence: number;
  text_confidence: number;
}

export interface SkillScores {
  technical: number;
  communication: number;
  problem_solving: number;
  confidence: number;
}

export interface CurrentScore {
  question: string;
  question_index: number;
  category: string;
  difficulty: string;
  weight: number;
  transcript: string;
  overall_marks: number;
  overall_percentage: number;
  emotion: string;
  emotion_details: Record<string, number>;
  sentiment: string;
  feedback: string;
  breakdown: ScoreBreakdown;
  skill_scores: SkillScores;
  voice_analysis: VoiceAnalysis;
  keywords: Keywords;
}

export interface EvaluationProgress {
  current: number;
  total: number;
  percentage: number;
}

export interface FinalResult {
  total_marks: number;
  average_score: number;
  percentage: number;
  total_questions: number;
  max_possible: number;
  skill_averages: SkillScores;
  strengths: string[];
  weaknesses: string[];
  dominant_emotion: string;
  grade: string;
}

export interface EvaluationResponse {
  finished: boolean;
  current_score: CurrentScore;
  progress?: EvaluationProgress;
  final_result?: FinalResult;
  all_scores?: CurrentScore[];
}

// =================== HISTORY ===================
export interface AnswerRecord {
  question: string;
  category: string;
  difficulty: string;
  weight: number;
  transcript: string;
  scores: {
    overall_marks: number;
    overall_percentage: number;
    relevance: number;
    completeness: number;
    clarity: number;
    technical_accuracy: number;
    visual_confidence: number;
    vocal_confidence: number;
    text_confidence: number;
  };
  skill_scores: SkillScores;
  emotion: string;
  sentiment: string;
  feedback: string;
  voice_analysis: VoiceAnalysis;
  keywords: Keywords;
}

export interface InterviewRecord {
  _id: string;
  user: string;
  session_id: string;
  domain: string;
  level: string;
  total_questions: number;
  average_score: number;
  percentage: number;
  skill_averages: SkillScores;
  strengths: string[];
  weaknesses: string[];
  dominant_emotion: string;
  grade: string;
  completed: boolean;
  started_at: string;
  completed_at: string;
  createdAt: string;
  answers: AnswerRecord[];
}

export interface HistoryResponse {
  interviews: InterviewRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// =================== ANALYTICS ===================
export interface ProgressionPoint {
  date: string;
  score: number;
  domain: string;
  grade: string;
}

export interface DomainStat {
  domain: string;
  avgScore: number;
  count: number;
}

export interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  progression: ProgressionPoint[];
  byDomain: DomainStat[];
  skillAverages: SkillScores;
}

// =================== ADMIN ===================
export interface AdminDashboard {
  totalUsers: number;
  totalInterviews: number;
  averageScore: number;
  recentInterviews: InterviewRecord[];
  domainStats: DomainStat[];
}

export interface AdminUsersResponse {
  users: User[];
}

// =================== SESSION (AI Service) ===================
export interface SessionQuestion {
  q: string;
  keywords?: string[];
  model_answer?: string;
  weight?: number;
  category?: string;
  difficulty?: string;
}

export interface SessionResponse {
  session_id: string;
  domain: string;
  level: string;
  questions: SessionQuestion[];
  scores: CurrentScore[];
  total_questions: number;
  final_result?: FinalResult;
}

// =================== CHART DATA ===================
export interface SkillChartData {
  skill: string;
  score: number;
  fullMark?: number;
}

export interface QuestionScoreData {
  name: string;
  score: number;
  category: string;
}

export interface ProgressionChartData {
  date: string;
  score: number;
}

export interface DomainChartData {
  domain: string;
  score: number;
  count: number;
}

// =================== UI TYPES ===================
export interface DomainOption {
  name: string;
  value: string;
  emoji: string;
  color: string;
  desc: string;
}

export interface LevelOption {
  name: string;
  value: string;
  desc: string;
  color: string;
  bg: string;
}