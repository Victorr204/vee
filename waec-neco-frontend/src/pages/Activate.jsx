import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Firebase config
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function Activate() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!code.trim()) {
      alert("Enter a code");
      return;
    }

    try {
      const codesRef = collection(db, "activationCodes");
      const q = query(codesRef, where("code", "==", code.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Invalid activation code");
        return;
      }

      const codeDoc = snapshot.docs[0];
      const data = codeDoc.data();

      if (data.used) {
        alert("Code already used");
        return;
      }

      // Mark code as used
      await updateDoc(doc(db, "activationCodes", codeDoc.id), { used: true });

      // Activate test (store expiry in localStorage or state)
      localStorage.setItem("testExpiresAt", data.expiresAt);
      alert("Activation successful!");
      navigate("/test");
    } catch (err) {
      console.error(err);
      alert("Error activating code");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Activate Practice Test</h2>

      <input
        placeholder="Enter activation code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={submit} style={{ marginTop: 10 }}>
        Activate
      </button>

      <a
        href="https://wa.me/2349037306845?text=I%20want%20to%20subscribe"
        target="_blank"
      >
        Pay via WhatsApp
      </a>
    </div>
  );
}
