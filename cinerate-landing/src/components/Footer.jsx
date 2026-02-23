import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">HMDb</span>
          <p>Rate. Discover. Organize.</p>
        </div>

        <nav className="footer-links" aria-label="Footer links">
          <Link to="/filmes">Filmes</Link>
          <Link to="/series">Series</Link>
          <Link to="/livros">Livros</Link>
        </nav>

        <p className="footer-copy">&copy; {currentYear} HMDb. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
