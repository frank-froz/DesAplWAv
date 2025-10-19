'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Movie, getBackdrop } from '../utils/omdb';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import Sidebar from './Sidebar';
import { AiFillPlayCircle } from 'react-icons/ai';

interface HomeClientProps {
  initialPopularMovies: Movie[];
  initialTopRatedMovies: Movie[];
  initialUpcomingMovies: Movie[];
}

export default function HomeClient({ 
  initialPopularMovies,
  initialTopRatedMovies,
  initialUpcomingMovies
}: HomeClientProps) {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(
    initialPopularMovies[0] || null
  );
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);
  
  // Usar los datos que vienen del servidor (SSR)
  const [popularMovies] = useState<Movie[]>(initialPopularMovies);
  const [topRatedMovies] = useState<Movie[]>(initialTopRatedMovies);
  const [upcomingMovies] = useState<Movie[]>(initialUpcomingMovies);

  // Solo obtener el backdrop dinámicamente cuando cambia la película featured
  useEffect(() => {
    if (featuredMovie) {
      const fetchBackdrop = async () => {
        const backdrop = await getBackdrop(featuredMovie.title);
        setBackdropUrl(backdrop);
      };
      fetchBackdrop();
    }
  }, [featuredMovie]);

  if (!featuredMovie) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Cargando...</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <Sidebar />
      <div className="ml-0">
        {/* Featured Movie */}
        <div className="relative h-[68vh] flex items-end">
          <div className="absolute inset-0">
            <Image
              src={backdropUrl || (featuredMovie.poster_path ? `https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path || featuredMovie.poster_path}` : 'https://via.placeholder.com/1280x720?text=No+Image')}
              alt={featuredMovie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 pl-[max(6rem,5vw)] pr-12 pb-40 max-w-xl">
            <p className="text-xs font-semibold mb-1 tracking-widest text-gray-300">SERIE</p>
            <h1 className="text-6xl font-black mb-3 tracking-tight leading-none">{featuredMovie.title}</h1>
            <p className="text-base mb-5 leading-snug max-w-md">{featuredMovie.overview}</p>
            <div className="flex items-center space-x-3">
              <button className="bg-white text-black px-7 py-2.5 rounded-sm font-bold flex items-center hover:bg-white/90 transition text-base">
                <AiFillPlayCircle className="mr-2 text-xl" />
                Reproducir
              </button>
              <button 
                className="bg-gray-600/70 text-white px-7 py-2.5 rounded-sm font-semibold hover:bg-gray-600/90 transition text-base" 
                onClick={() => setSelectedMovie(featuredMovie)}
              >
                Más información
              </button>
            </div>
          </div>
        </div>

        {/* Tendencias Ahora */}
        <div className="-mt-20 relative z-20">
          <h2 className="text-2xl font-bold mb-4 pl-[max(6rem,5vw)]">Tendencias ahora</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2 pl-[max(6rem,5vw)] pr-12 pb-6">
            {popularMovies.slice(0, 8).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setFeaturedMovie(movie)}
                isLarge={false}
              />
            ))}
          </div>
        </div>

        {/* Top Rated */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 pl-[max(6rem,5vw)]">Mejor Valoradas</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2 pl-[max(6rem,5vw)] pr-12 pb-6">
            {topRatedMovies.slice(0, 8).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setFeaturedMovie(movie)}
                isLarge={false}
              />
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="mt-10 pb-12">
          <h2 className="text-2xl font-bold mb-4 pl-[max(6rem,5vw)]">Próximamente</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2 pl-[max(6rem,5vw)] pr-12 pb-6">
            {upcomingMovies.slice(0, 8).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setFeaturedMovie(movie)}
                isLarge={false}
              />
            ))}
          </div>
        </div>
      </div>
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}