import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  participants: [{
    type:String,
    required:true
  }],
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  type: { type: String, enum: ["Court", "Meeting", "Call", "Other"], default: "Other" },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema); 