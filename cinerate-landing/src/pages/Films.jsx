import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroPrincipal from '../components/HeroPrincipal';
import MovieRow from '../components/MovieRow';
import {
  BOOKS_API_BASE_URL,
  CONTENT_API_BASE_URL,
  CONTENT_API_KEY,
  CONTENT_IMAGE_BASE_URL
} from '../services/api';
import './Films.css';

const DEFAULT_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster';
const DEFAULT_BOOK_COVER = 'https://via.placeholder.com/500x750?text=No+Cover';
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const OPEN_LIBRARY_COVER_BASE_URL = 'https://covers.openlibrary.org/b/id';
const AWARD_WINNER_FALLBACK_IDS = [13, 122, 98, 597, 424, 238, 240, 496243, 545611, 872585, 1422];
const AWARD_NOMINATED_FALLBACK_IDS = [278, 680, 857, 313369, 37799, 7345, 76341, 286217, 244786, 194];
const STATIC_BOOK_FALLBACK = {
  romance: [
    {
      id: 'romance-1',
      title: 'Pride and Prejudice',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL66554W'
    },
    {
      id: 'romance-2',
      title: 'Jane Eyre',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL15831042W'
    },
    {
      id: 'romance-3',
      title: 'Wuthering Heights',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL21177W'
    }
  ],
  drama: [
    {
      id: 'drama-1',
      title: 'Hamlet',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL45804W'
    },
    {
      id: 'drama-2',
      title: 'Death of a Salesman',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL19767W'
    },
    {
      id: 'drama-3',
      title: 'A Doll House',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL151633W'
    }
  ],
  fantasy: [
    {
      id: 'fantasy-1',
      title: 'The Hobbit',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL27448W'
    },
    {
      id: 'fantasy-2',
      title: 'The Name of the Wind',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL82563W'
    },
    {
      id: 'fantasy-3',
      title: 'A Wizard of Earthsea',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL17884W'
    }
  ],
  general: [
    {
      id: 'general-1',
      title: 'The Great Gatsby',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL27628W'
    },
    {
      id: 'general-2',
      title: '1984',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL73477W'
    },
    {
      id: 'general-3',
      title: 'The Catcher in the Rye',
      rating: 0,
      imageUrl: DEFAULT_BOOK_COVER,
      externalUrl: 'https://openlibrary.org/works/OL45883W'
    }
  ]
};

const buildImageUrl = (size, path) => `${CONTENT_IMAGE_BASE_URL}/${size}${path}`;

const normalizeContentItem = (item) => ({
  id: item.id,
  title: item.title || item.name || 'Title unavailable',
  rating: item.vote_average || 0,
  imageUrl: item.poster_path
    ? buildImageUrl('w500', item.poster_path)
    : item.backdrop_path
      ? buildImageUrl('w780', item.backdrop_path)
      : DEFAULT_POSTER
});

const normalizeBookItem = (item) => ({
  id: item.id,
  title: item.volumeInfo?.title || 'Title unavailable',
  rating: item.volumeInfo?.averageRating || 0,
  imageUrl: item.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || DEFAULT_BOOK_COVER,
  externalUrl:
    item.volumeInfo?.infoLink ||
    item.volumeInfo?.canonicalVolumeLink ||
    item.saleInfo?.buyLink ||
    ''
});

const randomPage = (max = 4) => Math.floor(Math.random() * max) + 1;

const shuffleItems = (items) => {
  const list = [...items];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[randomIndex]] = [list[randomIndex], list[index]];
  }
  return list;
};

const randomPages = (max = 10, count = 3) =>
  shuffleItems(Array.from({ length: max }, (_, index) => index + 1)).slice(0, count);

const uniqueById = (items) => {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
};

const buildUniqueRow = ({ title, pools, usedIds, limit = 20 }) => {
  const mergedItems = pools.flat().filter(Boolean);
  const filteredItems = uniqueById(mergedItems).filter((item) => !usedIds.has(item.id));
  const selectedItems = shuffleItems(filteredItems).slice(0, limit);
  selectedItems.forEach((item) => usedIds.add(item.id));
  return { title, items: selectedItems };
};

const fetchJson = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const fetchContentItems = async ({ url, signal }) => {
  const data = await fetchJson(url, signal);
  return (data.results || []).map(normalizeContentItem);
};

const fetchKeywordIds = async ({ queries, signal }) => {
  const idSet = new Set();

  await Promise.all(
    queries.map(async (query) => {
      const data = await fetchJson(
        `${CONTENT_API_BASE_URL}/search/keyword?api_key=${CONTENT_API_KEY}&query=${encodeURIComponent(query)}`,
        signal
      );
      (data.results || []).slice(0, 5).forEach((keyword) => idSet.add(keyword.id));
    })
  );

  return Array.from(idSet);
};

