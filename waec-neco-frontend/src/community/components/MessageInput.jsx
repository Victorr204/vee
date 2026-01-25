import { useState } from "react";
import { colors } from "../ui/color";
import { typography } from "../ui/typography";
import { Button, Input } from "../ui/components";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/*
  MESSAGE INPUT (Firestore)
  - Writes messages directly to Firestore
  - No backend API
  - Real-time compatible
*/

export default function MessageInput({ group, user }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!text.trim() || !user || !group) return;

    setSending(true);

    try {
      await addDoc(
        collection(db, "groups", group, "messages"),
        {
          text: text.trim(),
          userId: user.uid,
          username:
            user.username ||
            user.displayName ||
            user.email?.split("@")[0] ||
            "Student",
          avatar: user.avatar || null,
          createdAt: serverTimestamp(),
        }
      );

      setText("");
    } catch (err) {
      alert("Message failed to send");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.inputBox}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        style={{ flex: 1 }}
      />

      <Button
        onClick={submit}
        variant="primary"
        disabled={sending}
        style={{ marginLeft: 8, ...typography.button }}
      >
        {sending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}

const styles = {
  inputBox: {
    display: "flex",
    padding: 10,
    background: colors.background,
    borderTop: `1px solid ${colors.border}`,
    alignItems: "center",
  },
};
