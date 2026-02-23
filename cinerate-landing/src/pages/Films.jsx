import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroPrincipal from '../components/HeroPrincipal';
import MovieRow from '../components/MovieRow';
import './Films.css';

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const MARKETPLACE_TAG = 'O-TEU-ID-AQUI-21';

const DEFAULT_POSTER = 'https://via.placeholder.com/500x750?text=Sem+Poster';
const DEFAULT_BOOK_COVER = 'https://via.placeholder.com/500x750?text=Sem+Capa';
const OSCAR_WINNER_FALLBACK_IDS = [13, 122, 98, 597, 424, 238, 240, 496243, 545611, 872585, 1422];
const OSCAR_NOMINATED_FALLBACK_IDS = [278, 680, 857, 313369, 37799, 7345, 76341, 286217, 244786, 194];

const normalizeTmdbItem = (item) => ({
  id: item.id,
  titulo: item.title || item.name || 'Titulo indisponivel',
  voto: item.vote_average || 0,
  imagem: item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : item.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
      : DEFAULT_POSTER
});

const normalizeBookItem = (item) => ({
  id: item.id,
  titulo: item.volumeInfo?.title || 'Titulo indisponivel',
  voto: item.volumeInfo?.averageRating || 0,
  imagem: item.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || DEFAULT_BOOK_COVER
});

const randomPage = (max = 4) => Math.floor(Math.random() * max) + 1;

const randomPages = (max = 10, count = 3) => {
  const pages = Array.from({ length: max }, (_, index) => index + 1);
  const shuffled = shuffleItems(pages);
  return shuffled.slice(0, count);
};

const shuffleItems = (items) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const uniqueById = (items) => {
  const uniqueMap = new Map();
  for (const item of items) {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  }
  return Array.from(uniqueMap.values());
};

const buildUniqueRow = ({ title, pools, usedIds, limit = 20 }) => {
  const merged = pools.flat().filter(Boolean);
  const filtered = uniqueById(merged).filter((item) => !usedIds.has(item.id));
  const selected = shuffleItems(filtered).slice(0, limit);
  selected.forEach((item) => usedIds.add(item.id));
  return { title, items: selected };
};

const fetchJson = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }
  return response.json();
};

const fetchTmdbItems = async ({ url, signal }) => {
  const data = await fetchJson(url, signal);
  return (data.results || []).map(normalizeTmdbItem);
};

const fetchTmdbKeywordIds = async ({ queries, signal }) => {
  const idSet = new Set();

  await Promise.all(
    queries.map(async (query) => {
      const data = await fetchJson(
        `https://api.themoviedb.org/3/search/keyword?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`,
        signal
      );
      (data.results || []).slice(0, 5).forEach((keyword) => idSet.add(keyword.id));
    })
  );

  return Array.from(idSet);
};

