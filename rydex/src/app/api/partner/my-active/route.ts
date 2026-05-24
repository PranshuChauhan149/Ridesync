import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // NOTE: field name corrected to `driver` (was `diver`), ensure this matches your schema
    const booking = await Booking.findOne({
      driver: user._id,
      bookingStatus: { $in: ["confirmed", "started", "completed"] },
    });

    if (!booking) {
      return NextResponse.json({ message: "No active booking" }, { status: 404 });
    }

    // return the booking document as-is; if pickUpLocation/dropLocation are null
    // they need to be present in the DB when the booking is created/updated.
    return NextResponse.json(booking, { status: 200 });
  } catch (err) {
    console.error("GET /api/partner/my-active error:", err);
    return NextResponse.json({ message: "get active ride error", error: String(err) }, { status: 500 });
  }
}