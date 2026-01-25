import connectDB from "../libs/db";
import Question from "../libs/models/Question";
import Notification from "../libs/models/Notification";

export default async function handler(req, res) {
  await connectDB();
  const { action } = req.query;

  if (action === "questions") {
    const qs = await Question.find({ isTest: false });
    return res.json(qs);
  }

  if (action === "tests") {
    const qs = await Question.find({ isTest: true });
    return res.json(qs);
  }

  if (action === "notifications") {
    const now = new Date();
    const note = await Notification.findOne({ expiresAt: { $gt: now } });
    return res.json(note);
  }

  res.status(400).json({ error: "Invalid action" });
}
