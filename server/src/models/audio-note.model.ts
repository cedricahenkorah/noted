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
  },
  { timestamps: true }
);

const AudioNote = mongoose.model("AudioNote", audioNoteSchema);

export default AudioNote;
