import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const USER_STORAGE_KEY = 'user_name';

function Navbar({ onSearch, searchValue = '' }) {
  const [currentUserName, setCurrentUserName] = useState(
    () => localStorage.getItem(USER_STORAGE_KEY) || ''
  );
  const location = useLocation();

  const activePath = useMemo(() => {
    if (location.pathname.startsWith('/filmes')) return '/filmes';
    if (location.pathname.startsWith('/series')) return '/series';
    if (location.pathname.startsWith('/livros')) return '/livros';
    return '';
  }, [location.pathname]);

  useEffect(() => {
    const syncUserName = () => {
      setCurrentUserName(localStorage.getItem(USER_STORAGE_KEY) || '');
    };

    syncUserName();
    window.addEventListener('storage', syncUserName);
    window.addEventListener('hmdb:user-change', syncUserName);
    return () => {
      window.removeEventListener('storage', syncUserName);
      window.removeEventListener('hmdb:user-change', syncUserName);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUserName('');
    window.dispatchEvent(new Event('hmdb:user-change'));
  };

  return (
    <header className="main-navbar">
      <div className="navbar-content">
        <Link to="/" className="brand-container" aria-label="HMDb home">
          <img src="/favicon.png" alt="HMDb logo" className="navbar-logo-img" />
          <span className="logo">HMDb</span>
        </Link>

        <nav className="nav-links-container" aria-label="Main navigation">
          <Link to="/filmes" className={activePath === '/filmes' ? 'active' : ''}>
            Filmes
          </Link>
          <Link to="/series" className={activePath === '/series' ? 'active' : ''}>
            Series
          </Link>
          <Link to="/livros" className={activePath === '/livros' ? 'active' : ''}>
            Livros
          </Link>
        </nav>

        <div className="right-section-container">
          <div className="input-wrapper">
            <button type="button" className="icon" aria-label="Search">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 22L20 20"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <input
              type="text"
              className={`input ${searchValue ? 'has-content' : ''}`}
              placeholder="Search..."
              value={searchValue}
              onChange={(event) => onSearch?.(event.target.value)}
            />
          </div>

          {currentUserName ? (
            <div className="user-section">
              <span className="user-name">Hello, {currentUserName}</span>
              <button type="button" onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/pagelogin" className="login-btn">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
