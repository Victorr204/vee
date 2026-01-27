export default function PageContainer({ children }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        paddingTop: isMobile ? 20 : 90,   // space for floating navbar
        paddingBottom: isMobile ? 90 : 40, // space for bottom dock
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
