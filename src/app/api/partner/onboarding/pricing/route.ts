import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import { connectDb } from "@/lib/db";
import User from "@/models/user.models";
import Vehicle from "@/models/vehicle.modal";

const toNonNegativeNumber = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
};

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const partner = await User.findOne({ email: session.user.email });

    if (!partner) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });

    if (!vehicle) {
      return Response.json({ message: "vehicle not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const baseFare = toNonNegativeNumber(formData.get("baseFare"));
    const pricePerKM = toNonNegativeNumber(formData.get("pricePerKM"));
    const waitingCharge = toNonNegativeNumber(formData.get("waitingCharge"));
    const image = formData.get("image") as Blob | null;

    if (baseFare === null || pricePerKM === null || waitingCharge === null) {
      return Response.json(
        { message: "baseFare, pricePerKM and waitingCharge must be valid numbers" },
        { status: 400 },
      );
    }

    if (image && image.size > 0) {
      const imageUrl = await uploadOnCloudinary(image);
      if (!imageUrl) {
        return Response.json({ message: "image upload failed" }, { status: 500 });
      }
      vehicle.imageUrl = imageUrl;
    }

    vehicle.baseFare = baseFare;
    vehicle.pricePerKM = pricePerKM;
    vehicle.waitingCharge = waitingCharge;

    if (partner.partnerOnboardingSteps < 6) {
      partner.partnerOnboardingSteps = 6;
    }
    vehicle.status = "pending"

    await Promise.all([vehicle.save(), partner.save()]);

    return Response.json(
      {
        message: "pricing saved successfully",
        vehicle,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const partner = await User.findOne({ email: session.user.email });

    if (!partner) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });

    if (!vehicle) {
      return Response.json({ message: "vehicle not found" }, { status: 404 });
    }

    return Response.json(
      {
        baseFare: vehicle.baseFare ?? 0,
        pricePerKM: vehicle.pricePerKM ?? 0,
        waitingCharge: vehicle.waitingCharge ?? 0,
        imageUrl: vehicle.imageUrl || "",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}