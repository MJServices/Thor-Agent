import mongoose, { Document, Schema } from "mongoose";

export interface IUsageLog extends Document {
  userId: mongoose.Types.ObjectId;
  route: string;
  method: string;
  status: number;
  latencyMs: number;
  provider: string;
  errorMessage: string;
  ipAddress: string;
  createdAt: Date;
}

const usageLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    route: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    latencyMs: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
usageLogSchema.index({ createdAt: -1 });
usageLogSchema.index({ userId: 1 });
usageLogSchema.index({ route: 1 });

const UsageLog =
  mongoose.models.UsageLog ||
  mongoose.model<IUsageLog>("UsageLog", usageLogSchema);

export default UsageLog;
