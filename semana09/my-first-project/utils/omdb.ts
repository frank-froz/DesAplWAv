const TMDB_API_KEY = '4d7402e457dcb0335d785758510cdb75';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Para posters

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genres?: { id: number; name: string }[];
  vote_average: number;
  runtime?: number;
  imdb_id?: string;
}

export async function fetchMovieById(imdbId: string): Promise<Movie | null> {
  try {
    // Primero, encontrar el ID de TMDB usando IMDB ID
    const findResponse = await fetch(`${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`);
    const findData = await findResponse.json();
    if (findData.movie_results && findData.movie_results.length > 0) {
      const tmdbId = findData.movie_results[0].id;
      // Ahora obtener detalles completos
      const detailsResponse = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
      const movie = await detailsResponse.json();
      return movie as Movie;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results.slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

export async function fetchTopRatedMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results.slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
}

export async function fetchUpcomingMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results.slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return [];
  }
}

export async function getBackdrop(title: string): Promise<string | null> {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const backdrop = data.results[0].backdrop_path;
      if (backdrop) {
        return `https://image.tmdb.org/t/p/w1280${backdrop}`;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching backdrop:', error);
    return null;
  }
}