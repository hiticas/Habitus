import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import './Navbar.scss';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  }

  return (
    <header className="navbar">
        {user && <div>
          <span>{user.email}</span>
          <Link to="/">Home</Link>
          <Link to="/workout">Workouts</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <button onClick={handleClick}>Logout</button>
        </div>}
        {!user && <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>}
    </header>
  );
}

export default Navbar;