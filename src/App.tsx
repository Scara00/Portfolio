import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/portfolio";
import Other from "./pages/Other";
import GamingSetup3D from "./components/GamingSetup3D";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/other" element={<Other />} />
        <Route path="/3d-setup" element={<GamingSetup3D />} />
        <Route path="/" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
