import { useEffect, useState } from "react"
import MovieCard from "./MovieCard"
import "./Trending.css"
import { API_KEY, BASE_URL } from "../services/api"

const Trending = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`)
        const data = await response.json()
        
        // Formatando para o Card receber os dados certinhos
        const formatted = data.results.slice(0, 8).map(m => ({
          id: m.id,
          title: m.title || m.name,
          category: m.release_date ? 'Filme' : 'Série',
          rating: m.vote_average,
          image: `https://image.tmdb.org/t/p/w500${m.poster_path}`
        }))
        setMovies(formatted)
      } catch (error) {
        console.error("Erro:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Em Alta</h2>
        <div className="trending-grid">
          {movies.map((movie) => (
            // AQUI: troquei 'item' por 'movie' para combinar com o seu MovieCard.jsx
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Trending