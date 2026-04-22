import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "partner", "admin"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },

    socketId: {
      type: String,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },

    partnerOnboardingSteps: {
      type: Number,
      min: 0,
      max: 8,
      default: 0,
    },
    mobileNumber: {
      type: String,
    },
    partnerStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    rejectionReason: {
      type: String,
    },
    videoKycStatus: {
      type: String,
      default: "not_required",
      enum: ["not_required", "pending", "inprogess", "approved", "rejected"],
    },
    videoKycRoomId: {
      type: String,
    },
    videoKycRejectionReason: { type: String },
  },

  {
    timestamps: true,
  },
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);

export default User;
