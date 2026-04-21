import mongoose, { Schema, Document } from "mongoose";

export type vehicleType = "bike" | "car" | "loading" | "truck" | "auto";

export interface IVehicle extends Document {
  owner: mongoose.Types.ObjectId;
  type: vehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  waitingCharge?: number;
  pricePerKM?: number;
  status: "approved" | "pending" | "rejected";
  rejectedReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["bike", "car", "loading", "truck", "auto"],
      required: true,
    },

    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },

    number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    imageUrl: {
      type: String,
    },

    baseFare: {
      type: Number,
      default: 0,
    },

    waitingCharge: {
      type: Number,
      default: 0,
    },

    pricePerKM: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },

    rejectedReason: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Vehicle =
  mongoose.models.Vehicle ||
  mongoose.model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;