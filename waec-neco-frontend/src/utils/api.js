const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchPublicQuestions() {
  const res = await fetch(`${API_BASE}/api/public/questions`);
  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
}