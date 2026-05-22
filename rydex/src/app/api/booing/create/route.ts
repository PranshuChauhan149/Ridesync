import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 400 }
      );
    }

    const {
      driverId,
      vehicleId,
      pickUpAddress,
      dropAddress,
      pickUpLocation,
      dropLocation,
      fare,
      mobileNumber,
      force,
    } = await req.json();

    if (
      !driverId ||
      !vehicleId ||
      !pickUpLocation?.coordinates ||
      !dropLocation?.coordinates
    ) {
      return NextResponse.json(
        { message: "missing required details" },
        { status: 400 }
      );
    }

    const driver = await User.findById(driverId);

    if (!driver) {
      return NextResponse.json(
        { message: "driver not found" },
        { status: 400 }
      );
    }

    const existing = await Booking.findOne({
      user: session.user.id,
      bookingStatus: {
        $in: [
          "requested",
          "awaiting_payment",
          "confirmed",
          "started",
        ],
      },
    });

    if (existing && !force) {
      return NextResponse.json(existing);
    }

  const booking = await Booking.create({
  user: session.user.id,
  driver: driverId,
  vehicle: vehicleId,

  pickUpAddress,
  dropAddress,

  pickUpLocation: {
    type: "Point",
    coordinates: pickUpLocation.coordinates,
  },

  dropLocation: {
    type: "Point",
    coordinates: dropLocation.coordinates,
  },

  fare,

  userMobileNumber: mobileNumber,
  driverMobileNumber: driver.mobileNumber || "",

  bookingStatus: "requested",
})

await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`,{
  event:"new-booking",
  userId:driverId,
  data:booking
})

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}