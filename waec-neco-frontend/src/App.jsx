import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Activate from "./pages/Activate";
import Question from "./pages/Questions";
import Admin from "./pages/Admin";
import Community from "./pages/Community";
import Test from "./pages/Test";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AdBlockNotice from "./components/AdBlockNotice";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/question/:id" element={<Question />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/community" element={<Community />} />
        <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <AdsAutoRefresh />
    </BrowserRouter>
    </>
  );
}




