import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">CineRate</span>
          <p>Avalie. Descubra. Compartilhe.</p>
        </div>

        <nav className="footer-links" aria-label="Links do rodape">
          <Link to="/filmes">Filmes</Link>
          <Link to="/series">Series</Link>
          <Link to="/livros">Livros</Link>
        </nav>

        <p className="footer-copy">&copy; {year} CineRate. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
