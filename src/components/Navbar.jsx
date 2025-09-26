import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="p-4 bg-purple-700 text-white flex justify-between items-center">
      <h1 className="font-bold text-3xl">FitLife</h1>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/workout" className="hover:underline">Workout</Link>
        <Link to="/diet" className="hover:underline">Diet</Link>

        <div className="flex items-center gap-4">
          {user ? (
            <span>{user.email}</span>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 hover:underline"
            >
              <FaSignInAlt />
              Login
            </Link>
          )}

          <Link to="/profile">
            <FaUserCircle size={32} className="hover:text-gray-200" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
