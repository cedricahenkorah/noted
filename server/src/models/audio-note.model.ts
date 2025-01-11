import mongoose, { Schema } from "mongoose";

const audioNoteSchema = new Schema(
  {
    title: {
      type: String,
    },
    url: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recordingTime: {
      type: Number,
    },
    notebook: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notebook",
      },
    ],
    starred: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AudioNote = mongoose.model("AudioNote", audioNoteSchema);

export default AudioNote;
