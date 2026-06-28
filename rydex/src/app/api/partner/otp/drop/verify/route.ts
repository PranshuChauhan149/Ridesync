import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { bookingId, otp } = await req.json();

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    if (!booking.dropOtp) {
      return NextResponse.json(
        { success: false, message: "Drop OTP not generated" },
        { status: 400 }
      );
    }

    if (String(booking.dropOtp) !== String(otp)) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (
      booking.dropOtpExpires &&
      new Date() > new Date(booking.dropOtpExpires)
    ) {
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    booking.dropOtp = undefined;
    booking.dropOtpExpires = undefined;

    // Ride completed
    if(booking.paymentStatus == "cash"){
      const adminCommission = booking.fare * 0.1;
		const partnerAmount = booking.fare - adminCommission;


		booking.paymentStatus = "paid";
		booking.adminCommission = adminCommission;
		booking.partnerAmount = partnerAmount;
    }
    booking.bookingStatus = "completed";

    await booking.save();

    return NextResponse.json(
      {
        success: true,
        message: "Drop OTP verified successfully. Ride completed.",
        bookingStatus: booking.bookingStatus,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Drop OTP Verification Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}