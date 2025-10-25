import Image from "next/image";
import Link from "next/link";
import { Character } from "@/types/rickandmorty";
import { FaSearch } from "react-icons/fa";

// ISR: Revalidar cada 10 días
export const revalidate = 864000; // 10 días en segundos

async function getCharacters() {
  const res = await fetch('https://rickandmortyapi.com/api/character', {
    cache: 'force-cache', // Forzar caché
  });

  if (!res.ok) {
    throw new Error('Failed to fetch characters');
  }

  const data = await res.json();
  return data.results as Character[];
}

export default async function Home() {
  const characters = await getCharacters();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Personajes de Rick and Morty
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Explora todos los personajes del universo de Rick and Morty
          </p>
          <Link
            href="/character/search"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <FaSearch />
            Buscar personajes
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/character/${character.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-square relative">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                  loading="lazy" // Lazy loading
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {character.name}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      character.status === 'Alive'
                        ? 'bg-green-500'
                        : character.status === 'Dead'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {character.status} - {character.species}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Origen: {character.origin.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}