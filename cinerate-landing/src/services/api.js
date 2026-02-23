export const CONTENT_API_KEY =
  import.meta.env.VITE_CONTENT_API_KEY || import.meta.env.VITE_TMDB_API_KEY || '';

export const CONTENT_API_BASE_URL =
  import.meta.env.VITE_CONTENT_API_BASE_URL || 'https://api.themoviedb.org/3';

export const CONTENT_IMAGE_BASE_URL =
  import.meta.env.VITE_CONTENT_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const BOOKS_API_BASE_URL =
  import.meta.env.VITE_BOOKS_API_BASE_URL || 'https://www.googleapis.com/books/v1';

export const VIDEO_EMBED_BASE_URL =
  import.meta.env.VITE_VIDEO_EMBED_BASE_URL || 'https://www.youtube.com/embed';
