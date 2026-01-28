// api/past-questions.js
import { db } from "../firebaseAdmin";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const snapshot = await db.collection("pastQuestions")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
