import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const nota = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "N/A";

  return (
    <div 
      className="movie-card"
      onClick={() => navigate(`/detalhes/movie/${movie.id}`)}
    >
      <div className="poster-wrapper">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=Sem+Poster"
          }
          alt={movie.title}
        />
      </div>

      <div className="card-info">
        <h3>{movie.title}</h3>

        <div className="rating-imdb">
          <span className="star">★</span>
          <span className="score">{nota}</span>
          {movie.vote_count && (
            <span className="votes">
              ({movie.vote_count.toLocaleString()})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
