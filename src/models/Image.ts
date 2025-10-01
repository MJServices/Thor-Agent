import mongoose, { Document, Schema } from "mongoose";

export interface IImage extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  imageUrl: string;
  imageBase64: string;
  provider: string;
  safetyCheckPassed: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
}

const imageSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    imageBase64: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
    },
    safetyCheckPassed: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index on userId and createdAt for efficient user gallery queries
imageSchema.index({ userId: 1, createdAt: -1 });

const Image =
  mongoose.models.Image || mongoose.model<IImage>("Image", imageSchema);

export default Image;
