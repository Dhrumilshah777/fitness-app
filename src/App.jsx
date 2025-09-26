import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkoutForm from "./components/WorkoutForm";
import DietForm from "./components/DietForm";
import { AuthProvider } from "./context/AuthContext";
import Progress from "./components/ProgressChart";
import Goals from "./components/Goals";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout" element={<WorkoutForm />} />
          <Route path="/diet" element={<DietForm />} />
          <Route path="/chart" element={<Progress/>}/>
          <Route path="/goals" element={<Goals/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
