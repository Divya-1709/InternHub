const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { sendEmail } = require("../utils/email");

const getGoogleClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return null;
  }

  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
};

const getFrontendBaseUrl = () => process.env.FRONTEND_URL || "http://localhost:3000";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

const getSafeUserPayload = (user) => ({
  token: signToken(user),
  role: user.role,
  userId: user._id,
  name: user.name,
  email: user.email
});

// REGISTER
exports.register = async (req, res) => {
  try {
    console.log("Register request:", req.body);
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (userExists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      authProvider: "local"
    });

    console.log("User created:", user.email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Register error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    console.log("Login request:", req.body);
    const { email, password, role } = req.body;

    console.log("Searching for email:", email);
    console.log("User model:", User.collection.name);
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    console.log("User found:", user ? user.email : "null");
    console.log("All users in DB:", await User.find({}, 'email role'));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is registered as ${user.role}` });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google sign-in. Continue with Google instead." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful for:", user.email);
    res.status(200).json(getSafeUserPayload(user));
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;
    const googleClient = getGoogleClient();

    if (!googleClient || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google sign-in is not configured on the server" });
    }

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Google account email is unavailable" });
    }

    let user = await User.findOne({ email: new RegExp(`^${payload.email}$`, "i") });

    if (user) {
      if (role && user.role !== role) {
        return res.status(403).json({ message: `This Google account is already linked to a ${user.role} profile` });
      }

      user.googleId = payload.sub;
      user.avatar = payload.picture || user.avatar;
      user.authProvider = "google";
      await user.save();
    } else {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        role: role || "student",
        authProvider: "google",
        googleId: payload.sub,
        avatar: payload.picture
      });
    }

    return res.status(200).json(getSafeUserPayload(user));
  } catch (error) {
    console.log("Google auth error:", error.message);
    return res.status(500).json({ message: "Google sign-in failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });
    if (!user) {
      return res.status(200).json({ message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password-reset",
        nonce: crypto.randomBytes(16).toString("hex")
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `${getFrontendBaseUrl()}/reset-password?token=${resetToken}`;

    const { simulated } = await sendEmail({
      to: user.email,
      subject: "Reset your InternHub password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
          <h2>Reset your password</h2>
          <p>We received a request to reset the password for your InternHub account.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 18px; background: #111111; color: #ffffff; text-decoration: none; border-radius: 10px;">
              Reset password
            </a>
          </p>
          <p>This link will expire in 15 minutes.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `
    });

    console.log(`Password reset link for ${user.email}: ${resetUrl}`);

    return res.status(200).json({
      message: "If an account exists, a reset link has been sent.",
      previewUrl: simulated ? resetUrl : undefined
    });
  } catch (error) {
    console.log("Forgot password error:", error.message);
    return res.status(500).json({ message: "Unable to process password reset request" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        password: hashedPassword,
        authProvider: "local"
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Reset password error:", error.message);
    return res.status(400).json({ message: "Reset link is invalid or has expired" });
  }
};
