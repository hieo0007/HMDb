import { useNavigate } from 'react-router-dom';
import { CONTENT_IMAGE_BASE_URL } from '../services/api';
import './MovieCard.css';

const DEFAULT_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster';

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const score = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const posterUrl = movie.poster_path
    ? `${CONTENT_IMAGE_BASE_URL}/w500${movie.poster_path}`
    : movie.image || DEFAULT_POSTER;

  return (
    <div className="movie-card" onClick={() => navigate(`/detalhes/movie/${movie.id}`)} role="button" tabIndex={0}>
      <div className="poster-wrapper">
        <img src={posterUrl} alt={movie.title || 'Poster'} />
      </div>

      <div className="card-info">
        <h3>{movie.title}</h3>

        <div className="rating-value">
          <span className="star">*</span>
          <span className="score">{score}</span>
          {movie.vote_count ? <span className="votes">({movie.vote_count.toLocaleString()})</span> : null}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
