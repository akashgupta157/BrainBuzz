import "./index.css";
import App from "./App.jsx";
import Quiz from "./pages/Quiz.jsx";
import ScoreCard from "./pages/ScoreCard.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/scorecard" element={<ScoreCard />} />
    </Routes>
  </BrowserRouter>
);
