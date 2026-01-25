import connectDB from "../libs/db";
import { admin } from "./middleware";
import Question from "../libs/models/Question";
import Notification from "../libs/models/Notification";

export default async function handler(req, res) {
  try {
    admin(req);
    await connectDB();

    const { action } = req.query;

    if (action === "add-question") {
      const q = await Question.create(req.body);
      return res.json(q);
    }

    if (action === "notification") {
      const note = await Notification.create(req.body);
      return res.json(note);
    }

    if (action === "delete-notification") {
      await Notification.findByIdAndDelete(req.body.id);
      return res.json({ success: true });
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}
