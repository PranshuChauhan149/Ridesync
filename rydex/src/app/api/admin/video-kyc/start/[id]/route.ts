import { auth } from "../../../../../../auth";
import { connectDb } from "../../../../../../lib/db";
import User from "../../../../../../models/user.models";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest,context:{params : Promise<{id:string}>}) {
    try {
         await connectDb();
        
            const session = await auth();
        
            if (!session || !session.user?.email || session.user?.role !== "admin") {
              return Response.json({ message: "unauthorized" }, { status: 401 });
            }
            const partnerId = (await context.params).id
            const partner = await User.findById(partnerId)
            if(!partner || partner.role != "partner"){
              return Response.json({ message: "partner not found" }, { status: 400 });
            }

            const roomId = `kyc-${partner._id}-${Date.now()}`
            partner.videoKycRoomId = roomId
            partner.videoKycStatus = "inprogess"
            partner.partnerOnboardingSteps = 4
            await partner.save();

            return Response.json({roomId})
        }
          catch(error){
            return Response.json({ message: "server error: " + error }, {status:500})

        }
    }