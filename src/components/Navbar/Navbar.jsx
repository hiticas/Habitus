import { Link } from "react-router-dom";
import './Navbar.scss';

const Navbar = () => {
  return (
    <header className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
    </header>
  );
}

export default Navbar;