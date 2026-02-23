import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-overlay">
          <section className="landing-hero">
            <h1>Tudo sobre Filmes, Series e Livros em um so lugar.</h1>
            <p>Avalie, descubra novos titulos e organize sua lista de favoritos com o CineRate.</p>

            <div className="landing-buttons">
              <button className="btn-start" onClick={() => navigate('/filmes')}>
                Explorar Filmes
              </button>
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Criar Conta
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
