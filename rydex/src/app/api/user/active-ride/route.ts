import { auth } from "@/auth";
import { connectDb } from "@/lib/db";

import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import "@/models/vehicle.modal";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { bookingId } = await req.json();

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("driver")
      .populate("vehicle");

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Active Ride API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}