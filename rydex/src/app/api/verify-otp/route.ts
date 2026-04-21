import { connectDb } from "../../../lib/db";
import User from "../../../models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "email and otp are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const otpValue = String(otp).replace(/\D/g, "").trim();

    if (!/^\d{6}$/.test(otpValue)) {
      return NextResponse.json({ message: "invalid otp format" }, { status: 400 });
    }

    await connectDb();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    if (typeof user.isEmailVerified !== "boolean") {
      user.isEmailVerified = false;
      await user.save();
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "email is already verified" },
        { status: 400 },
      );
    }

    if (!user.otp || !user.otpExpiresAt) {
      return NextResponse.json(
        { message: "OTP not found, please request a new OTP" },
        { status: 400 },
      );
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

      return NextResponse.json(
        { message: "OTP has expired, please request a new OTP" },
        { status: 400 },
      );
    }

    if (user.otp !== otpValue) {
      return NextResponse.json({ message: "invalid otp" }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return NextResponse.json(
      { message: "email verified successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "verify otp error";
    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}
