'use client';

import { useState, useEffect } from 'react';
import { searchMovies, Movie } from '../../utils/omdb';
import MovieCard from '../../components/MovieCard';
import MovieModal from '../../components/MovieModal';
import Sidebar from '../../components/Sidebar';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (query.length > 2) {
      const fetchMovies = async () => {
        const results = await searchMovies(query);
        setMovies(results);
      };
      fetchMovies();
    } else {
      setMovies([]);
    }
  }, [query]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Sidebar />
      <div className="ml-20 pl-[max(2rem,3vw)] pr-12 py-8">
        <h1 className="text-4xl font-bold mb-6">Buscar Películas</h1>
        <input
          type="text"
          placeholder="Escribe el nombre de una película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-3xl p-4 bg-gray-800/80 text-white rounded-md mb-10 text-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        />
        
        {query.length > 0 && query.length <= 2 && (
          <p className="text-gray-400 text-lg">Escribe al menos 3 caracteres para buscar...</p>
        )}
        
        {movies.length === 0 && query.length > 2 && (
          <p className="text-gray-400 text-lg">No se encontraron películas con &quot;{query}&quot;</p>
        )}
        
        {movies.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Resultados de búsqueda ({movies.length})</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => setSelectedMovie(movie)}
                  isLarge={false}
                />
              ))}
            </div>
          </>
        )}
        
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      </div>
    </div>
  );
}