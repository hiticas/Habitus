import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import './Navbar.scss';

const Navbar = () => {
  const { user } = useAuthContext();

  return (
    <header className="navbar">
        {user && <div className="links-wrapper">
          <Link to="/design-system">DesignSystem</Link>
          <div className="links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/habits">Habits</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>}
        {!user && <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>}
    </header>
  );
}

export default Navbar;