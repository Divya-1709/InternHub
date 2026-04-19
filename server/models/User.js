const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ["student", "company", "admin"],
    required: true
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  googleId: {
    type: String
  },
  avatar: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false   // used mainly for company verification
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
