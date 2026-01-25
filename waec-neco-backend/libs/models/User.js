import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
