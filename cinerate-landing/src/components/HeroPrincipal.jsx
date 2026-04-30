import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CONTENT_API_BASE_URL,
  CONTENT_API_KEY,
  CONTENT_IMAGE_BASE_URL,
  VIDEO_EMBED_BASE_URL
} from '../services/api';
import './HeroPrincipal.css';

const AUTO_ROTATE_MS = 25000;

const buildTrailerPosterUrl = (videoId, quality = 'maxresdefault') =>
  `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;

const buildContentImageUrl = (size, path) => `${CONTENT_IMAGE_BASE_URL}/${size}${path}`;

const TRAILERS_BY_THEME = {
  filmes: [
    {
      id: 1,
      title: 'Duna: Parte Dois',
      displayTitle: 'DUNA',
      subtitle: 'Filme em destaque',
      mediaType: 'movie',
      queryTitle: 'Dune: Part Two',
      titleClass: 'theme-dune',
      kicker: 'Cartaz cinematografico',
      videoId: 'Way9Dexny3w'
    },
    {
      id: 2,
      title: 'Deadpool & Wolverine',
      displayTitle: 'Deadpool & Wolverine',
      subtitle: 'Filme em destaque',
      mediaType: 'movie',
      queryTitle: 'Deadpool & Wolverine',
      titleClass: 'theme-comic',
      kicker: 'Cartaz cinematografico',
      videoId: '73_1biulkYk'
    },
    {
      id: 3,
      title: 'Gladiador II',
      displayTitle: 'Gladiador II',
      subtitle: 'Filme em destaque',
      mediaType: 'movie',
      queryTitle: 'Gladiator II',
      titleClass: 'theme-epic',
      kicker: 'Cartaz cinematografico',
      videoId: '4rgYUipGJNo'
    },
    {
      id: 4,
      title: 'Nosferatu',
      displayTitle: 'Nosferatu',
      subtitle: 'Filme em destaque',
      mediaType: 'movie',
      queryTitle: 'Nosferatu',
      titleClass: 'theme-horror',
      kicker: 'Cartaz cinematografico',
      videoId: 'b59rxDB_JRg'
    },
    {
      id: 5,
      title: 'The Batman',
      displayTitle: 'The Batman',
      subtitle: 'Filme em destaque',
      mediaType: 'movie',
      queryTitle: 'The Batman',
      titleClass: 'theme-noir',
      kicker: 'Cartaz cinematografico',
      videoId: 'mqqft2x_Aa4'
    },
    {
      id: 6,
      title: 'Avatar: O Ultimo Mestre do Ar',
      displayTitle: 'Avatar',
      subtitle: 'Serie em destaque',
      mediaType: 'tv',
      queryTitle: 'Avatar: The Last Airbender',
      titleClass: 'theme-avatar',
      kicker: 'Cartaz da serie',
      videoId: 'waJKJW_XU90'
    }
  ],
  series: [
    {
      id: 101,
      title: 'Avatar: O Ultimo Mestre do Ar',
      displayTitle: 'Avatar',
      subtitle: 'Serie em destaque',
      mediaType: 'tv',
      queryTitle: 'Avatar: The Last Airbender',
      titleClass: 'theme-avatar',
      kicker: 'Cartaz da serie',
      videoId: 'waJKJW_XU90'
    },
    {
      id: 102,
      title: 'The Last of Us',
      displayTitle: 'The Last of Us',
      subtitle: 'Serie em destaque',
      mediaType: 'tv',
      queryTitle: 'The Last of Us',
      titleClass: 'theme-infected',
      kicker: 'Cartaz da serie',
      videoId: 'uLtkt8BonwM'
    },
    {
      id: 103,
      title: 'Stranger Things 4',
      displayTitle: 'Stranger Things',
      subtitle: 'Serie em destaque',
      mediaType: 'tv',
      queryTitle: 'Stranger Things',
      titleClass: 'theme-stranger',
      kicker: 'Cartaz da serie',
      videoId: 'yQEondeGvKo'
    },
    {
      id: 104,
      title: 'Wandinha',
      displayTitle: 'Wandinha',
      subtitle: 'Serie em destaque',
      mediaType: 'tv',
      queryTitle: 'Wednesday',
      titleClass: 'theme-horror',
      kicker: 'Cartaz da serie',
      videoId: 'Di310WS8zLk'
    },
    {
      id: 105,
      title: 'The Boys',
      displayTitle: 'The Boys',
      subtitle: 'Serie em destaque',
      mediaType: 'tv',
      queryTitle: 'The Boys',
      titleClass: 'theme-comic',
      kicker: 'Cartaz da serie',
      videoId: 'EzFXDvC-EwM'
    },
    {
      id: 106,
      title: 'House of the Dragon',
      displayTitle: 'House of the Dragon',
      subtitle: 'Serie em destaque',
      mediaType: 'tv',
      queryTitle: 'House of the Dragon',
      titleClass: 'theme-epic',
      kicker: 'Cartaz da serie',
      videoId: 'DotnJ7tTA34'
    }
  ]
};

function HeroPrincipal({ theme = 'filmes' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [posterAssets, setPosterAssets] = useState({});
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

  useEffect(() => {
    if (!CONTENT_API_KEY || posterAssets[activeTrailer.id]) return undefined;

    const controller = new AbortController();
    const mediaType = activeTrailer.mediaType || (theme === 'series' ? 'tv' : 'movie');
    const query = encodeURIComponent(activeTrailer.queryTitle || activeTrailer.title);

    const loadPosterAsset = async () => {
      try {
        const response = await fetch(
          `${CONTENT_API_BASE_URL}/search/${mediaType}?api_key=${CONTENT_API_KEY}&language=pt-BR&include_adult=false&page=1&query=${query}`,
          { signal: controller.signal }
        );

        if (!response.ok) return;

        const data = await response.json();
        const match = (data.results || []).find((item) => item.poster_path || item.backdrop_path);

        if (!match) return;

        setPosterAssets((currentAssets) => ({
          ...currentAssets,
          [activeTrailer.id]: {
            posterPath: match.poster_path,
            backdropPath: match.backdrop_path
          }
        }));
      } catch (error) {
        if (error.name !== 'AbortError') {
          setPosterAssets((currentAssets) => currentAssets);
        }
      }
    };

    loadPosterAsset();

    return () => controller.abort();
  }, [activeTrailer, posterAssets, theme]);

  const goToSlide = (index) => {
    setIsPreviewPlaying(false);
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

  const scrollToCatalog = () => {
    document.querySelector('.rows-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const playPreviewWithSound = () => {
    setIsPreviewPlaying(true);
    setIsMuted(false);
    sendPlayerCommand('playVideo');
    sendPlayerCommand('unMute');
    sendPlayerCommand('setVolume', [100]);
  };

  const handlePosterError = (event) => {
    if (event.currentTarget.src.includes('hqdefault')) return;
    event.currentTarget.src = buildTrailerPosterUrl(activeTrailer.videoId, 'hqdefault');
  };

  const activeAsset = posterAssets[activeTrailer.id];
  const fallbackPosterUrl = buildTrailerPosterUrl(activeTrailer.videoId);
  const posterUrl = activeAsset?.posterPath
    ? buildContentImageUrl('w780', activeAsset.posterPath)
    : fallbackPosterUrl;
  const backdropUrl = activeAsset?.backdropPath
    ? buildContentImageUrl('w1280', activeAsset.backdropPath)
    : fallbackPosterUrl;

  return (
    <section className="hero-container-main" style={{ '--rotation-ms': `${AUTO_ROTATE_MS}ms` }}>
      <div className={`slide-principal ${isPreviewPlaying ? 'preview-playing' : ''}`}>
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

        <img
          key={`${activeTrailer.id}-backdrop`}
          className="hero-image-frame hero-backdrop-frame"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          onError={handlePosterError}
        />

        <img
          key={`${activeTrailer.id}-poster`}
          className="hero-poster-frame"
          src={posterUrl}
          alt={`Cartaz de ${activeTrailer.title}`}
          onError={handlePosterError}
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
            <span className="hero-kicker">{activeTrailer.kicker}</span>
            <h2 className={`hero-title-art ${activeTrailer.titleClass || ''}`}>
              {activeTrailer.displayTitle || activeTrailer.title}
            </h2>
            <p>{activeTrailer.subtitle}</p>

            <div className="hero-actions">
              <button type="button" className="hero-action hero-action-primary" onClick={scrollToCatalog}>
                Explorar
              </button>
              <button type="button" className="hero-action hero-action-secondary" onClick={playPreviewWithSound}>
                Trailer
              </button>
            </div>

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
