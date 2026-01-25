import db from "../../libs/db";
import Report from "../../libs/models/Report";
import Message from "../../libs/models/CommunityMessage";
import User from "../../libs/models/User";
import { checkAbuse } from "../../libs/aiModeration";

export default async function handler(req, res) {
  const { messageId } = req.body;
  const reporterId = req.user.id;

  await db();

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).end();

  // AI check
  const abusive = await checkAbuse(message.text);

  if (abusive) {
    const offender = await User.findById(message.userId);

    offender.suspendedUntil = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    offender.warnings = 0;
    await offender.save();

    message.flagged = true;
    message.reason = "AI confirmed abusive language";
    await message.save();
  }

  await Report.create({
    messageId,
    reporterId,
    createdAt: new Date(),
  });

  res.json({ success: true });
}
