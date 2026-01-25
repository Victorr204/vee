import connectDB from "../libs/db";
import Question from "../libs/models/Question";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const questions = await Question.find({
      isTest: true,
    });

    res.status(200).json(questions);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
