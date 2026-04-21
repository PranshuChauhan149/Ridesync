import { auth } from "../../../../../../../auth";
import { connectDb } from "../../../../../../../lib/db";
import Vehicle from "../../../../../../../models/vehicle.modal";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const vehicleId = (await context.params).id;
    const { rejectionReason } = await req.json();

    if (!rejectionReason || !String(rejectionReason).trim()) {
      return Response.json({ message: "rejection reason is required" }, { status: 400 });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return Response.json({ message: "vehicle not found" }, { status: 404 });
    }

    vehicle.status = "rejected";
    vehicle.rejectedReason = String(rejectionReason).trim();
    await vehicle.save();

    return Response.json({ message: "vehicle rejected successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "server error: " + error }, { status: 500 });
  }
}
