import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Activate from "./pages/Activate";
import Question from "./pages/Question";
import Admin from "./pages/Admin";
import Community from "./pages/Community";
import Test from "./pages/Test";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AdBlockNotice from "./components/AdBlockNotice";

function AdsAutoRefresh() {
  const location = useLocation();

  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {}
  }, [location.pathname]);

  return null;
}



export default function App() {
  return (
  <>
   <AdBlockNotice />
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/question/:id" element={<Question />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/community" element={<Community />} />
        <Route path="/test" element={<Test />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/term" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <AdsAutoRefresh />
    </BrowserRouter>
    </>
  );
}
