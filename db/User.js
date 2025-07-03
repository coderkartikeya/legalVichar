import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // hashed, optional if using OAuth/Clerk
  role: { type: String, enum: ["Lawyer", "Client", "Admin"], default: "Client" },
  avatar: { type: String },
  clerkId: { type: String }, // for Clerk auth
  oauthId: { type: String }, // for OAuth providers
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema); 