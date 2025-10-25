import Image from "next/image";
import Link from "next/link";
import { Character, CharactersResponse } from "@/types/rickandmorty";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

interface PageProps {
  params: Promise<{ name: string }>;
}

async function searchCharacters(name: string): Promise<Character[]> {
  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`, {
      cache: 'force-cache', // SSG
    });

    if (!res.ok) {
      return [];
    }

    const data: CharactersResponse = await res.json();
    return data.results;
  } catch {
    return [];
  }
}

export default async function SearchResultsPage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const characters = await searchCharacters(decodedName);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/character/search"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <FaArrowLeft />
            Nueva búsqueda
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <FaSearch className="text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resultados para "{decodedName}"
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {characters.length === 0
              ? 'No se encontraron personajes con ese nombre.'
              : `Se encontraron ${characters.length} personaje${characters.length !== 1 ? 's' : ''}.`
            }
          </p>
        </div>

        {/* Resultados */}
        {characters.length > 0 ? (
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
                    loading="lazy"
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
        ) : (
          <div className="text-center py-12">
            <FaSearch className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron resultados
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Intenta con otro nombre o verifica la ortografía.
            </p>
            <Link
              href="/character/search"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FaSearch />
              Nueva búsqueda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}