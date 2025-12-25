import { useState } from "react";
import { activateTest } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Activate() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    const codes =
      JSON.parse(localStorage.getItem("activation_codes")) || [];

    if (codes.includes(code.toUpperCase())) {
      activateTest();

      const updated = codes.filter((c) => c !== code.toUpperCase());
      localStorage.setItem("activation_codes", JSON.stringify(updated));

      alert("Activation successful!");
      navigate("/test");
    } else {
      alert("Invalid activation code");
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
