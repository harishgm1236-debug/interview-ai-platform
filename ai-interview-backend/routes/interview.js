import express from "express";
import fetch from "node-fetch";
import Interview from "../models/Interview.js";
import User from "../models/user.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();
const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Start Interview
router.post("/start", protect, async (req, res) => {
  try {
    const { domain, level } = req.body;

    if (!domain) {
      return res.status(400).json({ error: "Domain is required" });
    }

    // Call FastAPI
    const response = await fetch(`${AI_URL}/interview/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, level: level || "all" }),
    });

    if (!response.ok) {
      throw new Error("AI Service unavailable");
    }

    const data = await response.json();

    // Create Interview in MongoDB
    const interview = await Interview.create({
      user: req.user._id,
      session_id: data.session_id,
      domain: data.domain,
      level: data.level || "all",
      total_questions: data.total_questions,
    });

    res.json({
      interviewId: interview._id,
      session_id: data.session_id,
      domain: data.domain,
      level: data.level,
      total_questions: data.total_questions,
      questions: data.questions,
    });
  } catch (error) {
    console.error("Start interview error:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

// Save evaluation result
router.post("/save-result", protect, async (req, res) => {
  try {
    const { interviewId, scoreData, isFinished, finalResult } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // Add answer
    if (scoreData) {
      interview.answers.push({
        question: scoreData.question,
        category: scoreData.category,
        difficulty: scoreData.difficulty,
        weight: scoreData.weight,
        transcript: scoreData.transcript,
        scores: {
          overall_marks: scoreData.overall_marks,
          overall_percentage: scoreData.overall_percentage,
          relevance: scoreData.breakdown?.relevance || 0,
          completeness: scoreData.breakdown?.completeness || 0,
          clarity: scoreData.breakdown?.clarity || 0,
          technical_accuracy: scoreData.breakdown?.technical_accuracy || 0,
          visual_confidence: scoreData.breakdown?.visual_confidence || 0,
          vocal_confidence: scoreData.breakdown?.vocal_confidence || 0,
          text_confidence: scoreData.breakdown?.text_confidence || 0,
        },
        skill_scores: scoreData.skill_scores || {},
        emotion: scoreData.emotion,
        sentiment: scoreData.sentiment,
        feedback: scoreData.feedback,
        voice_analysis: scoreData.voice_analysis || {},
        keywords: scoreData.keywords || {},
      });
    }

    // If finished, save final results
    if (isFinished && finalResult) {
      interview.completed = true;
      interview.completed_at = new Date();
      interview.average_score = finalResult.average_score;
      interview.percentage = finalResult.percentage;
      interview.skill_averages = finalResult.skill_averages;
      interview.strengths = finalResult.strengths;
      interview.weaknesses = finalResult.weaknesses;
      interview.dominant_emotion = finalResult.dominant_emotion;
      interview.grade = finalResult.grade;

      // Update user stats
      const completedCount = await Interview.countDocuments({
        user: req.user._id,
        completed: true,
      });

      const allInterviews = await Interview.find({
        user: req.user._id,
        completed: true,
      });

      const totalAvg = allInterviews.length > 0
        ? allInterviews.reduce((sum, i) => sum + (i.percentage || 0), 0) / allInterviews.length
        : finalResult.percentage;

      await User.findByIdAndUpdate(req.user._id, {
        totalInterviews: completedCount + 1,
        averageScore: Math.round(totalAvg),
      });
    }

    await interview.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Save result error:", error);
    res.status(500).json({ error: "Failed to save result" });
  }
});

// Get interview history
router.get("/history", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const interviews = await Interview.find({
      user: req.user._id,
      completed: true,
    })
      .sort({ completed_at: -1 })
      .skip(skip)
      .limit(limit)
      .select("-answers");

    const total = await Interview.countDocuments({
      user: req.user._id,
      completed: true,
    });

    res.json({
      interviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Get single interview result
router.get("/result/:id", protect, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json({ interview });
  } catch (error) {
    console.error("Result error:", error);
    res.status(500).json({ error: "Failed to fetch result" });
  }
});

// Get analytics
router.get("/analytics", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const totalInterviews = await Interview.countDocuments({
      user: userId,
      completed: true,
    });

    const interviews = await Interview.find({
      user: userId,
      completed: true,
    }).sort({ completed_at: 1 });

    if (totalInterviews === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        progression: [],
        byDomain: [],
        byLevel: [],
        skillAverages: {},
      });
    }

    const avgScore = Math.round(
      interviews.reduce((s, i) => s + (i.percentage || 0), 0) / totalInterviews
    );

    const bestScore = Math.max(...interviews.map((i) => i.percentage || 0));

    // Progression (last 20)
    const progression = interviews.slice(-20).map((i) => ({
      date: i.completed_at,
      score: i.percentage,
      domain: i.domain,
      grade: i.grade,
    }));

    // By domain
    const domainMap = {};
    interviews.forEach((i) => {
      if (!domainMap[i.domain]) {
        domainMap[i.domain] = { total: 0, count: 0 };
      }
      domainMap[i.domain].total += i.percentage || 0;
      domainMap[i.domain].count += 1;
    });
    const byDomain = Object.entries(domainMap).map(([domain, data]) => ({
      domain,
      avgScore: Math.round(data.total / data.count),
      count: data.count,
    }));

    // Average skills
    const skillTotals = { technical: 0, communication: 0, problem_solving: 0, confidence: 0 };
    interviews.forEach((i) => {
      if (i.skill_averages) {
        Object.keys(skillTotals).forEach((k) => {
          skillTotals[k] += i.skill_averages[k] || 0;
        });
      }
    });
    const skillAverages = {};
    Object.keys(skillTotals).forEach((k) => {
      skillAverages[k] = Math.round(skillTotals[k] / totalInterviews);
    });

    res.json({
      totalInterviews,
      averageScore: avgScore,
      bestScore,
      progression,
      byDomain,
      skillAverages,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;