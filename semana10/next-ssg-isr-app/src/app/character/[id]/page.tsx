import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Character } from "@/types/rickandmorty";
import { FaArrowLeft, FaMapMarkerAlt, FaGlobe, FaCalendar, FaLink, FaList } from "react-icons/fa";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    cache: 'force-cache', // ISR
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

// ISR: Revalidar cada 10 días
export const revalidate = 864000; // 10 días en segundos

// Generar rutas estáticas para todos los personajes
export async function generateStaticParams() {
  try {
    // Obtener información de paginación para saber cuántos personajes hay
    const res = await fetch('https://rickandmortyapi.com/api/character', {
      cache: 'force-cache',
    });
    const data = await res.json();
    const totalCharacters = data.info.count;

    // Generar IDs para todos los personajes (1 a totalCharacters)
    const ids = Array.from({ length: totalCharacters }, (_, i) => (i + 1).toString());

    return ids.map((id) => ({
      id,
    }));
  } catch {
    // En caso de error, generar solo los primeros 100
    return Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
    }));
  }
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón de volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <FaArrowLeft />
          Volver a la lista
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Imagen */}
            <div className="md:w-1/3">
              <div className="aspect-square relative">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            {/* Información completa */}
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {character.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`inline-block w-4 h-4 rounded-full ${
                      character.status === 'Alive'
                        ? 'bg-green-500'
                        : character.status === 'Dead'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {character.status} - {character.species}
                  </span>
                </div>
              </div>

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Información Básica
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">ID:</span>
                      <span className="text-gray-900 dark:text-white">{character.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Nombre:</span>
                      <span className="text-gray-900 dark:text-white">{character.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Estado:</span>
                      <span className="text-gray-900 dark:text-white">{character.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Especie:</span>
                      <span className="text-gray-900 dark:text-white">{character.species}</span>
                    </div>
                    {character.type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Tipo:</span>
                        <span className="text-gray-900 dark:text-white">{character.type}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Género:</span>
                      <span className="text-gray-900 dark:text-white">{character.gender}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Ubicación
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FaMapMarkerAlt />
                      <div>
                        <span className="font-medium">Última ubicación:</span>
                        <p className="text-gray-900 dark:text-white">{character.location.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FaGlobe />
                      <div>
                        <span className="font-medium">Origen:</span>
                        <p className="text-gray-900 dark:text-white">{character.origin.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Episodios */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaList />
                  Episodios ({character.episode.length})
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {character.episode.map((episodeUrl) => {
                      const episodeId = episodeUrl.split('/').pop();
                      return (
                        <span
                          key={episodeId}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-center"
                        >
                          Episodio {episodeId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FaLink />
                    <div>
                      <span className="font-medium">URL de la API:</span>
                      <a
                        href={character.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1 break-all"
                      >
                        {character.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FaCalendar />
                    <div>
                      <span className="font-medium">Creado:</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(character.created).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}