import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/user.models";
import Vehicle from "@/models/vehicle.modal";

export async function GET(req: Request) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const totalPartner = await User.countDocuments({ role: "partner" });
    const totalApprovedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "approved",
    });
    const totalPendingPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "pending",
    });
    const totalRejectedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "rejected",
    });

    const pendingPartnerUsers = await User.find({
      role: "partner",
      partnerStatus: "pending",
      partnerOnboardingSteps: {$gte: 3},
    });
    const partnerIds = pendingPartnerUsers.map((p) => p._id);
    const Partnervehicles = await Vehicle.find({
      owner: {
        $in: partnerIds,
      },
    });
    const vehicleTypeMap = new Map(
      Partnervehicles.map((v) => [String(v.owner), v.type]),
    );

    const pendingPartnerReviews = pendingPartnerUsers.map((p) => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      vehicleTpye: vehicleTypeMap.get(String(p._id)),
    }));



    const pendingVehicle = await Vehicle.find({
      status:"pending"
    }).populate("owner")


    return Response.json(
      {
        pendingVehicle,
        stats:{
            totalPartner,
        totalApprovedPartners,
        totalPendingPartners,
        totalRejectedPartners,
        },
        pendingPartnerReviews,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server errror" },
      { status: 500 },
    );
  }
}
