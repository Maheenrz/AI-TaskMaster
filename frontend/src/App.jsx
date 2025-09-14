import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TasksProvider } from "./context/TasksProvider"; // ✅
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import Tasks from "./pages/Tasks";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Navbar from "./components/common/Navbar";
import "./App.css";

function App() {
  return (
      <Router>
        <TasksProvider> 
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path ="/signup" element={<SignUp />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </TasksProvider>
      </Router>

  );
}

export default App;
