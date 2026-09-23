import bcrypt from "bcrypt";

import User from "../models/User.js";

import { generateToken } from "../utils/jwt.js";
import {
  generateOtp,
  getOtpExpiry,
} from "../utils/otp.js";

import {
  sendEmailVerificationOtp,
  sendPasswordResetOtp,
} from "./email.service.js";


// ==========================================
// SIGNUP
// ==========================================

export const signupUser = async (
  firstName: string,
  lastName: string | undefined,
  email: string,
  password: string,
  confirmPassword: string
) => {

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    12
  );

  const otp = generateOtp();
  const otpExpires = getOtpExpiry();

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName?.trim(),

    email: normalizedEmail,

    password: hashedPassword,

    emailVerified: false,

    emailVerificationOtp: otp,
    emailVerificationOtpExpires: otpExpires,
  });

  await sendEmailVerificationOtp(
    user.email,
    otp
  );

  return {
    userId: user._id,
    email: user.email,
    message: "Verification OTP sent to your email",
  };
};


// ==========================================
// VERIFY EMAIL
// ==========================================

export const verifyEmail = async (
  email: string,
  otp: string
) => {

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select(
    "+emailVerificationOtp +emailVerificationOtpExpires"
  );

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

  if (
    !user.emailVerificationOtp ||
    !user.emailVerificationOtpExpires
  ) {
    throw new Error(
      "Verification OTP not found"
    );
  }

  if (
    user.emailVerificationOtpExpires < new Date()
  ) {
    throw new Error(
      "Verification OTP has expired"
    );
  }

  if (user.emailVerificationOtp !== otp) {
    throw new Error(
      "Invalid verification OTP"
    );
  }

  user.emailVerified = true;

  user.emailVerificationOtp = undefined;
  user.emailVerificationOtpExpires = undefined;

  await user.save();

  const token = generateToken(
    user._id.toString()
  );

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
    },

    token,
  };
};


// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (
  email: string,
  password: string
) => {

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  if (!user.emailVerified) {
    throw new Error(
      "Please verify your email first"
    );
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const token = generateToken(
    user._id.toString()
  );

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
    },

    token,
  };
};


// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = async (
  userId: string
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
  };
};


// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (
  email: string
) => {

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();
  const otpExpires = getOtpExpiry();

  user.passwordResetOtp = otp;
  user.passwordResetOtpExpires =
    otpExpires;

  await user.save();

  await sendPasswordResetOtp(
    user.email,
    otp
  );

  return {
    message:
      "Password reset OTP sent to your email",
  };
};


// ==========================================
// VERIFY RESET OTP
// ==========================================

export const verifyResetOtp = async (
  email: string,
  otp: string
) => {

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select(
    "+passwordResetOtp +passwordResetOtpExpires"
  );

  if (!user) {
    throw new Error("User not found");
  }

  if (
    !user.passwordResetOtp ||
    !user.passwordResetOtpExpires
  ) {
    throw new Error(
      "Reset OTP not found"
    );
  }

  if (
    user.passwordResetOtpExpires < new Date()
  ) {
    throw new Error(
      "Reset OTP has expired"
    );
  }

  if (user.passwordResetOtp !== otp) {
    throw new Error(
      "Invalid reset OTP"
    );
  }

  return {
    message: "OTP verified successfully",
  };
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
) => {

  if (newPassword !== confirmPassword) {
    throw new Error(
      "Passwords do not match"
    );
  }

  if (newPassword.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select(
    "+passwordResetOtp +passwordResetOtpExpires"
  );

  if (!user) {
    throw new Error("User not found");
  }

  if (
    !user.passwordResetOtp ||
    !user.passwordResetOtpExpires
  ) {
    throw new Error(
      "Reset OTP not found"
    );
  }

  if (
    user.passwordResetOtpExpires < new Date()
  ) {
    throw new Error(
      "Reset OTP has expired"
    );
  }

  if (user.passwordResetOtp !== otp) {
    throw new Error(
      "Invalid reset OTP"
    );
  }

  user.password = await bcrypt.hash(
    newPassword,
    12
  );

  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpires = undefined;

  await user.save();

  return {
    message:
      "Password reset successfully",
  };
};