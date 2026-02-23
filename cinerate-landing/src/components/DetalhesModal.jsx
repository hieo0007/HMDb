import { useEffect, useState } from 'react';
import { CONTENT_API_BASE_URL, CONTENT_API_KEY } from '../services/api';
import './DetalhesModal.css';

function DetailsModal({ item, initialTheme, onClose }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!item) return;

    const loadDetails = async () => {
      if (initialTheme === 'livros') {
        setDetails(item.raw?.volumeInfo || null);
        setIsLoading(false);
        return;
      }

      try {
        const contentType = initialTheme === 'filmes' ? 'movie' : 'tv';
        const url = `${CONTENT_API_BASE_URL}/${contentType}/${item.id}?api_key=${CONTENT_API_KEY}&language=pt-BR`;
        const response = await fetch(url);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Failed to load details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [initialTheme, item]);

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-detalhes" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="close-modal" onClick={onClose}>
          &times;
        </button>

        {isLoading ? (
          <div className="loading-modal">Loading...</div>
        ) : (
          <div className="detalhes-grid">
            <div className="detalhes-header">
              <h1>{item.title}</h1>
              <div className="meta-info">
                <span>{details?.release_date?.split('-')[0] || details?.first_air_date?.split('-')[0]}</span>
                {details?.runtime ? <span>{details.runtime} min</span> : null}
                <span className="rating-badge">* {item.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="detalhes-body">
              <div className="poster-destaque">
                <img src={item.imageUrl} alt={item.title} />
              </div>

              <div className="info-texto">
                <h3>Synopsis</h3>
                <p>{details?.overview || 'Synopsis unavailable.'}</p>

                {details?.genres ? (
                  <div className="generos-tags">
                    {details.genres.map((genre) => (
                      <span key={genre.id}>{genre.name}</span>
                    ))}
                  </div>
                ) : null}

                <div className="acoes-modal">
                  <button type="button" className="btn-modal-principal">
                    + My List
                  </button>
                  <button type="button" className="btn-modal-secundario">
                    Rate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailsModal;
