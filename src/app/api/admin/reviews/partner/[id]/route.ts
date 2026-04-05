import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import PartnerBank from "@/models/partnerBank.modals";
import PartnerDocs from "@/models/partnerDocs.modals";
import User from "@/models/user.models";
import Vehicle from "@/models/vehicle.modal";
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
            const vehicle = await Vehicle.findOne({owner:partnerId})
            const documents= await PartnerDocs.findOne({owner:partner})
            const banks= await PartnerBank.findOne({owner:partner})

              return Response.json({ 
                partner,
                vehicle : vehicle || null,
                documents:documents || null,
                bank : banks || null
              }, { status: 200 });

    } catch (error) {
              return Response.json({ message: "server error" + error }, { status: 500 });
        
    }
}