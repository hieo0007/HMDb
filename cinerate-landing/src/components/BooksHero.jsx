import { useEffect, useState } from 'react';
import './BooksHero.css';

const AUTO_ROTATE_MS = 9000;

function BooksHero({ items = [], onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = items.length;
  const safeActiveIndex = totalItems > 0 ? activeIndex % totalItems : 0;
  const activeBook = items[safeActiveIndex] || items[0];

  useEffect(() => {
    if (totalItems <= 1) return undefined;

    const timer = window.setTimeout(() => {
      setActiveIndex((previous) => (previous + 1) % totalItems);
    }, AUTO_ROTATE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, totalItems]);

  if (!activeBook) return null;

  const goToSlide = (index) => {
    setActiveIndex((index + totalItems) % totalItems);
  };

  const scrollToCatalog = () => {
    document.querySelector('.rows-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="books-hero"
      style={{
        '--rotation-ms': `${AUTO_ROTATE_MS}ms`,
        '--book-image': `url("${activeBook.imageUrl}")`
      }}
    >
      <div className="books-hero-stage">
        <button
          type="button"
          className="books-hero-arrow left"
          aria-label="Livro anterior"
          onClick={() => goToSlide(safeActiveIndex - 1)}
        >
          &lt;
        </button>

        <button
          type="button"
          className="books-hero-arrow right"
          aria-label="Próximo livro"
          onClick={() => goToSlide(safeActiveIndex + 1)}
        >
          &gt;
        </button>

        <div className="books-hero-inner">
          <div className="books-hero-info">
            <span className="books-hero-pill">{activeBook.category || 'Book spotlight'}</span>
            <h2>{activeBook.title}</h2>
            <p>Destaque da semana. Clique para abrir detalhes e continuar sua próxima leitura.</p>

            <div className="books-hero-actions">
              <button type="button" className="books-hero-btn" onClick={() => onSelect?.(activeBook)}>
                Abrir livro
              </button>
              <button
                type="button"
                className="books-hero-btn books-hero-mobile-secondary"
                onClick={scrollToCatalog}
              >
                Listas
              </button>
              <span className="books-hero-score">
                Score {activeBook.rating > 0 ? activeBook.rating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>

          <div className="books-hero-cover-wrap">
            <img src={activeBook.imageUrl} alt={`Capa de ${activeBook.title}`} loading="lazy" />
          </div>
        </div>

        <div className="books-hero-indicators" role="tablist" aria-label="Destaques de livros">
          {items.map((book, index) => (
            <button
              key={book.id}
              type="button"
              role="tab"
              aria-selected={index === safeActiveIndex}
              title={book.title}
              className={`books-hero-indicator ${index === safeActiveIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <span />
            </button>
          ))}
        </div>

        <div className="books-hero-thumbs">
          {items.slice(0, 6).map((book, index) => (
            <button
              key={book.id}
              type="button"
              className={`books-hero-thumb ${index === safeActiveIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              title={book.title}
            >
              <img src={book.imageUrl} alt={`Miniatura de ${book.title}`} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BooksHero;
