import { connectDb } from "@/lib/db";
import razorpay from "@/lib/razorpay";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { bookingId } = await req.json();

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: booking.fare * 100,
      currency: "INR",
      receipt: booking._id.toString(),
    });

    booking.bookingStatus = "awaiting_payment";
    booking.paymentStatus = "pending";

    await booking.save();

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}