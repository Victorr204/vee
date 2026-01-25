// community/ui/components.jsx
import { colors } from "./color";
import { typography } from "./typography";

export const Card = ({ children, style }) => (
  <div style={{ background: colors.card, borderRadius: 10, padding: 15, ...style }}>
    {children}
  </div>
);

export const Button = ({ children, style, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 20px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontFamily: typography.fontPrimary,
      color: colors.textLight,
      background: colors.primary,
      ...style,
    }}
  >
    {children}
  </button>
);

export const Input = ({ ...props }) => (
  <input
    {...props}
    style={{
      padding: 12,
      borderRadius: 6,
      border: "1px solid #333",
      marginBottom: 10,
      width: "100%",
      fontFamily: typography.fontPrimary,
    }}
  />
);

export const TextArea = ({ ...props }) => (
  <textarea
    {...props}
    style={{
      padding: 12,
      borderRadius: 6,
      border: "1px solid #333",
      marginBottom: 10,
      width: "100%",
      resize: "vertical",
      fontFamily: typography.fontPrimary,
    }}
  />
);