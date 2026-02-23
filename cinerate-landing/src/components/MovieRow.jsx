import { useCallback, useEffect, useRef, useState } from 'react';
import './MovieRow.css';

function MovieRow({ title, items, onItemClick }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateArrows();

    const handleScroll = () => updateArrows();
    const handleResize = () => updateArrows();

    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [items, updateArrows]);

  const scrollTrack = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const amount = Math.max(track.clientWidth * 0.85, 320);
    track.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="movie-row">
      <h2 className="movie-row-title">{title}</h2>

      {items.length === 0 ? (
        <p className="movie-row-empty">Sem titulos nesta categoria.</p>
      ) : (
        <div className="movie-row-slider">
          <button
            type="button"
            className={`movie-row-arrow left ${!canScrollLeft ? 'hidden' : ''}`}
            onClick={() => scrollTrack('left')}
            aria-label={`Voltar na linha ${title}`}
          >
            &lt;
          </button>

          <div className="movie-row-track" ref={trackRef}>
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                className="movie-row-card"
                onClick={() => onItemClick(item)}
              >
                <div className="movie-row-poster">
                  <img src={item.imagem} alt={item.titulo} loading="lazy" />
                </div>
                <div className="movie-row-meta">
                  <strong>{item.titulo}</strong>
                  <span>Nota {item.voto > 0 ? item.voto.toFixed(1) : 'N/A'}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`movie-row-arrow right ${!canScrollRight ? 'hidden' : ''}`}
            onClick={() => scrollTrack('right')}
            aria-label={`Avancar na linha ${title}`}
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
}

export default MovieRow;
