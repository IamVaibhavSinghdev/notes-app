import { Router } from "express";
import passport from "../utils/googleStrategy"; // your google OAuth strategy config
import jwt from "jsonwebtoken";
import Otp from "../models/Otp";
import User from "../models/User";
import { config } from "../config";
import { generateOtp, hashOtp, otpExpiryDate, compareOtp } from "../utils/otp";
import { sendEmail } from "../utils/mailer"; // email sender

const router = Router();

// POST: request OTP
router.post("/request-otp", async (req, res, next) => {
  try {
    const { email, name, dob, purpose } = req.body as {
      email: string;
      name?: string;
      dob?: string;
      purpose: "signup" | "login";
    };

    if (!email || !purpose) {
      return res.status(400).json({ error: "email or purpose is required" });
    }

    if (purpose === "login") {
      const exists = await User.findOne({ email });
      if (!exists) {
        return res.status(404).json({ error: "No account with this email" });
      }
    }

    // Generate and hash OTP
    const otp = generateOtp();
    const codeHash = await hashOtp(otp);

    // Clear previous OTPs for that email and purpose
    await Otp.deleteMany({ email, purpose });

    // Save new OTP record
    await Otp.create({
      email,
      codeHash,
      purpose,
      expiresAt: otpExpiryDate(),
    });

    // Attempt to send OTP email
    try {
      await sendEmail(
        email,
        "Your OTP Code",
        `Your OTP is ${otp}. It is valid for ${config.otpExpiryMin} minutes.`
      );
    } catch (emailErr) {
      console.error("Failed to send OTP email:", emailErr);
      // Continue despite email failure
    }

    return res.json({
      message: "OTP sent to your email",
      expiresInMin: config.otpExpiryMin,
    });
  } catch (e) {
    next(e);
  }
});

// POST: verify OTP
router.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, purpose, otp, name, dob } = req.body as {
      email: string;
      purpose: "signup" | "login";
      otp: string;
      name?: string;
      dob?: string;
    };

    if (!email || !purpose || !otp) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Find latest OTP for the user and purpose
    const rec = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });

    // Check if OTP exists and is not expired
    if (!rec || rec.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    // Verify OTP correctness
    const ok = await compareOtp(otp, rec.codeHash);
    if (!ok) return res.status(400).json({ error: "Incorrect OTP" });

    // Find user by email
    let user = await User.findOne({ email });

    // Signup flow: create user if not exists
    if (purpose === "signup") {
      if (!user) {
        user = await User.create({
          email,
          name: name || email.split("@")[0],
          dob: dob ? new Date(dob) : undefined,
        });
      }
    } else {
      // Login flow: user must exist
      if (!user) return res.status(404).json({ error: "Account not found" });
    }

    // Delete all OTPs after successful verification
    await Otp.deleteMany({ email, purpose });

    // Generate JWT token valid for 7 days
    const token = jwt.sign(
      { id: user!.id, email: user!.email, name: user!.name },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    // Return token and user data
    return res.json({
      token,
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        dob: user!.dob,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req: any, res) => {
    const user = req.user;

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    // Redirect to frontend with token in query params
res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}`);
  }
);

export default router;
