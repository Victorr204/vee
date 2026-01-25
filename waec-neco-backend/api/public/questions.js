import connectDB from "../../libs/db";
import Question from "../../libs/models/Question";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const questions = await Question.find({
      isTest: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load questions" });
  }
}
