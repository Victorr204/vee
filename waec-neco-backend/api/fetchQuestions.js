// api/fetchQuestions.js
import { db } from "../firebaseAdmin";

const ALOC_API_URL = "https://questions.aloc.com.ng/api/v2/q";
const ALOC_TOKEN = process.env.ALOC_API_TOKEN;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { subject, year, examType } = req.body;

    if (!subject || !year || !examType) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    // Build ALOC query
    const queryParams = new URLSearchParams({
      subject,
      year: String(year),
      type: examType,
    });
    const url = `${ALOC_API_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${ALOC_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "ALOC API error" });
    }

    const questions = await response.json();

    if (!questions || !questions.length) {
      return res.status(200).json({ message: "No questions found" });
    }

    // Batch write to Firestore
    const batch = db.batch();
    questions.forEach((q) => {
      const ref = db.collection("pastQuestions").doc();
      batch.set(ref, {
        ...q,
        subject,
        exam: examType,
        year,
        createdAt: new Date().toISOString(),
      });
    });

    await batch.commit();

    return res.status(200).json({
      message: `Saved ${questions.length} questions`,
      questionsSaved: questions.length,
    });
  } catch (err) {
    console.error("Error fetching/storing ALOC questions:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
