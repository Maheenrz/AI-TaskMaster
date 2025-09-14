import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["user","admin"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
