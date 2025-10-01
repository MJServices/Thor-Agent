import mongoose, { Document, Schema } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string; // Added for image messages
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IChatMessage[];
  aiModel: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: false,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    aiModel: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index on userId and createdAt for efficient querying
chatSchema.index({ userId: 1, createdAt: -1 });

const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
