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
            <h1>Movies, series and books in one place.</h1>
            <p>Rate, discover and organize your favorites with HMDb.</p>

            <div className="landing-buttons">
              <button type="button" className="btn-start" onClick={() => navigate('/filmes')}>
                Explore Movies
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/pagelogin')}>
                Create Account
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
