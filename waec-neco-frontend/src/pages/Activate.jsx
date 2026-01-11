// Activate.jsx
import { useState } from "react";
import { activateTest } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Activate() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

 const submit = async () => {
  const res = await fetch("/api/public/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Invalid activation code");
    return;
  }

  activateTest(data.expiresAt); // backend controlled
  alert("Activation successful!");
  navigate("/test");
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
