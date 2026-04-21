import { auth } from "../../../../../auth";
import { uploadOnCloudinary } from "../../../../../lib/cloudinary";
import { connectDb } from "../../../../../lib/db";
import PartnerDocs from "../../../../../models/partnerDocs.modals";
import User from "../../../../../models/user.models";
import Vehicle from "../../../../../models/vehicle.modal";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return Response.json({ message: "user not found" }, { status: 400 });
    }

    const formdata = await req.formData();
    const aadhar = formdata.get("aadhar") as Blob | null;
    const license = formdata.get("license") as Blob | null;
    const rc = formdata.get("rc") as Blob | null;

    if (!aadhar || !license || !rc) {
      return Response.json(
        { message: "All documents required" },
        { status: 400 },
      );
    }

    const updatePayload: any = {
      status: "pending",
    };
    if (aadhar) {
      const url = await uploadOnCloudinary(aadhar);
      if (!url) {
        return Response.json(
          { message: "aadhar upload faild" },
          { status: 500 },
        );
      }
      updatePayload.aadharUrl = url;
    }
    if (license) {
      const url = await uploadOnCloudinary(license);
      if (!url) {
        return Response.json(
          { message: "license upload faild" },
          { status: 500 },
        );
      }
      updatePayload.license = url;
    }
    if (rc) {
      const url = await uploadOnCloudinary(rc);
      if (!url) {
        return Response.json({ message: "rc upload faild" }, { status: 500 });
      }
      updatePayload.rcUrl = url;
    }

    const partnerDocs = await PartnerDocs.findOneAndUpdate(
      { owner: user._id },
      { $set: updatePayload },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    if (user.partnerOnboardingSteps < 2) {
      user.partnerOnboardingSteps = 2;
      user.partnerStatus = "pending"
      await user.save();
    }
    return Response.json(partnerDocs, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}


