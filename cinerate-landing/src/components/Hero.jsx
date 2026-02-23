import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>Rate. Discover. Share.</h1>
          <p>HMDb helps you track movies, series and books with a clean personal catalog.</p>

          <div className="hero-buttons">
            <button type="button" className="btn-primary">
              Get Started
            </button>
            <button type="button" className="btn-secondary">
              Explore
            </button>
          </div>
        </div>

        <div className="hero-cards">
          <div className="mock-card">* 4.8 - Interstellar</div>
          <div className="mock-card">* 4.6 - Breaking Bad</div>
          <div className="mock-card">* 4.9 - Lord of the Rings</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
