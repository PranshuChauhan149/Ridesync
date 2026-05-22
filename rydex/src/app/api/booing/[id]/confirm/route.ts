import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();

    const { id } = await context.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "booking is not found." },
        { status: 400 },
      );
    }

    booking.paymentStatus = "cash";
    booking.bookingStatus = "confirmed";
    await booking.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "something went wrong" }, { status: 500 });
  }
}
