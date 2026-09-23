import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmailVerificationOtp = async (
  email: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your TaskFlow email",

    html: `
      <h2>Verify your TaskFlow account</h2>

      <p>Your verification OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP will expire in 10 minutes.</p>

      <p>If you did not create this account, ignore this email.</p>
    `,
  });
};

export const sendPasswordResetOtp = async (
  email: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "TaskFlow password reset OTP",

    html: `
      <h2>Reset your TaskFlow password</h2>

      <p>Your password reset OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP will expire in 10 minutes.</p>

      <p>If you did not request a password reset, ignore this email.</p>
    `,
  });
};