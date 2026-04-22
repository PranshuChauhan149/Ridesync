import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const partner = await User.findOne({
      email: session.user.email,
    });

    if (!partner) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    
    const booking = await Booking.find({
      driver: partner._id,
      bookingStatus: "requested",
    });

    return Response.json(
      {
        success: true,
        booking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}