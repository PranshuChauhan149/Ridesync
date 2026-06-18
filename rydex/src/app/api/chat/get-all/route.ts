import { connectDb } from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const msgs = await ChatMessage.find({ bookingId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        messages: msgs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Get all messages error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}