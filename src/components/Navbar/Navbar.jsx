import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState } from "react";
import './Navbar.scss';

const Navbar = () => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">

      {/* Mobile Menu Icon */}
      {user && (
        <button 
          className="mobile-menu-icon" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      )}

      {/* Desktop Links */}
      {user && (
        <div className="links-wrapper desktop-only">
          <Link to="/design-system">DesignSystem</Link>
          <div className="links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/habits">Habits</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      )}

      {/* Auth Links for Logged Out Users */}
      {!user && (
        <div className="desktop-only">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}

      {/* MOBILE MENU */}
      {isOpen && (
        <nav className="mobile-nav">
          {user ? (
            <>
              <Link onClick={() => setIsOpen(false)} to="/design-system">DesignSystem</Link>
              <Link onClick={() => setIsOpen(false)} to="/dashboard">Dashboard</Link>
              <Link onClick={() => setIsOpen(false)} to="/habits">Habits</Link>
              <Link onClick={() => setIsOpen(false)} to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link onClick={() => setIsOpen(false)} to="/login">Login</Link>
              <Link onClick={() => setIsOpen(false)} to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
