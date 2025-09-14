import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const onLogout = () => {
    localStorage.removeItem("token");
    // optionally clear other local state
    navigate("/");
    // reload tasks by letting provider fetch (it will try with no token)
    window.location.reload();
  };

  const linkClass = (path) =>
    `py-2 px-3 rounded-sm transition ${
      location.pathname === path ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
            TF
          </div>
          <span className="font-semibold text-lg">TaskFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/about" className={linkClass("/about")}>About</Link>
          {isLoggedIn && <Link to="/tasks" className={linkClass("/tasks")}>Tasks</Link>}
        </div>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md">Get Started</Link>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/home")} className="px-3 py-2 rounded-md">Dashboard</button>
              <button onClick={onLogout} className="bg-red-500 text-white px-3 py-2 rounded-md">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
