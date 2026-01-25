// src/services/questions.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchPublicQuestions() {
  const q = query(
    collection(db, "homeQuestions"),
    where("isTest", "==", false)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
