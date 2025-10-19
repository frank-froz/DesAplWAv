import HomeClient from '../components/HomeClient';
import { fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies } from '../utils/omdb';
export default async function Home() {
  // Fetch de datos en el SERVIDOR (SSR)
  // Estos datos se obtienen antes de renderizar la página
  const popularMovies = await fetchPopularMovies();
  const topRatedMovies = await fetchTopRatedMovies();
  const upcomingMovies = await fetchUpcomingMovies();

  // Pasar los datos pre-cargados al componente cliente
  return (
    <HomeClient 
      initialPopularMovies={popularMovies}
      initialTopRatedMovies={topRatedMovies}
      initialUpcomingMovies={upcomingMovies}
    />
  );
}

