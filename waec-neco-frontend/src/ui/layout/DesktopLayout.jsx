import FloatingNavbar from "../navigation/FloatingNavbar";

export default function DesktopLayout({ children }) {
  return (
    <>
      <FloatingNavbar />
      {children}
    </>
  );
}
 