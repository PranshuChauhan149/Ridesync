import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const id = (await context.params).id;

    const booking = await Booking.findById(id);

    // Check if booking exists
    if (!booking) {
      return NextResponse.json(
        {
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    // Allow cancel only if booking is still active
    if (
      ![
        "requested",
        "awaiting_payment",
        "confirmed",
      ].includes(booking.bookingStatus)
    ) {
      return NextResponse.json(
        {
          message: "Booking cannot be cancelled",
        },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    booking.bookingStatus = "cancelled";
    booking.cancelledAt = new Date();

    await booking.save();

    return NextResponse.json(
      {
        success: true,
        message: "Booking cancelled successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}