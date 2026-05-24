import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const id = (await context.params).id;
    const booking = await Booking.findById(id);

    if (!booking || booking.bookingStatus !== "requested") {
      return NextResponse.json(
        {
          message: "invalid",
        },
        { status: 400 },
      );
    }

    booking.bookingStatus = "rejected";
    booking.paymentDeadline = new Date(Date.now() + 5 * 60 * 1000);
    await booking.save();

    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`,{
  event:"reject-booking",
  userId:booking.user,
  data:booking.bookingStatus
})

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "something went to wrong" },
      { status: 500 },
    );
  }
}
