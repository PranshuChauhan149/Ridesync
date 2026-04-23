import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    // Check if user is logged in
    if (!session?.user?.id) {
      return NextResponse.json(
        { booking: null, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Find user by email
    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        { booking: null, message: "User not found" },
        { status: 404 }
      );
    }

    // Find active booking
    const booking = await Booking.findOne({
      user: user._id,
      bookingStatus: {
        $in: [
          "requested",
          "awaiting_payment",
          "confirmed",
          "started",
        ],
      },
    });

    return NextResponse.json(
      {
        booking: booking || "idle",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET Booking Error:", error);

    return NextResponse.json(
      {
        booking: null,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}