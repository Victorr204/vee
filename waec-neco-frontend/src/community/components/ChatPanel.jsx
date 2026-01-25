import { useEffect, useState, useRef } from "react";
import { Card } from "../ui/components";
import { colors } from "../ui/color";
import { typography } from "../ui/typography";
import MessageInput from "./MessageInput";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

/*
  CHAT PANEL (Realtime Firestore)
  - Listens to messages in real time
  - Auto-updates on new messages
  - Scrolls to bottom on update
*/

export default function ChatPanel({ group, user }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  /* ================= SCROLL TO BOTTOM ================= */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  /* ================= REAL-TIME LISTENER ================= */
  useEffect(() => {
    if (!group) return;

    const q = query(
      collection(db, "groups", group, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      },
      (error) => {
        console.error("Realtime chat error:", error);
      }
    );

    // Cleanup on group change / unmount
    return () => unsubscribe();
  }, [group]);

  return (
    <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((m) => {
          const isMe = m.userId === user?.uid;

          return (
            <Card
              key={m.id}
              style={{
                marginBottom: 10,
                background: isMe ? colors.primary : colors.card,
                color: colors.textLight,
                padding: 10,
              }}
            >
              <div style={styles.messageHeader}>
                <strong>{m.username || "Student"}</strong>
                <span style={styles.time}>
                  {m.createdAt?.toDate
                    ? m.createdAt.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  wordBreak: "break-word",
                  ...typography.body,
                }}
              >
                {m.text}
              </p>
            </Card>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput group={group} user={user} />
    </Card>
  );
}

const styles = {
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 15,
    background: colors.backgroundDark,
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: typography.small?.fontSize || 14,
  },
  time: {
    fontSize: typography.xSmall?.fontSize || 12,
    color: colors.online,
  },
};