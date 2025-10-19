import Image from 'next/image';
import { Movie } from '../utils/omdb';
import { AiFillPlayCircle } from 'react-icons/ai';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  isLarge?: boolean;
}

export default function MovieCard({ movie, onClick, isLarge = false }: MovieCardProps) {
  return (
    <div
      className={`cursor-pointer transition-transform hover:scale-105 relative group ${
        isLarge ? 'w-full h-96' : 'w-full aspect-[2/3]'
      }`}
      onClick={onClick}
    >
      <Image
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/160x240?text=No+Image'}
        alt={movie.title}
        width={isLarge ? 800 : 192}
        height={isLarge ? 384 : 288}
        className="object-cover rounded-sm w-full h-full"
      />
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex flex-col justify-end p-2">
        <h3 className={`font-bold text-white ${isLarge ? 'text-lg' : 'text-xs'} mb-1`}>{movie.title}</h3>
        <p className={`text-gray-300 ${isLarge ? 'text-sm' : 'text-xs'} mb-2`}>{movie.release_date?.split('-')[0]}</p>
        <button className="bg-white text-black px-2 py-1 rounded-sm text-xs font-bold flex items-center justify-center">
          <AiFillPlayCircle className="mr-1" />
          Reproducir
        </button>
      </div>
    </div>
  );
}