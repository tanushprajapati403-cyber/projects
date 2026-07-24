import mongoose, { Types } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      require: [true, "text is require"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  },
);

const commentModel = mongoose.model("comments", commentSchema);
export default commentModel;
