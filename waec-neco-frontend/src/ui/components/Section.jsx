 export default function Section({ title, children, style = {} }) {
  return (
    <section style={{ marginBottom: 50, ...style }}>
      {title && (
        <h2
          style={{
            fontSize: 22,
            marginBottom: 18,
            color: "#ffffff",
            borderLeft: "4px solid #2563eb",
            paddingLeft: 10,
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
