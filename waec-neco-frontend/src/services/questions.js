// src/services/questions.js

export async function fetchPublicQuestions() {
  try {
    const res = await fetch("https://waec-neco-backend.vercel.app/api/past-questions");
    if (!res.ok) throw new Error("Failed to fetch questions");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("fetchPublicQuestions error:", err);
    return [];
  }
}
