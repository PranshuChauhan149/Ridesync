import { connectDb } from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { bookingId } = await req.json();

    const booking = await Booking.findById(bookingId).populate("user");

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    booking.pickUpOtp = otp;
    booking.pickUpOtpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await booking.save();

    const user: any = booking.user;

    if (user?.email) {
      await sendMail(
        user.email,
        "Your Pickup OTP - RYDEX",
        `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Ride OTP</h2>

          <p>Your pickup OTP is:</p>

          <h1 style="letter-spacing:6px">${otp}</h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>Share this OTP with your driver to start the ride.</p>

          <br/>

          <b>RYDEX</b>
        </div>
        `
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pickup OTP generated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("OTP Generation Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}