import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CONTENT_API_BASE_URL,
  CONTENT_API_KEY,
  CONTENT_IMAGE_BASE_URL,
  VIDEO_EMBED_BASE_URL
} from '../services/api';
import './DetalhesPage.css';

const DEFAULT_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster';

const buildImageUrl = (size, path) => `${CONTENT_IMAGE_BASE_URL}/${size}${path}`;

function DetailsPage() {
  const { contentType, id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState('');
  const [watchRegionData, setWatchRegionData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadDetails = async () => {
      const response = await fetch(
        `${CONTENT_API_BASE_URL}/${contentType}/${id}?api_key=${CONTENT_API_KEY}&language=pt-BR&append_to_response=videos,credits,watch/providers`
      );
      const data = await response.json();

      setDetails(data);

      const selectedVideo =
        data.videos?.results?.find((video) => video.type === 'Trailer' && video.key) ||
        data.videos?.results?.find((video) => video.key);

      setTrailerKey(selectedVideo?.key || '');
      setWatchRegionData(data['watch/providers']?.results?.BR || null);
    };

    loadDetails().catch(() => {
      setDetails(null);
      setTrailerKey('');
      setWatchRegionData(null);
    });
  }, [contentType, id]);

  const releaseYear = useMemo(
    () =>
      details?.release_date?.split('-')[0] ||
      details?.first_air_date?.split('-')[0] ||
      'N/A',
    [details]
  );

  const runtime = useMemo(
    () => details?.runtime || details?.episode_run_time?.[0] || 'N/A',
    [details]
  );

  const directorName = useMemo(
    () => details?.credits?.crew?.find((person) => person.job === 'Director')?.name || 'Not available',
    [details]
  );

  if (!details) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="details-page-container">
      <header className="details-page-header">
        <div className="title-block">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <h1>{details.title || details.name || 'Untitled'}</h1>
          <div className="sub-header-info">
            <span>{releaseYear}</span>
            <span> | </span>
            <span>{runtime} min</span>
          </div>
        </div>

        <div className="ratings-block">
          <div className="rating-item">
            <span className="rating-label">Community Score</span>
            <div className="rating-score">
              <span className="star-icon" style={{ color: '#f5c518', marginRight: '5px' }}>
                *
              </span>
              <strong style={{ fontSize: '1.5rem' }}>{details.vote_average?.toFixed(1) || 'N/A'}</strong>
              <span style={{ color: '#888' }}>/10</span>
            </div>
          </div>
        </div>
      </header>

      <section className="media-showcase">
        <div className="main-poster">
          <img
            src={details.poster_path ? buildImageUrl('w500', details.poster_path) : DEFAULT_POSTER}
            alt={`${details.title || details.name || 'Title'} poster`}
          />
        </div>

        <div className="main-trailer">
          {trailerKey ? (
            <iframe
              src={`${VIDEO_EMBED_BASE_URL}/${trailerKey}?rel=0&modestbranding=1&autoplay=0`}
              allowFullScreen
              title="Content preview"
            />
          ) : (
            <div className="trailer-unavailable">Preview unavailable</div>
          )}
        </div>

        <div className="side-media-panel">
          <div className="watch-section">
            <span className="watch-title">Where to Watch</span>
            <div className="provider-list">
              {watchRegionData?.flatrate?.length ? (
                watchRegionData.flatrate.map((provider) => (
                  <a
                    key={provider.provider_id}
                    href={watchRegionData.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="provider-link"
                    aria-label={provider.provider_name}
                  >
                    <img
                      src={buildImageUrl('original', provider.logo_path)}
                      alt={provider.provider_name}
                    />
                  </a>
                ))
              ) : (
                <p className="watch-unavailable">No streaming options available for BR.</p>
              )}
            </div>
          </div>

          <div className="side-card-watchlist">
            <span className="icon" style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
              +
            </span>
            <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>MY LIST</p>
          </div>
        </div>
      </section>

      <section className="technical-info">
        <p className="synopsis-text">{details.overview || 'Synopsis not available.'}</p>

        <div className="crew-item">
          <strong>Direction</strong>
          <span>{directorName}</span>
        </div>

        <div className="crew-item">
          <strong>Genres</strong>
          <div className="genres-list">
            {details.genres?.map((genre) => (
              <span key={genre.id}>{genre.name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DetailsPage;
