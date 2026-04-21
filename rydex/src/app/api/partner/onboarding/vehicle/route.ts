import { auth } from "../../../../../auth";
import { connectDb } from "../../../../../lib/db";
import User from "../../../../../models/user.models";
import Vehicle from "../../../../../models/vehicle.modal";

// ✅ Add this
const VEHICLE_REGEX_LIST = [
  /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, // PB10AB1234
  /^[0-9]{2}[A-Z]{2}[0-9]{4}[A-Z]{2}$/, // 21BH1234AA
];

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }

    const { type, number, vehicleModel, vehicleModal } = await req.json();

    const normalizedVehicleModel = (vehicleModel || vehicleModal || "").trim();

    if (!type || !number || !normalizedVehicleModel) {
      return Response.json(
        { message: "missing required details" },
        { status: 400 }
      );
    }

    const VehicleNumber = String(number)
      .normalize("NFKD")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    const isValidVehicleNumber = VEHICLE_REGEX_LIST.some((regex) =>
      regex.test(VehicleNumber)
    );

    if (!isValidVehicleNumber) {
      return Response.json(
        {
          message: `Invalid Vehicle Number Format for '${VehicleNumber}'. Use formats like PB10AB1234 or 21BH1234AA`,
        },
        { status: 400 }
      );
    }

    const existingVehicle = await Vehicle.findOne({ owner: user._id });

    const duplicate = await Vehicle.findOne({
      number: VehicleNumber,
      owner: { $ne: user._id },
    });

    if (duplicate) {
      return Response.json(
        { message: "vehicle already exists" },
        { status: 409 }
      );
    }

    let vehicle = existingVehicle;

    if (vehicle) {
      vehicle.type = type;
      vehicle.number = VehicleNumber;
      vehicle.vehicleModel = normalizedVehicleModel;
      vehicle.status = "pending";

      await vehicle.save();
      if(user.partnerOnboardingSteps < 2){
         user.partnerStatus = "pending"
        user.partnerOnboardingSteps = 2;
        await user.save();
      }
      else{
         user.partnerStatus = "pending"
        user.partnerOnboardingSteps =3
           await user.save();
      }

      return Response.json(vehicle, { status: 200 });
    }

    vehicle = await Vehicle.create({
      owner: user._id,
      type,
      number: VehicleNumber,
      vehicleModel: normalizedVehicleModel,
      status: "pending",
    });

    if (user.partnerOnboardingSteps < 1) {
      user.partnerOnboardingSteps = 1;
      user.role = "partner";
      user.partnerStatus = "pending"
      await user.save();
    }

    return Response.json(vehicle, { status: 201 });

  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }

    const vehicle = await Vehicle.findOne({ owner: user._id });

    if (!vehicle) {
      return Response.json(
        { message: "vehicle not found" },
        { status: 404 }
      );
    }

    return Response.json(vehicle, { status: 200 });

  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}