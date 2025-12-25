import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Activate from "./pages/Activate";
import Question from "./pages/Question";
import Admin from "./pages/Admin";
import Community from "./pages/Community";
import Test from "./pages/Test";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/question/:id" element={<Question />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/community" element={<Community />} />
        <Route path="/test" element={<Test />} />

      </Routes>
    </BrowserRouter>
  );
}
