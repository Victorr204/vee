import db from "../../libs/db";
import User from "../../libs/models/User";
import Message from "../../libs/models/CommunityMessage";
import { violatesRules } from "../../libs/moderation"; // unified moderation function

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, group } = req.body;
  const userId = req.user.id; // from auth middleware

  if (!text || !group) {
    return res.status(400).json({ error: "Missing text or group" });
  }

  await db();

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // Check if user is currently suspended
  if (user.suspendedUntil && Date.now() < user.suspendedUntil) {
    return res.status(403).json({
      error: "You are temporarily suspended from posting in the community",
      suspendedUntil: user.suspendedUntil,
    });
  }

  // Check moderation rules (banned words, phone numbers)
  const moderation = violatesRules(text);

  if (moderation.violation) {
    // Increment warning/failure attempts
    user.failedAttempts = (user.failedAttempts || 0) + 1;

    // Automatic 2-hour suspension after 3 failed attempts
    if (user.failedAttempts >= 3) {
      user.suspendedUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
      user.failedAttempts = 0;
    }

    await user.save();

    return res.status(403).json({
      error:
        moderation.reason === "phone_number"
          ? "Sharing phone numbers or contact info is not allowed."
          : "Message blocked. Community is strictly for academic discussion only.",
      attempts: user.failedAttempts,
      suspendedUntil: user.suspendedUntil || null,
    });
  }

  // Reset failed attempts on clean message
  user.failedAttempts = 0;
  await user.save();

  // Save the message to DB
  const newMessage = await Message.create({
    text,
    userId,
    username: user.username,
    group,
    createdAt: new Date(),
  });

  res.json({ success: true, message: newMessage });
}