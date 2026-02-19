import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Create admin
    const adminExists = await User.findOne({ email: "admin@interviewai.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123456", 12);
      await User.create({
        name: "Admin User",
        email: "admin@interviewai.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin created: admin@interviewai.com / admin123456");
    } else {
      console.log("Admin already exists");
    }

    // Create test candidate
    const candidateExists = await User.findOne({ email: "test@interviewai.com" });
    if (!candidateExists) {
      const hashedPassword = await bcrypt.hash("test123456", 12);
      await User.create({
        name: "Test Candidate",
        email: "test@interviewai.com",
        password: hashedPassword,
        role: "candidate",
      });
      console.log("✅ Candidate created: test@interviewai.com / test123456");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();