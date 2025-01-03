import { BrowserRouter, Routes, Route } from "react-router";
import Overlay from "./components/Overlay";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overlay page="Home" />} />
        <Route path="/board/:id" element={<Overlay page="Board" />} />
      </Routes>
    </BrowserRouter>
  );
}
