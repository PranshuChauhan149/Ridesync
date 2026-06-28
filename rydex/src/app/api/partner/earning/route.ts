import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const bookings = await Booking.find({
      paymentStatus: "paid",
      bookingStatus: "completed",
      createdAt: {
        $gte: sevenDaysAgo,
      },
    }).select("partnerAmount createdAt");

    const earningMap: Record<string, number> = {};

    bookings.forEach((b) => {
      const date = new Date(b.createdAt);

      const key = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      earningMap[key] =
        (earningMap[key] || 0) + (b.partnerAmount || 0);
    });

    const chartData = Object.entries(earningMap).map(
      ([date, earning]) => ({
        date,
        earning,
      })
    );

    return NextResponse.json(
      {
        success: true,
        totalBookings: bookings.length,
        totalEarning: bookings.reduce(
          (sum, b) => sum + (b.partnerAmount || 0),
          0
        ),
        data: chartData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}