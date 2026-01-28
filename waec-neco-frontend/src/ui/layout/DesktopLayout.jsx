import FloatingNavbar from "../navigation/FloatingNavbar";

export default function DesktopLayout({ children }) {
  return (
    <>
      <FloatingNavbar />
      <main style={{ paddingTop: 70 }}>{children}</main>
    </>
  );
}
