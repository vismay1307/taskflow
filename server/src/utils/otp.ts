import crypto from "crypto";

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const getOtpExpiry = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000);
};