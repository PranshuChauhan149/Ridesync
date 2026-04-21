import { connectDb } from "../../../lib/db";
import { sendMail } from "../../../lib/sendMail";
import User from "../../../models/user.models";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpEmailTemplate = (otp: string): string => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="margin: 0 0 8px; color: #0f172a;">Verify Your Email</h2>
      <p style="margin: 0 0 16px; color: #334155;">Use this OTP to complete your registration:</p>
      <div style="font-size: 32px; letter-spacing: 8px; font-weight: 700; color: #0f172a; background: #e2e8f0; padding: 16px; border-radius: 10px; text-align: center;">
        ${otp}
      </div>
      <p style="margin: 16px 0 0; color: #475569;">This OTP is valid for 10 minutes.</p>
      <p style="margin: 6px 0 0; color: #94a3b8; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;
};

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "name, email and password are required" },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "password must be at least 6 characters" },
        { status: 400 },
      );
    }

    await connectDb();

    const normalizedEmail = String(email).trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user && user.isEmailVerified) {
      return NextResponse.json(
        { message: "email already exists" },
        { status: 409 },
      );
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      user.isEmailVerified = false;
      await user.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        otp,
        otpExpiresAt,
        isEmailVerified: false,
      });
    }

    await sendMail(
      normalizedEmail,
      "Your OTP for Email Verification",
      otpEmailTemplate(otp),
    );

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "register error";
    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}
