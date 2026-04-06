import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/user.models";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ roomId: string }> },
) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const roomId = (await context.params).roomId;

    const partner = await User.findOne({ roomId: roomId });

    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "partner not found" }, { status: 404 });
    }

    partner.videoKycStatus = "approved";
    partner.videoKycRejectionReason = "";
    partner.partnerOnboardingSteps = Math.max(partner.partnerOnboardingSteps || 0, 5);
    await partner.save();

    return Response.json({ message: "video KYC approved successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "server error: " + error }, { status: 500 });
  }
}
