// api/fetchQuestions.js
import { db } from "../firebaseAdmin";

const ALOC_API_URL = "https://questions.aloc.com.ng/api/v2/q";
const ALOC_TOKEN = process.env.ALOC_API_TOKEN;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { subject, year, examType } = req.body;
  if (!subject || !year || !examType)
    return res.status(400).json({ message: "Missing parameters" });

  try {
    const queryParams = new URLSearchParams({ subject, year, type: examType });
    const url = `${ALOC_API_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${ALOC_TOKEN}` },
    });

    if (!response.ok) return res.status(response.status).json({ message: "ALOC API error" });

    const questions = await response.json();
    if (!questions || !questions.length) return res.status(200).json({ message: "No questions found" });

    // Save to Firestore
    const batch = db.batch();
    questions.forEach((q) => {
      const ref = db.collection("pastQuestions").doc();
      batch.set(ref, { ...q, subject, exam: examType, year, createdAt: new Date().toISOString() });
    });
    await batch.commit();

    return res.status(200).json({ message: `Saved ${questions.length} questions` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