const fetchTmdbItemsByIds = async ({ ids, signal }) => {
  const responses = await Promise.allSettled(
    ids.map((id) =>
      fetchJson(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=pt-BR`, signal)
    )
  );

  return responses
    .filter((result) => result.status === 'fulfilled')
    .map((result) => normalizeTmdbItem(result.value));
};

const fetchTmdbRow = async ({ title, url, signal }) => {
  const items = await fetchTmdbItems({ url, signal });
  return {
    title,
    items
  };
};

const fetchBooksRow = async ({ title, query, orderBy = 'relevance', signal }) => {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&startIndex=0&maxResults=20&printType=books&orderBy=${orderBy}`;
  const data = await fetchJson(url, signal);
  return {
    title,
    items: (data.items || []).map(normalizeBookItem)
  };
};

function Home({ temaInicial, buscaGlobal = '' }) {
  const [rows, setRows] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const abrirLinkCompra = useCallback((titulo) => {
    const query = encodeURIComponent(titulo);
    const url = `https://www.amazon.com.br/s?k=${query}&tag=${MARKETPLACE_TAG}`;
    window.open(url, '_blank');
  }, []);

  const handleItemClick = useCallback((item) => {
    if (temaInicial === 'livros') {
      abrirLinkCompra(item.titulo);
      return;
    }

    const tipo = temaInicial === 'filmes' ? 'movie' : 'tv';
    navigate(`/detalhes/${tipo}/${item.id}`);
  }, [temaInicial, abrirLinkCompra, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const busca = buscaGlobal.trim();

    const carregar = async () => {
      setCarregando(true);
      setErro('');
      setRows([]);

      try {
        if (temaInicial !== 'livros' && !TMDB_KEY) {
          throw new Error('Defina VITE_TMDB_API_KEY no arquivo .env para carregar filmes e series.');
        }

        let resultado = [];

        if (temaInicial === 'filmes') {
          if (busca) {
            resultado = await Promise.all([
              fetchTmdbRow({
                title: `Resultados para "${busca}"`,
                url: `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=pt-BR&include_adult=false&page=1&query=${encodeURIComponent(busca)}`,
                signal
              })
            ]);
          } else {
            const winnersPages = randomPages(4, 3);
            const nominatedPages = randomPages(4, 3);
            const pagePopular = randomPage(5);
            const pageTopRated = randomPage(5);

            const [winnerKeywordIds, nominatedKeywordIds] = await Promise.all([
              fetchTmdbKeywordIds({
                queries: ['oscar winner', 'academy award winner', 'best picture winner'],
                signal
              }),
              fetchTmdbKeywordIds({
                queries: ['oscar nominee', 'academy award nominee', 'best picture nominee'],
                signal
              })
            ]);

            const winnerQueryIds = winnerKeywordIds.length > 0 ? winnerKeywordIds : [312553];
            const nominatedQueryIds = nominatedKeywordIds.length > 0 ? nominatedKeywordIds : [250482];

            const [winnerPools, nominatedPools, winnersFallbackPool, nominatedFallbackPool, popularesPool, topRatedPool] = await Promise.all([
              Promise.all(
                winnersPages.map((page) =>
                  fetchTmdbItems({
                    url: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&language=pt-BR&include_adult=false&page=${page}&sort_by=popularity.desc&with_keywords=${winnerQueryIds.slice(0, 6).join('|')}`,
                    signal
                  })
                )
              ),
              Promise.all(
                nominatedPages.map((page) =>
                  fetchTmdbItems({
                    url: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&language=pt-BR&include_adult=false&page=${page}&sort_by=popularity.desc&with_keywords=${nominatedQueryIds.slice(0, 6).join('|')}`,
                    signal
                  })
                )
              ),
              fetchTmdbItemsByIds({ ids: OSCAR_WINNER_FALLBACK_IDS, signal }),
              fetchTmdbItemsByIds({ ids: OSCAR_NOMINATED_FALLBACK_IDS, signal }),
              fetchTmdbItems({
                url: `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=pt-BR&page=${pagePopular}`,
                signal
              }),
              fetchTmdbItems({
                url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_KEY}&language=pt-BR&page=${pageTopRated}`,
                signal
              })
            ]);

            const usedIds = new Set();
            const winnersOnly = uniqueById([...winnerPools.flat(), ...winnersFallbackPool]);
            const winnersRow = buildUniqueRow({
              title: 'Vencedores do Oscar',
              pools: [winnersOnly],
              usedIds,
              limit: 20
            });

            const winnerIds = new Set(winnersRow.items.map((item) => item.id));
            const nominatedOnly = uniqueById([...nominatedPools.flat(), ...nominatedFallbackPool]);
            const nominatedWithoutWinners = nominatedOnly.filter((item) => !winnerIds.has(item.id));
            const nominatedRow = buildUniqueRow({
              title: 'Indicado ao Oscar',
              pools: [nominatedWithoutWinners],
              usedIds,
              limit: 20
            });

            const popularRow = buildUniqueRow({
              title: 'Populares',
              pools: [popularesPool, topRatedPool],
              usedIds,
              limit: 20
            });

            const topRatedRow = buildUniqueRow({
              title: 'Mais bem avaliados',
              pools: [topRatedPool, popularesPool],
              usedIds,
              limit: 20
            });

            resultado = [winnersRow, nominatedRow, popularRow, topRatedRow];
          }
        } else if (temaInicial === 'series') {
          if (busca) {
            resultado = await Promise.all([
              fetchTmdbRow({
                title: `Resultados para "${busca}"`,
                url: `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&language=pt-BR&include_adult=false&page=1&query=${encodeURIComponent(busca)}`,
                signal
              })
            ]);
          } else {
            resultado = await Promise.all([
              fetchTmdbRow({
                title: 'Populares',
                url: `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_KEY}&language=pt-BR&page=1`,
                signal
              }),
              fetchTmdbRow({
                title: 'Mais bem avaliadas',
                url: `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_KEY}&language=pt-BR&page=1`,
                signal
              }),
              fetchTmdbRow({
                title: 'Lancamentos',
                url: `https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_KEY}&language=pt-BR&page=1`,
                signal
              })
            ]);
          }
        } else {
          if (busca) {
            resultado = await Promise.all([
              fetchBooksRow({
                title: `Resultados para "${busca}"`,
                query: busca,
                orderBy: 'relevance',
                signal
              })
            ]);
          } else {
            resultado = await Promise.all([
              fetchBooksRow({ title: 'Romance', query: 'subject:romance', signal }),
              fetchBooksRow({ title: 'Drama', query: 'subject:drama', signal }),
              fetchBooksRow({ title: 'Fantasia', query: 'subject:fantasy', signal })
            ]);
          }
        }

        setRows(resultado);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErro(error.message || 'Erro ao carregar catalogo.');
        }
      } finally {
        if (!signal.aborted) {
          setCarregando(false);
        }
      }
    };

    carregar();

    return () => controller.abort();
  }, [temaInicial, buscaGlobal]);

  const possuiResultados = rows.some((row) => row.items.length > 0);

  return (
    <div className={`tema-${temaInicial} films-page`}>
      <div className="video-background">
        <video autoPlay loop muted playsInline className="video-content">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-particles-motion-background-overlay-48762-large.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay-dark"></div>
      </div>

      <main className="films-main">
        {temaInicial !== 'livros' && <HeroPrincipal tema={temaInicial} />}

        <div className="rows-container">
          {rows.map((row) => (
            <MovieRow
              key={row.title}
              title={row.title}
              items={row.items}
              onItemClick={handleItemClick}
            />
          ))}

          {carregando && <div className="loading-state">Carregando {temaInicial}...</div>}
          {!carregando && !erro && !possuiResultados && <div className="loading-state">Nenhum resultado encontrado.</div>}
          {erro && <div className="loading-state error">{erro}</div>}
        </div>
      </main>
    </div>
  );
}

export default Home;
