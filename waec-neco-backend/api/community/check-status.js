import db from "../../libs/db";
import User from "../../libs/models/User";

export default async function handler(req, res) {
  await db();

  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const now = Date.now();

  res.json({
    suspended: user.suspendedUntil && now < user.suspendedUntil,
    suspendedUntil: user.suspendedUntil,
    warnings: user.warnings || 0,
  });
}
