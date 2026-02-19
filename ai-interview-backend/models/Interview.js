import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  question: String,
  category: String,
  difficulty: String,
  weight: Number,
  transcript: String,
  scores: {
    overall_marks: { type: Number, default: 0 },
    overall_percentage: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    technical_accuracy: { type: Number, default: 0 },
    visual_confidence: { type: Number, default: 0 },
    vocal_confidence: { type: Number, default: 0 },
    text_confidence: { type: Number, default: 0 },
  },
  skill_scores: {
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    problem_solving: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
  },
  emotion: String,
  sentiment: String,
  feedback: String,
  voice_analysis: {
    wpm: Number,
    pace: String,
    duration: Number,
  },
  keywords: {
    matched: [String],
    missed: [String],
  },
});

const InterviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session_id: { type: String, required: true },
    domain: { type: String, required: true },
    level: { type: String, default: "all" },
    answers: [AnswerSchema],
    total_questions: { type: Number, default: 0 },
    average_score: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    skill_averages: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problem_solving: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
    },
    strengths: [String],
    weaknesses: [String],
    dominant_emotion: String,
    grade: String,
    completed: { type: Boolean, default: false },
    started_at: { type: Date, default: Date.now },
    completed_at: Date,
  },
  { timestamps: true }
);

const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
export default Interview;