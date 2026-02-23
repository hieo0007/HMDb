import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './HeroPrincipal.css';

const AUTO_ROTATE_MS = 25000;

const TRAILERS_BY_TEMA = {
  filmes: [
    { id: 1, titulo: 'Duna: Parte Dois', descricao: 'Trailer oficial', duracao: '2:46', youtubeId: 'Way9Dexny3w' },
    { id: 2, titulo: 'Deadpool & Wolverine', descricao: 'Trailer oficial', duracao: '2:40', youtubeId: '73_1biulkYk' },
    { id: 3, titulo: 'Gladiador II', descricao: 'Trailer oficial', duracao: '2:20', youtubeId: '4rgYUipGJNo' },
    { id: 4, titulo: 'Nosferatu', descricao: 'Trailer oficial', duracao: '2:18', youtubeId: 'b59rxDB_JRg' },
    { id: 5, titulo: 'The Batman', descricao: 'Trailer oficial', duracao: '2:38', youtubeId: 'mqqft2x_Aa4' },
    { id: 6, titulo: 'Avatar: O Ultimo Mestre do Ar', descricao: 'Trailer oficial', duracao: '2:02', youtubeId: 'waJKJW_XU90' }
  ],
  series: [
    { id: 101, titulo: 'Avatar: O Ultimo Mestre do Ar', descricao: 'Serie - trailer oficial', duracao: '2:02', youtubeId: 'waJKJW_XU90' },
    { id: 102, titulo: 'The Last of Us', descricao: 'Serie - trailer oficial', duracao: '2:23', youtubeId: 'uLtkt8BonwM' },
    { id: 103, titulo: 'Stranger Things 4', descricao: 'Serie - trailer oficial', duracao: '3:17', youtubeId: 'yQEondeGvKo' },
    { id: 104, titulo: 'Wandinha', descricao: 'Serie - trailer oficial', duracao: '2:12', youtubeId: 'Di310WS8zLk' },
    { id: 105, titulo: 'The Boys', descricao: 'Serie - trailer oficial', duracao: '2:43', youtubeId: 'EzFXDvC-EwM' },
    { id: 106, titulo: 'House of the Dragon', descricao: 'Serie - trailer oficial', duracao: '2:53', youtubeId: 'DotnJ7tTA34' }
  ]
};

function HeroPrincipal({ tema = 'filmes' }) {
  const [ativo, setAtivo] = useState(0);
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef(null);
  const trailers = TRAILERS_BY_TEMA[tema] || TRAILERS_BY_TEMA.filmes;
  const principal = trailers[ativo] || trailers[0];
  const total = trailers.length;
  const origin = useMemo(
    () => (typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''),
    []
  );

  useEffect(() => {
    setAtivo(0);
  }, [tema]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAtivo((prev) => (prev + 1) % total);
    }, AUTO_ROTATE_MS);

    return () => window.clearTimeout(timer);
  }, [ativo, total]);

  const irPara = (index) => {
    const normalized = (index + total) % total;
    setAtivo(normalized);
  };

  const sendPlayerCommand = useCallback((func, args = []) => {
    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow) return;

    frameWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args
      }),
      '*'
    );
  }, []);

  const aplicarAudio = useCallback(() => {
    if (muted) {
      sendPlayerCommand('mute');
      return;
    }

    sendPlayerCommand('unMute');
    sendPlayerCommand('setVolume', [100]);
  }, [muted, sendPlayerCommand]);

  useEffect(() => {
    const timer = window.setTimeout(aplicarAudio, 280);
    return () => window.clearTimeout(timer);
  }, [ativo, aplicarAudio]);

  return (
    <section className="hero-container-main" style={{ '--rotation-ms': `${AUTO_ROTATE_MS}ms` }}>
      <div className="slide-principal">
        <iframe
          key={principal.id}
          ref={iframeRef}
          className="hero-trailer-frame"
          src={`https://www.youtube.com/embed/${principal.youtubeId}?autoplay=1&mute=1&controls=0&disablekb=1&iv_load_policy=3&cc_load_policy=0&fs=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`}
          title={`Trailer ${principal.titulo}`}
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          onLoad={aplicarAudio}
          allowFullScreen
        />

        <label
          className="hero-volume"
          aria-label={muted ? 'Ativar som' : 'Silenciar trailer'}
          title={muted ? 'Ativar som' : 'Silenciar trailer'}
        >
          <input
            type="checkbox"
            checked={!muted}
            onChange={() => setMuted((prev) => !prev)}
          />
          <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="mute">
            <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" />
          </svg>
          <svg viewBox="0 0 448 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="voice">
            <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z" />
          </svg>
        </label>

        <button
          type="button"
          className="hero-arrow left"
          onClick={() => irPara(ativo - 1)}
          aria-label="Trailer anterior"
        >
          &lt;
        </button>

        <button
          type="button"
          className="hero-arrow right"
          onClick={() => irPara(ativo + 1)}
          aria-label="Proximo trailer"
        >
          &gt;
        </button>

        <div className="gradient-overlay-hero">
          <div className="hero-main-info">
            <span className="duration-hero">{principal.duracao}</span>
            <h2>{principal.titulo}</h2>
            <p>{principal.descricao}</p>

            <div className="hero-indicators" role="tablist" aria-label="Lista de trailers">
              {trailers.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === ativo}
                  className={`hero-indicator ${index === ativo ? 'active' : ''}`}
                  onClick={() => irPara(index)}
                  title={item.titulo}
                >
                  <span className="hero-indicator-fill" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroPrincipal;
