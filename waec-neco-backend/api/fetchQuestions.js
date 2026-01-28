// api/fetchQuestions.js
import { db } from "../firebaseAdmin";

const ALOC_API_URL = "https://questions.aloc.com.ng/api/v2/q";
const ALOC_TOKEN = process.env.ALOC_API_TOKEN;

export default async function handler(req, res) {
  // ✅ Add CORS so frontend can call this too if needed
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { subject, year, examType } = req.body;

    if (!subject || !year || !examType) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const queryParams = new URLSearchParams({
      subject,
      year: String(year),
      type: examType,
    });

    const url = `${ALOC_API_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${ALOC_TOKEN}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "ALOC API error" });
    }

    const data = await response.json();

    if (!data || !data.length) {
      return res.status(200).json({ message: "No questions found" });
    }

    const batch = db.batch();

    data.forEach((q) => {
      const ref = db.collection("pastQuestions").doc();

      batch.set(ref, {
        subject,
        exam: examType,
        year,

        // ✅ Map ALOC fields to YOUR frontend structure
        text: q.question || "No question text",
        options: q.options || [],
        answer: q.answer || null,
        explanation: q.explanation || "",

        isTest: false, // 👈 makes it show in FREE section
        createdAt: new Date(),
      });
    });

    await batch.commit();

    return res.status(200).json({
      message: `Saved ${data.length} questions`,
      questionsSaved: data.length,
    });
  } catch (err) {
    console.error("Error fetching/storing ALOC questions:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