const fetchContentItemsByIds = async ({ ids, signal }) => {
  const responses = await Promise.allSettled(
    ids.map((id) => fetchJson(`${CONTENT_API_BASE_URL}/movie/${id}?api_key=${CONTENT_API_KEY}&language=pt-BR`, signal))
  );

  return responses
    .filter((result) => result.status === 'fulfilled')
    .map((result) => normalizeContentItem(result.value));
};

const fetchContentRow = async ({ title, url, signal }) => ({
  title,
  items: await fetchContentItems({ url, signal })
});

const normalizeOpenLibraryItem = (item, index) => ({
  id: item.key || `open-library-${index}`,
  title: item.title || 'Title unavailable',
  rating: 0,
  imageUrl: item.cover_i
    ? `${OPEN_LIBRARY_COVER_BASE_URL}/${item.cover_i}-L.jpg`
    : DEFAULT_BOOK_COVER,
  externalUrl: item.key ? `${OPEN_LIBRARY_BASE_URL}${item.key}` : ''
});

const pickStaticBookFallback = (query) => {
  const normalizedQuery = query.toLowerCase();

  if (normalizedQuery.includes('romance')) return STATIC_BOOK_FALLBACK.romance;
  if (normalizedQuery.includes('drama')) return STATIC_BOOK_FALLBACK.drama;
  if (normalizedQuery.includes('fantasy')) return STATIC_BOOK_FALLBACK.fantasy;
  return STATIC_BOOK_FALLBACK.general;
};

const fetchBooksFromOpenLibrary = async ({ query, signal }) => {
  const url = `${OPEN_LIBRARY_BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20`;
  const data = await fetchJson(url, signal);
  return (data.docs || []).map(normalizeOpenLibraryItem);
};

