import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalhesPage.css';

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

function DetalhesPage() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [ondeAssistir, setOndeAssistir] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://api.themoviedb.org/3/${tipo}/${id}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=videos,credits,watch/providers`)
      .then(res => res.json())
      .then(data => {
        setDados(data);
        const video = data.videos?.results.find(v => (v.type === "Trailer") && v.site === "YouTube");
        if (video) setTrailer(video.key);
        setOndeAssistir(data['watch/providers']?.results?.BR);
      });
  }, [tipo, id]);

  if (!dados) return <div className="loading-state">Carregando...</div>;

  // Lógica para link o mais direto possível (Busca interna nos serviços)
  const gerarLinkDireto = (providerName) => {
    const nomeBusca = encodeURIComponent(dados.title || dados.name);
    
    if (providerName.toLowerCase().includes('netflix')) {
      return `https://www.netflix.com/search?q=${nomeBusca}`;
    }
    if (providerName.toLowerCase().includes('disney')) {
      return `https://www.disneyplus.com/search`;
    }
    if (providerName.toLowerCase().includes('amazon') || providerName.toLowerCase().includes('prime')) {
      return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${nomeBusca}`;
    }
    if (providerName.toLowerCase().includes('hbo') || providerName.toLowerCase().includes('max')) {
      return `https://www.max.com/search/${nomeBusca}/`;
    }
    
    // Fallback: Link oficial do TMDB que mostra todas as opções
    return ondeAssistir?.link || "#";
  };

  const diretor = dados.credits?.crew?.find(person => person.job === "Director")?.name;

  return (
    <div className="imdb-clone-container">
      <header className="imdb-header-main">
        <div className="title-block">
          <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>
          <h1>{dados.title || dados.name}</h1>
          <div className="sub-header-info">
            <span>{dados.release_date?.split('-')[0] || dados.first_air_date?.split('-')[0]}</span>
            <span> • </span>
            <span>{dados.runtime || (dados.episode_run_time && dados.episode_run_time[0]) || 'N/A'} min</span>
          </div>
        </div>
        
        <div className="ratings-block">
          <div className="rating-item">
            <span className="rating-label">AVALIAÇÃO TMDB</span>
            <div className="rating-score">
              <span className="star-icon" style={{color: '#f5c518', marginRight: '5px'}}>★</span>
              <strong style={{fontSize: '1.5rem'}}>{dados.vote_average?.toFixed(1)}</strong>
              <span style={{color: '#888'}}>/10</span>
            </div>
          </div>
        </div>
      </header>

      <section className="media-showcase">
        <div className="main-poster">
          <img src={`https://image.tmdb.org/t/p/w500${dados.poster_path}`} alt="Poster" />
        </div>

        <div className="main-trailer">
          {trailer ? (
            <iframe 
              src={`https://www.youtube.com/embed/${trailer}?rel=0&modestbranding=1&autoplay=0`} 
              frameBorder="0" 
              allowFullScreen
            ></iframe>
          ) : (
            <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#111'}}>
              Trailer não disponível
            </div>
          )}
        </div>

        <div className="side-media-panel">
          <div className="watch-section">
            <span className="watch-title">Onde Assistir</span>
            <div className="providers-list">
              {ondeAssistir?.flatrate ? (
                ondeAssistir.flatrate.map(p => (
                  <a 
                    key={p.provider_id} 
                    href={gerarLinkDireto(p.provider_name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="provider-link"
                  >
                    <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} />
                  </a>
                ))
              ) : (
                <p style={{fontSize: '0.7rem', color: '#888'}}>Não disponível em streaming (BR)</p>
              )}
            </div>
          </div>
          <div className="side-card-watchlist">
            <span className="icon" style={{fontSize: '1.5rem', marginBottom: '5px'}}>+</span>
            <p style={{fontSize: '0.8rem', fontWeight: 'bold'}}>MINHA LISTA</p>
          </div>
        </div>
      </section>

      <section className="technical-info">
        <p className="synopsis-text">{dados.overview || "Sinopse não disponível em português."}</p>
        
        <div className="crew-item">
          <strong>Direção</strong> 
          <span>{diretor || 'Informação não disponível'}</span>
        </div>
        
        <div className="crew-item">
          <strong>Gêneros</strong>
          <div style={{display: 'flex', gap: '10px'}}>
            {dados.genres?.map(g => (
              <span key={g.id} style={{color: '#5799ef'}}>{g.name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DetalhesPage;