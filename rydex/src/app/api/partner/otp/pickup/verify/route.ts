import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("========== VERIFY OTP API CALLED ==========");

    await connectDb();
    console.log("✅ DB Connected");

    const { bookingId, otp } = await req.json();

    console.log("📩 Request Data:");
    console.log("bookingId:", bookingId);
    console.log("otp:", otp);
    console.log("otp type:", typeof otp);

    const booking = await Booking.findById(bookingId);

    console.log("📦 Booking Found:", !!booking);

    if (!booking) {
      console.log("❌ Booking not found");

      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    console.log("📋 Booking Data:");
    console.log("DB OTP:", booking.pickUpOtp);
    console.log("DB OTP Type:", typeof booking.pickUpOtp);
    console.log("DB Expiry:", booking.pickUpOtpExpires);

    if (!booking.pickUpOtp) {
      console.log("❌ OTP not generated");

      return NextResponse.json(
        { success: false, message: "OTP not generated" },
        { status: 400 }
      );
    }

    console.log(
      "🔍 OTP Compare:",
      String(booking.pickUpOtp),
      "===",
      String(otp)
    );

    if (String(booking.pickUpOtp) !== String(otp)) {
      console.log("❌ OTP Mismatch");

      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    console.log("✅ OTP Matched");

    console.log("🕒 Current Time:", new Date());
    console.log("🕒 OTP Expiry:", booking.pickUpOtpExpires);

    if (
      booking.pickUpOtpExpires &&
      new Date() > new Date(booking.pickUpOtpExpires)
    ) {
      console.log("❌ OTP Expired");

      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    console.log("✅ OTP Not Expired");
booking.bookingStatus = "started";
booking.pickUpOtp = undefined;
booking.pickUpOtpExpires = undefined;

await booking.save();

    console.log("✅ Booking Saved");
    console.log("🎉 OTP Verification Success");

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🚨 OTP Verification Error:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}