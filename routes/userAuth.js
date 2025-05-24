const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const sendOtp = require('../services/sendOtp');
const otpStore = new Map();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Auth Middleware ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains userId and phone
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// REGISTER - Send OTP
router.post("/register/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number is required" });

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ message: "Phone number already registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);

  const sent = await sendOtp(phone, otp);
  if (!sent) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }

  res.json({ message: "OTP sent for registration" });
});

// REGISTER - Verify OTP
router.post("/register/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

  const storedOtp = otpStore.get(phone);
  if (storedOtp !== otp) return res.status(401).json({ message: "Invalid OTP" });

  otpStore.delete(phone);

  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ phone });
    await user.save();
  }

  const token = jwt.sign({ userId: user._id, phone: user.phone }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Registered", token });
});

// LOGIN - Send OTP
router.post("/login/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number is required" });

  const existingUser = await User.findOne({ phone });
  if (!existingUser) {
    return res.status(404).json({ message: "Phone number not registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);

  const sent = await sendOtp(phone, otp);
  if (!sent) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }

  res.json({ message: "OTP sent for login" });
});

// LOGIN - Verify OTP
router.post("/login/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

  const storedOtp = otpStore.get(phone);
  if (storedOtp !== otp) return res.status(401).json({ message: "Invalid OTP" });

  otpStore.delete(phone);

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign({ userId: user._id, phone: user.phone }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// Get User Data
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Data
router.put("/me", authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});



module.exports = router;
