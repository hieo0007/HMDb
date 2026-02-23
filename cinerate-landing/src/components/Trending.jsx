import { useEffect, useState } from 'react';
import { CONTENT_API_BASE_URL, CONTENT_API_KEY, CONTENT_IMAGE_BASE_URL } from '../services/api';
import MovieCard from './MovieCard';
import './Trending.css';

function Trending() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      if (!CONTENT_API_KEY) return;

      try {
        const response = await fetch(
          `${CONTENT_API_BASE_URL}/movie/popular?api_key=${CONTENT_API_KEY}&language=pt-BR`
        );
        const data = await response.json();

        const formattedItems = (data.results || []).slice(0, 8).map((item) => ({
          id: item.id,
          title: item.title || item.name,
          category: item.release_date ? 'Movie' : 'Series',
          rating: item.vote_average,
          image: `${CONTENT_IMAGE_BASE_URL}/w500${item.poster_path}`,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
          vote_count: item.vote_count
        }));

        setMovies(formattedItems);
      } catch (error) {
        console.error('Failed to load trending section:', error);
      }
    };

    loadMovies();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Trending</h2>
        <div className="trending-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Trending;
