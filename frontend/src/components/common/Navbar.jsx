import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const linkClass = (path) =>
    `py-2 px-4 rounded-lg transition-all duration-200 font-medium ${
      location.pathname === path 
        ? "text-white shadow-sm" 
        : "text-white hover:text-white hover:bg-white/30"
    }` + (location.pathname === path ? " bg-white/20" : "");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#D6A99D] backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-sm">
            T
          </div>
          <span className="font-semibold text-xl text-white">Taskly</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link to="/home" className={linkClass("/home")}>Home</Link>
              <Link to="/tasks" className={linkClass("/tasks")}>Tasks</Link>
              <Link to="/about" className={linkClass("/about")}>About</Link>
            </>
          ) : (
            <>
              <Link to="/" className={linkClass("/")}>Home</Link>
              <Link to="/about" className={linkClass("/about")}>About</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <Link 
              to="/login" 
              className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg font-medium hover:bg-white/30 transition-all duration-200 shadow-sm"
            >
              Get Started
            </Link>
          ) : (
            <button 
              onClick={onLogout} 
              className="bg-white/15 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg font-medium hover:bg-white/25 transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button (Optional - you can add mobile menu later) */}
        <div className="md:hidden">
          <button className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}