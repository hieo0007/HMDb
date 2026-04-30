import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const USER_STORAGE_KEY = 'user_name';
const USER_ID_STORAGE_KEY = 'user_id';
const getStoredUserName = () =>
  localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY) || '';

const MENU_LINKS = [
  { label: 'Novidades', path: '/filmes' },
  { label: 'Populares', path: '/series' },
  { label: 'Explorar Tudo', path: '/livros' }
];

const CATEGORY_LINKS = [
  { label: 'Filmes', path: '/filmes' },
  { label: 'Series', path: '/series' },
  { label: 'Livros', path: '/livros' }
];

function Navbar({ onSearch, searchValue = '' }) {
  const [currentUserName, setCurrentUserName] = useState(() => getStoredUserName());
  const [mobileMenuPath, setMobileMenuPath] = useState('');
  const location = useLocation();
  const isMobileMenuOpen = mobileMenuPath === location.pathname;

  const activePath = useMemo(() => {
    if (location.pathname.startsWith('/filmes')) return '/filmes';
    if (location.pathname.startsWith('/series')) return '/series';
    if (location.pathname.startsWith('/livros')) return '/livros';
    return '';
  }, [location.pathname]);
  const userInitial = currentUserName.trim().charAt(0).toUpperCase();

  useEffect(() => {
    const syncUserName = () => {
      setCurrentUserName(getStoredUserName());
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
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_STORAGE_KEY);
    setCurrentUserName('');
    setMobileMenuPath('');
    window.dispatchEvent(new Event('hmdb:user-change'));
  };

  const closeMobileMenu = () => {
    setMobileMenuPath('');
  };

  return (
    <header className={`main-navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="navbar-content">
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={isMobileMenuOpen ? 'Fechar menu de navegacao' : 'Abrir menu de navegacao'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-main-nav"
          onClick={() =>
            setMobileMenuPath((currentPath) =>
              currentPath === location.pathname ? '' : location.pathname
            )
          }
        >
          <span />
          <span />
          <span />
        </button>

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
              <span className="user-name" data-initial={userInitial}>
                Hello, {currentUserName}
              </span>
              <button type="button" onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/pagelogin" className="login-btn">
              Entrar
            </Link>
          )}
        </div>
      </div>

      <nav
        id="mobile-main-nav"
        className={`mobile-nav-panel ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-drawer-auth">
          {currentUserName ? (
            <>
              <span className="mobile-drawer-user">Conectado como {currentUserName}</span>
              <button type="button" className="mobile-auth-btn" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/pagelogin" className="mobile-auth-btn primary" onClick={closeMobileMenu}>
                Entrar
              </Link>
              <Link
                to="/pagelogin?mode=signup"
                className="mobile-auth-btn"
                onClick={closeMobileMenu}
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>

        <div className="mobile-drawer-group">
          {MENU_LINKS.map((link) => (
            <Link key={link.label} to={link.path} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mobile-drawer-group">
          <span className="mobile-drawer-label">Categorias</span>
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={activePath === link.path ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <button
        type="button"
        className={`mobile-nav-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Fechar menu"
        onClick={closeMobileMenu}
      />
    </header>
  );
}

export default Navbar;
