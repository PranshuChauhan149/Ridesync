import { connectDb } from "../../../lib/db";
import { sendMail } from "../../../lib/sendMail";
import User from "../../../models/user.models";
import { NextRequest, NextResponse } from "next/server";

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const otpEmailTemplate = (otp: string): string => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="margin: 0 0 8px; color: #0f172a;">New OTP Requested</h2>
      <p style="margin: 0 0 16px; color: #334155;">Use this OTP to verify your email:</p>
      <div style="font-size: 32px; letter-spacing: 8px; font-weight: 700; color: #0f172a; background: #e2e8f0; padding: 16px; border-radius: 10px; text-align: center;">
        ${otp}
      </div>
      <p style="margin: 16px 0 0; color: #475569;">This OTP is valid for 10 minutes.</p>
    </div>
  `;
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "email is required" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    await connectDb();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "email is already verified" },
        { status: 400 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.isEmailVerified = false;
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    await user.save();

    await sendMail(
      normalizedEmail,
      "Your OTP for Email Verification",
      otpEmailTemplate(otp),
    );

    return NextResponse.json({ message: "New OTP sent successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "resend otp error";
    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}
