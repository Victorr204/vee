import BottomDock from "../navigation/BottomDock";

export default function MobileLayout({ children }) {
  return (
    <>
      {children}
      <BottomDock />
    </>
  );
}
