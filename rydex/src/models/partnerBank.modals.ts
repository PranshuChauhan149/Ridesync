import mongoose, { Schema, Document } from "mongoose";

export interface IPartnerBank extends Document {
  owner: mongoose.Types.ObjectId;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  upi?: string;

  status: "not_added" | "added" | "verified";

  createdAt: Date;
  updatedAt: Date;
}

const partnerBankSchema = new Schema<IPartnerBank>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accountHolder: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },

    ifsc: {
      type: String,
      required: true,
      uppercase: true,
    },

    upi: {
      type: String,
    },

    status: {
      type: String,
      enum: ["not_added", "added", "verified"],
      default: "not_added",
    },
  },
  { timestamps: true },
);

const PartnerBank =
  mongoose.models.PartnerBank ||
  mongoose.model<IPartnerBank>("PartnerBank", partnerBankSchema);

export default PartnerBank;
