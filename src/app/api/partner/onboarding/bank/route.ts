import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import PartnerBank from "@/models/partnerBank.modals";

import User from "@/models/user.models";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
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

    const { accountHolder, accountNumber, upi, ifsc, mobileNumber } =
      await req.json();

    if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
      return Response.json(
        { message: "all details are required" },
        { status: 400 }
      );
    }

    const partnerBank = await PartnerBank.findOneAndUpdate(
      { owner: user._id },
      {
        $set: {
          owner: user._id,
          accountHolder,
          accountNumber,
          ifsc,
          upi,
          status: "added",
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    user.mobileNumber = mobileNumber;

    if (user.partnerOnboardingSteps < 3) {
      user.partnerOnboardingSteps = 3;
    }

    await user.save();

    return Response.json(partnerBank, { status: 201 });

  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
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

    const partnerBank = await PartnerBank.findOne({ owner: user._id });

    if (!partnerBank) {
      return Response.json(
        { message: "bank details not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        ...partnerBank.toObject(),
        mobileNumber: user.mobileNumber || "",
      },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}