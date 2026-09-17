import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "channel name is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "servers",
      required: [true, "Server ID is required"],
    },
    topic: {
      type: String,
      trim: true,
      maxlength: [255, "Channel topic cannot exceed 255 characters"],
    },
    position: {
      type: Number,
      default: 0,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Optional: Ensure channel names are unique within the same server
channelSchema.index({ server: 1, name: 1 }, { unique: true });

const channelModel = mongoose.model("channels", channelSchema);
export default channelModel;
