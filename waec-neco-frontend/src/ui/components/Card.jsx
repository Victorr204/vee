export default function Card({ children, style = {}, hover = false }) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 12,
        padding: 18,
        marginBottom: 20,
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...(hover && {
          cursor: "pointer",
        }),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.35)";
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.25)";
        }
      }}
    >
      {children}
    </div>
  );
}
