import { Card } from "../ui/components";
import { colors } from "../ui/color";
import { typography } from "../ui/typography";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function CommunityHeader({ user, group }) {
  const navigate = useNavigate();

  if (!user) return null;

  const username =
    user.profile?.username ||
    user.displayName ||
    user.email?.split("@")[0] ||
    "Student";

  const avatar = user.profile?.avatar || "🙂";

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <Card style={styles.header}>
      {/* LEFT: GROUP INFO */}
      <div>
        <h3 style={{ ...styles.groupTitle, color: colors.primary }}>
          #{group}
        </h3>
        <p style={{ ...styles.subtitle, ...typography.small }}>
          Study discussion group
        </p>
      </div>

      {/* RIGHT: USER INFO */}
      <div style={styles.userBox}>
        <div style={styles.avatar}>{avatar}</div>

        <span
          style={{
            ...styles.username,
            ...typography.body,
            color: colors.textLight,
          }}
        >
          {username}
        </span>

        <Link to="/profile" style={styles.profileLink}>
          Profile
        </Link>

        <button
          onClick={handleLogout}
          style={{
            ...styles.logoutBtn,
            borderColor: colors.alert,
            color: colors.alert,
          }}
        >
          Logout
        </button>
      </div>
    </Card>
  );
}

const styles = {
  header: {
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: `1px solid ${colors.border}`,
  },

  groupTitle: {
    margin: 0,
    ...typography.h4,
  },

  subtitle: {
    margin: 0,
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    fontSize: 22,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: colors.card,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  username: {
    fontSize: typography.body.fontSize,
  },

  profileLink: {
    color: colors.primary,
    textDecoration: "none",
    fontSize: typography.small.fontSize,
  },

  logoutBtn: {
    background: "transparent",
    border: "1px solid",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: typography.small.fontSize,
  },
};
