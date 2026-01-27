import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="container">
        <Link to="/">Workout Buddy</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
    </header>
  );
}

export default Navbar;