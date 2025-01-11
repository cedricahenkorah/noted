import mongoose, { Schema } from "mongoose";

const notebookSchema = new Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Notebook = mongoose.model("Notebook", notebookSchema);

export default Notebook;
