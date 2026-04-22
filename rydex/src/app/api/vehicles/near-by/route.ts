import { connectDb } from "@/lib/db";
import User from "@/models/user.models";
import Vehicle from "@/models/vehicle.modal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { latitude, longitude, vehicleType } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: "coordinates are not found" },
        { status: 400 }
      );
    }

    const partner = await User.find({
      role: "partner",
      isOnline: true,
      partnerStatus: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });

    const partnerIds = partner.map((p) => p._id);

    if (partnerIds.length === 0) {
      return NextResponse.json(
        {
          message: [],
        },
        { status: 200 }
      );
    }

    const vehicles = await Vehicle.find({
      owner: { $in: partnerIds },
      type: vehicleType,
      status: "approved",
      isActive: true,
    }).lean();

    return NextResponse.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}