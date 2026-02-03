import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate('/');
  }

  return (
    <div>
      <Navbar />
      <h1>Profile Page</h1>
      {user && <p>Welcome, {user.email}!</p>}
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default Profile;