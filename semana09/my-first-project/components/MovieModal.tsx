import Image from 'next/image';
import { Movie } from '../utils/omdb';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="float-right text-white text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-3xl font-bold text-white mb-4">{movie.title}</h2>
        <div className="flex flex-col md:flex-row">
          <Image
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={movie.title}
            width={300}
            height={450}
            className="w-full md:w-1/3 rounded-lg mb-4 md:mb-0 md:mr-4"
          />
          <div className="text-white">
            <p><strong>Año:</strong> {movie.release_date?.split('-')[0]}</p>
            <p><strong>Género:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
            <p><strong>Duración:</strong> {movie.runtime} min</p>
            <p><strong>Rating TMDB:</strong> {movie.vote_average}/10</p>
            <p><strong>Trama:</strong> {movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}