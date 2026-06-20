
import { connectDb } from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { bookingId, sender, text } = await req.json();

    if (!bookingId || !sender || !text) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const msg = await ChatMessage.create({
      bookingId,
      sender,
      text,
    });

    return NextResponse.json(
  {
    success: true,
    message: "Message sent",
    msg,
  },
  { status: 201 }
);
  } catch (error: any) {
    console.error("Chat Message Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
