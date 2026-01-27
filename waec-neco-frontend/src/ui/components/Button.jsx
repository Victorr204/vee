export default function Button({
  children,
  variant = "primary", // primary | secondary | ghost | danger
  style = {},
  ...props
}) {
  const baseStyle = {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    transition: "all 0.2s ease",
  };

  const variants = {
    primary: {
      background: "#2563eb",
      color: "#ffffff",
    },
    secondary: {
      background: "#10b981",
      color: "#ffffff",
    },
    ghost: {
      background: "transparent",
      border: "1px solid #1f2937",
      color: "#9ca3af",
    },
    danger: {
      background: "transparent",
      border: "1px solid #ef4444",
      color: "#ef4444",
    },
  };

  return (
    <button style={{ ...baseStyle, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}
