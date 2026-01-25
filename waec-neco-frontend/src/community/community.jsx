import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setSEO } from "../utils/seo";

import CommunityHeader from "./components/communityHeader";
import GroupList from "./components/GroupList";
import ChatPanel from "./components/ChatPanel";

export default function Community() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeGroup, setActiveGroup] = useState("general");

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [user, loading, navigate, location]);

  /* ================= SEO ================= */
  useEffect(() => {
    setSEO({
      title: "Student Community | Exam Sharp School",
      description: "Discuss WAEC & NECO questions with other students",
    });
  }, []);

  /* ================= WAIT ================= */
  if (loading || !user) return null;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
      }}
    >
      <GroupList active={activeGroup} onSelect={setActiveGroup} />

      <div style={{ flex: 1 }}>
        <CommunityHeader user={user} group={activeGroup} />
        <ChatPanel group={activeGroup} user={user} />
      </div>
    </div>
  );
}
