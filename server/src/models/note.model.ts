import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    tags: {
      type: [String],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notebook: {
      type: Schema.Types.ObjectId,
      ref: "Notebook",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
