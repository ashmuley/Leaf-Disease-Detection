import "./navbar.css";
import { Link } from "react-router-dom";
import { logout, isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {


  const navigate = useNavigate();

const handleLogout = () => {
  logout();
  alert("Logged out successfully");
  navigate("/login");
};



  return (
    <nav className="navbar">

      <div className="nav-container">

        <img src="src/assets/logo.png" alt="" />
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

         {isLoggedIn() ? (
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}


      {/* <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link> */}
      </div>


      </div>

     
      
    </nav>
  );
};

export default Navbar;