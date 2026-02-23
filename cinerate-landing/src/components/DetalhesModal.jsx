import { useState, useEffect } from 'react';
import './DetalhesModal.css';

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

function DetalhesModal({ item, temaInicial, onClose }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarExtras = async () => {
      if (temaInicial === 'livros') {
        setDetalhes(item.raw?.volumeInfo);
        setCarregando(false);
        return;
      }
      try {
        const tipo = temaInicial === 'filmes' ? 'movie' : 'tv';
        const url = `https://api.themoviedb.org/3/${tipo}/${item.id}?api_key=${TMDB_KEY}&language=pt-BR`;
        const res = await fetch(url);
        const data = await res.json();
        setDetalhes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    };
    buscarExtras();
  }, [item, temaInicial]);

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-detalhes" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>&times;</button>
        
        {carregando ? (
          <div className="loading-modal">Carregando...</div>
        ) : (
          <div className="detalhes-grid">
            <div className="detalhes-header">
              <h1>{item.titulo}</h1>
              <div className="meta-info">
                <span>{detalhes?.release_date?.split('-')[0] || detalhes?.first_air_date?.split('-')[0]}</span>
                {detalhes?.runtime && <span>{detalhes.runtime} min</span>}
                <span className="rating-badge">★ {item.voto.toFixed(1)}</span>
              </div>
            </div>

            <div className="detalhes-body">
              <div className="poster-destaque">
                <img src={item.imagem} alt={item.titulo} />
              </div>
              
              <div className="info-texto">
                <h3>Sinopse</h3>
                <p>{detalhes?.overview || "Sinopse não disponível."}</p>
                
                {detalhes?.genres && (
                  <div className="generos-tags">
                    {detalhes.genres.map(g => <span key={g.id}>{g.name}</span>)}
                  </div>
                )}
                
                <div className="acoes-modal">
                  <button className="btn-modal-principal">
                    + Minha Lista
                  </button>
                  <button className="btn-modal-secundario">
                    Avaliar
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

export default DetalhesModal;