const fetchBooksRow = async ({ title, query, orderBy = 'relevance', signal }) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${BOOKS_API_BASE_URL}/volumes?q=${encodedQuery}&startIndex=0&maxResults=20&printType=books&orderBy=${orderBy}`;
    const data = await fetchJson(url, signal);
    return {
      title,
      items: (data.items || []).map(normalizeBookItem)
    };
  } catch (error) {
    if (error.name === 'AbortError') throw error;

    try {
      const openLibraryItems = await fetchBooksFromOpenLibrary({ query, signal });
      if (openLibraryItems.length > 0) {
        return {
          title,
          items: openLibraryItems
        };
      }
    } catch (fallbackError) {
      if (fallbackError.name === 'AbortError') throw fallbackError;
    }

    return {
      title,
      items: pickStaticBookFallback(query)
    };
  }
};

function Films({ initialTheme, globalSearch = '' }) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(globalSearch);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(globalSearch);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [globalSearch]);

  const openExternalLink = useCallback((url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleItemClick = useCallback(
    (item) => {
      if (initialTheme === 'livros') {
        openExternalLink(item.externalUrl);
        return;
      }

      const contentType = initialTheme === 'filmes' ? 'movie' : 'tv';
      navigate(`/detalhes/${contentType}/${item.id}`);
    },
    [initialTheme, navigate, openExternalLink]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const search = debouncedSearch.trim();

    const loadRows = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setRows([]);

      try {
        if (initialTheme !== 'livros' && !CONTENT_API_KEY) {
          throw new Error('Set VITE_CONTENT_API_KEY (or VITE_TMDB_API_KEY) in your .env file.');
        }

        let nextRows = [];

        if (initialTheme === 'filmes') {
          if (search) {
            nextRows = await Promise.all([
              fetchContentRow({
                title: `Results for "${search}"`,
                url: `${CONTENT_API_BASE_URL}/search/movie?api_key=${CONTENT_API_KEY}&language=pt-BR&include_adult=false&page=1&query=${encodeURIComponent(search)}`,
                signal
              })
            ]);
          } else {
            const winnerPages = randomPages(4, 3);
            const nominatedPages = randomPages(4, 3);
            const popularPage = randomPage(5);
            const topRatedPage = randomPage(5);

            const [winnerKeywordIds, nominatedKeywordIds] = await Promise.all([
              fetchKeywordIds({
                queries: ['award winner', 'best picture winner', 'festival winner'],
                signal
              }),
              fetchKeywordIds({
                queries: ['award nominee', 'best picture nominee', 'festival nominee'],
                signal
              })
            ]);

            const winnerQueryIds = winnerKeywordIds.length > 0 ? winnerKeywordIds : [312553];
            const nominatedQueryIds = nominatedKeywordIds.length > 0 ? nominatedKeywordIds : [250482];

            const [
              winnerPools,
              nominatedPools,
              winnersFallbackPool,
              nominatedFallbackPool,
              popularPool,
              topRatedPool
            ] = await Promise.all([
              Promise.all(
                winnerPages.map((page) =>
                  fetchContentItems({
                    url: `${CONTENT_API_BASE_URL}/discover/movie?api_key=${CONTENT_API_KEY}&language=pt-BR&include_adult=false&page=${page}&sort_by=popularity.desc&with_keywords=${winnerQueryIds.slice(0, 6).join('|')}`,
                    signal
                  })
                )
              ),
              Promise.all(
                nominatedPages.map((page) =>
                  fetchContentItems({
                    url: `${CONTENT_API_BASE_URL}/discover/movie?api_key=${CONTENT_API_KEY}&language=pt-BR&include_adult=false&page=${page}&sort_by=popularity.desc&with_keywords=${nominatedQueryIds.slice(0, 6).join('|')}`,
                    signal
                  })
                )
              ),
              fetchContentItemsByIds({ ids: AWARD_WINNER_FALLBACK_IDS, signal }),
              fetchContentItemsByIds({ ids: AWARD_NOMINATED_FALLBACK_IDS, signal }),
              fetchContentItems({
                url: `${CONTENT_API_BASE_URL}/movie/popular?api_key=${CONTENT_API_KEY}&language=pt-BR&page=${popularPage}`,
                signal
              }),
              fetchContentItems({
                url: `${CONTENT_API_BASE_URL}/movie/top_rated?api_key=${CONTENT_API_KEY}&language=pt-BR&page=${topRatedPage}`,
                signal
              })
            ]);

            const usedIds = new Set();
            const winnerOnly = uniqueById([...winnerPools.flat(), ...winnersFallbackPool]);
            const winnersRow = buildUniqueRow({
              title: 'Award Winners',
              pools: [winnerOnly],
              usedIds,
              limit: 20
            });

            const winnerIds = new Set(winnersRow.items.map((item) => item.id));
            const nominatedOnly = uniqueById([...nominatedPools.flat(), ...nominatedFallbackPool]);
            const nominatedWithoutWinners = nominatedOnly.filter((item) => !winnerIds.has(item.id));
            const nominatedRow = buildUniqueRow({
              title: 'Award Nominees',
              pools: [nominatedWithoutWinners],
              usedIds,
              limit: 20
            });

            const popularRow = buildUniqueRow({
              title: 'Popular',
              pools: [popularPool, topRatedPool],
              usedIds,
              limit: 20
            });

            const topRatedRow = buildUniqueRow({
              title: 'Top Rated',
              pools: [topRatedPool, popularPool],
              usedIds,
              limit: 20
            });

            nextRows = [winnersRow, nominatedRow, popularRow, topRatedRow];
          }
        } else if (initialTheme === 'series') {
          if (search) {
            nextRows = await Promise.all([
              fetchContentRow({
                title: `Results for "${search}"`,
                url: `${CONTENT_API_BASE_URL}/search/tv?api_key=${CONTENT_API_KEY}&language=pt-BR&include_adult=false&page=1&query=${encodeURIComponent(search)}`,
                signal
              })
            ]);
          } else {
            nextRows = await Promise.all([
              fetchContentRow({
                title: 'Popular',
                url: `${CONTENT_API_BASE_URL}/tv/popular?api_key=${CONTENT_API_KEY}&language=pt-BR&page=1`,
                signal
              }),
              fetchContentRow({
                title: 'Top Rated',
                url: `${CONTENT_API_BASE_URL}/tv/top_rated?api_key=${CONTENT_API_KEY}&language=pt-BR&page=1`,
                signal
              }),
              fetchContentRow({
                title: 'Now Airing',
                url: `${CONTENT_API_BASE_URL}/tv/on_the_air?api_key=${CONTENT_API_KEY}&language=pt-BR&page=1`,
                signal
              })
            ]);
          }
        } else if (search) {
          nextRows = await Promise.all([
            fetchBooksRow({
              title: `Results for "${search}"`,
              query: search,
              orderBy: 'relevance',
              signal
            })
          ]);
        } else {
          nextRows = await Promise.all([
            fetchBooksRow({ title: 'Romance', query: 'subject:romance', signal }),
            fetchBooksRow({ title: 'Drama', query: 'subject:drama', signal }),
            fetchBooksRow({ title: 'Fantasy', query: 'subject:fantasy', signal })
          ]);
        }

        setRows(nextRows);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message || 'Failed to load catalog.');
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadRows();

    return () => controller.abort();
  }, [debouncedSearch, initialTheme]);

  const hasResults = rows.some((row) => row.items.length > 0);

  return (
    <div className={`tema-${initialTheme} films-page`}>
      <div className="video-background">
        <video autoPlay loop muted playsInline className="video-content">
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-particles-motion-background-overlay-48762-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="video-overlay-dark" />
      </div>

      <main className="films-main">
        {initialTheme !== 'livros' && <HeroPrincipal key={initialTheme} theme={initialTheme} />}

        <div className="rows-container">
          {rows.map((row) => (
            <MovieRow key={row.title} title={row.title} items={row.items} onItemClick={handleItemClick} />
          ))}

          {isLoading && <div className="loading-state">Loading {initialTheme}...</div>}
          {!isLoading && !errorMessage && !hasResults && (
            <div className="loading-state">No results found.</div>
          )}
          {errorMessage && <div className="loading-state error">{errorMessage}</div>}
        </div>
      </main>
    </div>
  );
}

export default Films;
