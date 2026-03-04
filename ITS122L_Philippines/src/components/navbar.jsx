import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await logout(); // ← was signOut()
    navigate('/');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Hotel Philippines
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/bookings" className="nav-link">Bookings</Link>
          
          {user ? (
            <div className="user-menu">
              <span className="user-email">
                {user.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              Login
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand {
          font-size: 24px;
          font-weight: 700;
          color: #667eea;
          text-decoration: none;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #667eea;
        }

        .btn-login {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s, opacity 0.2s;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-email {
          color: #333;
          font-weight: 500;
        }

        .btn-logout {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-logout:hover {
          background: #eee;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
