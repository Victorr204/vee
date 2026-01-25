import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { avatars } from "../data/avatars";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getUserProfile(user.uid);
      setProfile(data);
      setUsername(data.username);
      setAvatar(data.avatar);
    }
    load();
  }, [user]);

  const save = async () => {
    setSaving(true);
    await updateUserProfile(user.uid, { username, avatar });
    setSaving(false);
    alert("Profile updated");
  };

  if (!profile) return null;

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", color: "#fff" }}>
      <h2>Your Profile</h2>

      <label>Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />

      <label>Choose Avatar</label>
      <div style={styles.avatars}>
        {avatars.map((a) => (
          <button
            key={a}
            onClick={() => setAvatar(a)}
            style={{
              ...styles.avatar,
              border: avatar === a ? "2px solid #10b981" : "1px solid #333",
            }}
          >
            {a}
          </button>
        ))}
      </div>

      <button onClick={save} disabled={saving} style={styles.btn}>
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    background: "#1f2937",
    color: "#fff",
    borderRadius: 6,
    border: "1px solid #333",
  },
  avatars: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  avatar: {
    fontSize: 24,
    padding: 10,
    borderRadius: 6,
    background: "#111827",
    cursor: "pointer",
  },
  btn: {
    padding: 12,
    width: "100%",
    background: "#10b981",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
