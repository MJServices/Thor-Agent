import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  key: string;
  value: any;
  description: string;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const settingsSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
    },
    description: {
      type: String,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Static methods for getting and setting settings
settingsSchema.statics.getSetting = async function (key: string) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : null;
};

settingsSchema.statics.setSetting = async function (
  key: string,
  value: any,
  userId: string
) {
  return await this.findOneAndUpdate(
    { key },
    { value, updatedBy: userId },
    { upsert: true, new: true }
  );
};

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
