import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Play from "./pages/Play";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Play />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}