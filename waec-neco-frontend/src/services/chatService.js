import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export function listenToGroupMessages(group, callback) {
  const q = query(
    collection(db, "groups", group, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(msgs);
  });
}

export async function sendGroupMessage(group, message) {
  return addDoc(collection(db, "groups", group, "messages"), {
    ...message,
    createdAt: serverTimestamp(),
  });
}
