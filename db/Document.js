import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["Evidence", "Filing", "Contract", "Other"], default: "Other" },
  status: { type: String, enum: ["Pending", "Reviewed", "Approved", "Rejected"], default: "Pending" },
  aiSummary: { type: String },
}, { timestamps: true });

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema); 