import { BrowserRouter, Routes, Route } from "react-router";
import Overlay from "./components/Overlay";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overlay page="Home" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/board" element={<Overlay page="Board" />} />
      </Routes>
    </BrowserRouter>
  );
}
