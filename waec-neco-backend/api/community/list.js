import db from "../../libs/db";
import Message from "../../libs/models/CommunityMessage";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { group = "general" } = req.query;

  await db();

  const messages = await Message.find({ group })
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(messages);
}
