import express from "express";
import User from "../models/user.js";
import Interview from "../models/Interview.js";
import { protect, adminOnly } from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

// Admin Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "candidate" });
    const totalInterviews = await Interview.countDocuments({ completed: true });

    const avgScore = await Interview.aggregate([
      { $match: { completed: true } },
      { $group: { _id: null, avg: { $avg: "$percentage" } } },
    ]);

    const recentInterviews = await Interview.find({ completed: true })
      .sort({ completed_at: -1 })
      .limit(10)
      .populate("user", "name email");

    const domainStats = await Interview.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: "$domain",
          avgScore: { $avg: "$percentage" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalInterviews,
      averageScore: avgScore[0]?.avg || 0,
      recentInterviews,
      domainStats,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;