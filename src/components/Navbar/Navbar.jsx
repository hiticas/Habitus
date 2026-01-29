import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import './Navbar.scss';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
        {user && <div>
          <span>{user.email}</span>
          <Link to="/home">Home</Link>
          <Link to="/workouts">Workouts</Link>
          <Link to="/habits">Habits</Link>
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