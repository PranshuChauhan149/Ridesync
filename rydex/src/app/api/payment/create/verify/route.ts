import crypto from "crypto";
import { connectDb } from "@/lib/db";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		await connectDb();

		const {
			bookingId,
			razorpay_payment_id,
			razorpay_order_id,
			razorpay_signature,
		} = await req.json();

		if (
			!bookingId ||
			!razorpay_payment_id ||
			!razorpay_order_id ||
			!razorpay_signature
		) {
			return NextResponse.json(
				{ success: false, message: "missing payment details" },
				{ status: 400 },
			);
		}

		const booking = await Booking.findById(bookingId);

		if (!booking) {
			return NextResponse.json(
				{ success: false, message: "booking is not found." },
				{ status: 404 },
			);
		}

		const secret = process.env.RAZORPAY_KEY_SECRET;

		if (!secret) {
			return NextResponse.json(
				{ success: false, message: "razorpay secret is not configured" },
				{ status: 500 },
			);
		}

		const generatedSignature = crypto
			.createHmac("sha256", secret)
			.update(`${razorpay_order_id}|${razorpay_payment_id}`)
			.digest("hex");

		if (generatedSignature !== razorpay_signature) {
			return NextResponse.json(
				{ success: false, message: "invalid signature" },
				{ status: 400 },
			);
		}

		const adminCommission = booking.fare * 0.1;
		const partnerAmount = booking.fare - adminCommission;

		booking.bookingStatus = "confirmed";
		booking.paymentStatus = "paid";
		booking.adminCommission = adminCommission;
		booking.partnerAmount = partnerAmount;
		booking.paymentDeadline = undefined;

		await booking.save();

		return NextResponse.json(
			{
				success: true,
				message: "payment verified successfully",
				booking,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}