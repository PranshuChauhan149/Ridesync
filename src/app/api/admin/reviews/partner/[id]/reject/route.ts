import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import PartnerBank from "@/models/partnerBank.modals";
import PartnerDocs from "@/models/partnerDocs.modals";
import User from "@/models/user.models";
import { NextRequest } from "next/server";
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();

    const session = await auth();
    const { rejectionReason } = await req.json();

    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }
    const partnerId = (await context.params).id;
    const partner = await User.findById(partnerId);
    if (!partner || partner.role != "partner") {
      return Response.json({ message: "partner not found" }, { status: 400 });
    }

    const partnerDocs = await PartnerDocs.findOne({ owner: partner._id });
    const partnerBank = await PartnerBank.findOne({ owner: partner._id });

    partner.partnerStatus = "rejected";
    partner.rejectionReason = rejectionReason;
    await partner.save();

    return Response.json(
      { message: "partner rejected successfully" },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ message: "server error " + error }, { status: 400 });
  }
}
