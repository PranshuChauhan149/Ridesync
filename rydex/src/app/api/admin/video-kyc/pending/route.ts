import { auth } from "../../../../../auth";
import { connectDb } from "../../../../../lib/db";
import User from "../../../../../models/user.models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const partner = await User.find({
      role: "partner",
      partnerStatus: "approved",
      partnerOnboardingSteps: { $gte: 4 },
      videoKycStatus: {
        $in: ["pending", "inprogess", "in_progress", "in_progess", "not_required"],
      },
    }).sort({ updatedAt: -1 });

    return Response.json(partner, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "server error : " + error },
      { status: 500 },
    );
  }
}
