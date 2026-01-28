export default function PageContainer({ children }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        paddingTop: isMobile ? 20 : 90,
        paddingBottom: isMobile ? 90 : 40,
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
