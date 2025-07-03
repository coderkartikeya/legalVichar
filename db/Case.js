import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Open", "Closed", "Pending", "Archived"], default: "Open" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  deadlines: [{ type: Date }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model("Case", CaseSchema); 