const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/User");

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");

    const adminEmail = "admin@interhub.com";
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log("Admin already exists. Updating password...");
      const hashedPassword = await bcrypt.hash("Admin@2026", 10);
      existing.password = hashedPassword;
      existing.role = "admin";
      await existing.save();
      console.log("Admin updated successfully!");
    } else {
      console.log("Creating new admin...");
      const hashedPassword = await bcrypt.hash("Admin@2026", 10);
      await User.create({
        name: "Master Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true
      });
      console.log("Admin created successfully!");
    }

  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
}

seedAdmin();
