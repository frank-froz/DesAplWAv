'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Character } from '@/types/rickandmorty';
import { FaSearch, FaArrowLeft, FaFilter } from 'react-icons/fa';

export default function SearchPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');

  // Función de búsqueda con useCallback
  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (name.trim()) params.append('name', name.trim());
      if (status) params.append('status', status);
      if (type.trim()) params.append('type', type.trim());
      if (gender) params.append('gender', gender);

      const queryString = params.toString();
      const url = queryString
        ? `https://rickandmortyapi.com/api/character/?${queryString}`
        : 'https://rickandmortyapi.com/api/character';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al buscar personajes');
      }

      const data = await response.json();
      setCharacters(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, [name, status, type, gender]);

  // Debounce para búsqueda en tiempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timer);
  }, [performSearch]);

  const clearFilters = () => {
    setName('');
    setStatus('');
    setType('');
    setGender('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <FaArrowLeft />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Buscar Personajes
          </h1>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Filtros de búsqueda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Rick, Morty..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todos</option>
                <option value="Alive">Vivo</option>
                <option value="Dead">Muerto</option>
                <option value="unknown">Desconocido</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Ej: Human, Alien..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Género
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todos</option>
                <option value="Female">Femenino</option>
                <option value="Male">Masculino</option>
                <option value="Genderless">Sin género</option>
                <option value="unknown">Desconocido</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Resultados {characters.length > 0 && `(${characters.length})`}
          </h2>
          {loading && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Buscando...
            </div>
          )}
          {error && (
            <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              {error}
            </div>
          )}
        </div>

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
        ) : !loading && !error && (
          <div className="text-center py-12">
            <FaSearch className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron resultados
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}