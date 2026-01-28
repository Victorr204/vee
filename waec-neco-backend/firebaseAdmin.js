// firebaseAdmin.js
import admin from "firebase-admin";

let db;

try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
} catch (error) {
  console.error("🔥 Firebase Admin Init Error:", error);
}

export { db };
