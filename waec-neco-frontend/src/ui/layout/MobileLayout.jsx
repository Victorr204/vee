import FloatingNavbar from "../navigation/FloatingNavbar";
import BottomDock from "../navigation/BottomDock";
import { useAuth } from "../../context/AuthContext";

export default function MobileLayout({ children }) {
  const { user } = useAuth();

  return (
    <>
      <FloatingNavbar mobile />
      <main style={{ paddingTop: 70, paddingBottom: 80 }}>
        {children}
      </main>
      <BottomDock user={user} />
    </>
  );
}
