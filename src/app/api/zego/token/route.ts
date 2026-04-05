import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/user.models";
import crypto from "crypto";

function generateZegoToken(
  appId: number,
  serverSecret: string,
  userId: string,
  roomId: string
): string {
  const createTime = Math.floor(Date.now() / 1000);
  const expireTime = createTime + 3600; // 1 hour
  const token = "";

  // Generate payload
  const payloadData = Buffer.from(
    JSON.stringify({
      app_id: appId,
      user_id: userId,
      room_id: roomId,
      privilege: {
        1: 1,
        2: 1,
      },
      create_time: createTime,
      expire_time: expireTime,
    })
  );

  // Generate signature
  const hmac = crypto.createHmac("sha256", serverSecret);
  hmac.update(payloadData);
  const signature = hmac.digest("hex");

  // Base64 encode
  const base64Payload = payloadData.toString("base64");
  const base64Signature = Buffer.from(signature, "hex").toString("base64");

  return `04${base64Payload}.${base64Signature}`;
}

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

    const { roomId } = await req.json();

    if (!roomId) {
      return Response.json({ message: "roomId is required" }, { status: 400 });
    }

    const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (!appId || !serverSecret) {
      return Response.json(
        { message: "Missing Zego configuration" },
        { status: 500 }
      );
    }

    const token = generateZegoToken(
      appId,
      serverSecret,
      user._id.toString(),
      roomId
    );

    return Response.json({ token }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}
