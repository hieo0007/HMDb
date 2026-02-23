import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

// Atualizado: Adicionada a prop onSearch para capturar a digitação
const Navbar = ({ onSearch }) => {
  /* ======================================================
      STATES
  ====================================================== */

  // Guarda nome do usuário salvo no localStorage
  const [userName, setUserName] = useState(null);

  // Detecta rota atual (para marcar link ativo)
  const location = useLocation();

  /* ======================================================
      FUNÇÕES
  ====================================================== */

  // Verifica se existe usuário salvo no localStorage
  const checkUser = () => {
    const savedName = localStorage.getItem("user_name");
    setUserName(savedName);
  };

  // Logout do usuário
  const handleLogout = () => {
    localStorage.removeItem("user_name");
    setUserName(null);
  };

  /* ======================================================
      EFFECTS
  ====================================================== */

  useEffect(() => {
    checkUser();

    // Atualiza caso outra aba altere o localStorage
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  /* ======================================================
      RENDER
  ====================================================== */

  return (
    <>
      <header className="main-navbar">
        <div className="navbar-content">

          {/* =========================
                LOGO / BRAND
          ========================== */}
          {/* Logo leva para a Landing Page (/) */}
          <Link to="/" className="brand-container">
            <img
              src="/favicon.png"
              alt="Logo do Site"
              className="navbar-logo-img"
            />
            <div className="logo">CineRate</div>
          </Link>

          {/* =========================
                LINKS DE NAVEGAÇÃO
          ========================== */}
          <nav className="nav-links-container">
            {/* Atualizado: Link Filmes agora aponta para /filmes */}
            <Link
              to="/filmes"
              className={location.pathname === "/filmes" ? "active" : ""}
            >
              Filmes
            </Link>

            <Link
              to="/series"
              className={location.pathname === "/series" ? "active" : ""}
            >
              Séries
            </Link>

            <Link
              to="/livros"
              className={location.pathname === "/livros" ? "active" : ""}
            >
              Livros
            </Link>
          </nav>

          {/* =========================
                SEÇÃO DIREITA
          ========================== */}
          <div className="right-section-container">

            {/* Barra de busca animada */}
            <div className="input-wrapper">
              <button className="icon">
                <svg
                  width="25"
                  height="25"
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
                className="input"
                placeholder="Buscar..."
                // Atualizado: onChange chama a função de busca
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
            </div>

            {/* =========================
                 USUÁRIO LOGADO OU LOGIN
            ========================== */}
            {userName ? (
              <div className="user-section">
                <span className="user-name">
                  Olá, {userName}
                </span>

                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/pagelogin" className="login-btn">
                Entrar
              </Link>
            )}

          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;