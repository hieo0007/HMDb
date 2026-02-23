import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VIDEO_EMBED_BASE_URL } from '../services/api';
import './HeroPrincipal.css';

const AUTO_ROTATE_MS = 25000;

const TRAILERS_BY_THEME = {
  filmes: [
    { id: 1, title: 'Duna: Parte Dois', subtitle: 'Official preview', duration: '2:46', videoId: 'Way9Dexny3w' },
    { id: 2, title: 'Deadpool & Wolverine', subtitle: 'Official preview', duration: '2:40', videoId: '73_1biulkYk' },
    { id: 3, title: 'Gladiador II', subtitle: 'Official preview', duration: '2:20', videoId: '4rgYUipGJNo' },
    { id: 4, title: 'Nosferatu', subtitle: 'Official preview', duration: '2:18', videoId: 'b59rxDB_JRg' },
    { id: 5, title: 'The Batman', subtitle: 'Official preview', duration: '2:38', videoId: 'mqqft2x_Aa4' },
    { id: 6, title: 'Avatar: O Ultimo Mestre do Ar', subtitle: 'Official preview', duration: '2:02', videoId: 'waJKJW_XU90' }
  ],
  series: [
    { id: 101, title: 'Avatar: O Ultimo Mestre do Ar', subtitle: 'Series preview', duration: '2:02', videoId: 'waJKJW_XU90' },
    { id: 102, title: 'The Last of Us', subtitle: 'Series preview', duration: '2:23', videoId: 'uLtkt8BonwM' },
    { id: 103, title: 'Stranger Things 4', subtitle: 'Series preview', duration: '3:17', videoId: 'yQEondeGvKo' },
    { id: 104, title: 'Wandinha', subtitle: 'Series preview', duration: '2:12', videoId: 'Di310WS8zLk' },
    { id: 105, title: 'The Boys', subtitle: 'Series preview', duration: '2:43', videoId: 'EzFXDvC-EwM' },
    { id: 106, title: 'House of the Dragon', subtitle: 'Series preview', duration: '2:53', videoId: 'DotnJ7tTA34' }
  ]
};

function HeroPrincipal({ theme = 'filmes' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const frameRef = useRef(null);
  const trailers = TRAILERS_BY_THEME[theme] || TRAILERS_BY_THEME.filmes;
  const activeTrailer = trailers[activeIndex] || trailers[0];
  const totalTrailers = trailers.length;

  const origin = useMemo(
    () => (typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''),
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveIndex((previous) => (previous + 1) % totalTrailers);
    }, AUTO_ROTATE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, totalTrailers]);

  const goToSlide = (index) => {
    setActiveIndex((index + totalTrailers) % totalTrailers);
  };

  const sendPlayerCommand = useCallback((command, args = []) => {
    const frameWindow = frameRef.current?.contentWindow;
    if (!frameWindow) return;

    frameWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args
      }),
      '*'
    );
  }, []);

  const applyAudioState = useCallback(() => {
    if (isMuted) {
      sendPlayerCommand('mute');
      return;
    }

    sendPlayerCommand('unMute');
    sendPlayerCommand('setVolume', [100]);
  }, [isMuted, sendPlayerCommand]);

  useEffect(() => {
    const timer = window.setTimeout(applyAudioState, 280);
    return () => window.clearTimeout(timer);
  }, [activeIndex, applyAudioState]);

  return (
    <section className="hero-container-main" style={{ '--rotation-ms': `${AUTO_ROTATE_MS}ms` }}>
      <div className="slide-principal">
        <iframe
          key={activeTrailer.id}
          ref={frameRef}
          className="hero-trailer-frame"
          src={`${VIDEO_EMBED_BASE_URL}/${activeTrailer.videoId}?autoplay=1&mute=1&controls=0&disablekb=1&iv_load_policy=3&cc_load_policy=0&fs=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`}
          title={`Preview ${activeTrailer.title}`}
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          onLoad={applyAudioState}
          allowFullScreen
        />

        <label
          className="hero-volume"
          aria-label={isMuted ? 'Enable sound' : 'Mute preview'}
          title={isMuted ? 'Enable sound' : 'Mute preview'}
        >
          <input type="checkbox" checked={!isMuted} onChange={() => setIsMuted((previous) => !previous)} />
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
          onClick={() => goToSlide(activeIndex - 1)}
          aria-label="Previous preview"
        >
          &lt;
        </button>

        <button
          type="button"
          className="hero-arrow right"
          onClick={() => goToSlide(activeIndex + 1)}
          aria-label="Next preview"
        >
          &gt;
        </button>

        <div className="gradient-overlay-hero">
          <div className="hero-main-info">
            <span className="duration-hero">{activeTrailer.duration}</span>
            <h2>{activeTrailer.title}</h2>
            <p>{activeTrailer.subtitle}</p>

            <div className="hero-indicators" role="tablist" aria-label="Preview list">
              {trailers.map((trailer, index) => (
                <button
                  key={trailer.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  className={`hero-indicator ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  title={trailer.title}
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
