import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  text: String,
  expiresAt: Date,
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
