import mongoose, { Schema, Document } from "mongoose";

export interface IPartnerDocs extends Document {
  owner: mongoose.Types.ObjectId;
  aadharUrl: string;
  rcUrl: string;
  license: string;
  status: "approved" | "pending" | "rejected";
  rejectedReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const partnerDocsSchema = new Schema<IPartnerDocs>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    aadharUrl: {
      type: String,
      required: true,
    },

    rcUrl: {
      type: String,
      required: true,
    },

    license: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },

    rejectedReason: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PartnerDocs =
  mongoose.models.PartnerDocs ||
  mongoose.model<IPartnerDocs>("PartnerDocs", partnerDocsSchema);

export default PartnerDocs;