'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
  _count?: {
    books: number;
  };
}

interface AuthorStats {
  authorId: string;
  authorName: string;
  totalBooks: number;
  firstBook?: {
    title: string;
    year: number;
  } | null;
  latestBook?: {
    title: string;
    year: number;
  } | null;
  averagePages: number;
  genres: string[];
  longestBook?: {
    title: string;
    pages: number;
  } | null;
  shortestBook?: {
    title: string;
    pages: number;
  } | null;
}

interface GeneralStats {
  totalAuthors: number;
  totalBooks: number;
  averageBooksPerAuthor: number;
}

export default function AuthorsDashboard() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedStats, setSelectedStats] = useState<AuthorStats | null>(null);
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    nationality: '',
    birthYear: '',
  });

  // Cargar autores
  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/authors');
      if (!response.ok) throw new Error('Error al cargar autores');
      const data = await response.json();
      setAuthors(data);
      calculateGeneralStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular estadísticas generales
  const calculateGeneralStats = (authorsData: Author[]) => {
    const totalAuthors = authorsData.length;
    const totalBooks = authorsData.reduce((sum, author) => sum + (author._count?.books || 0), 0);
    const averageBooksPerAuthor = totalAuthors > 0 ? Math.round((totalBooks / totalAuthors) * 10) / 10 : 0;
    
    setGeneralStats({
      totalAuthors,
      totalBooks,
      averageBooksPerAuthor,
    });
  };

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Crear autor
  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear autor');
      }

      await fetchAuthors();
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear autor');
    }
  };

  // Editar autor
  const handleEditAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuthor) return;

    try {
      const response = await fetch(`/api/authors/${selectedAuthor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar autor');
      }

      await fetchAuthors();
      setShowEditModal(false);
      setSelectedAuthor(null);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar autor');
    }
  };

  // Eliminar autor
  const handleDeleteAuthor = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar al autor "${name}"? Esto también eliminará todos sus libros.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar autor');
      }

      await fetchAuthors();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar autor');
    }
  };

  // Ver estadísticas
  const handleViewStats = async (author: Author) => {
    try {
      const response = await fetch(`/api/authors/${author.id}/stats`);
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const stats = await response.json();
      setSelectedStats(stats);
      setShowStatsModal(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    }
  };

  // Abrir modal de edición
  const openEditModal = (author: Author) => {
    setSelectedAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || '',
      nationality: author.nationality || '',
      birthYear: author.birthYear?.toString() || '',
    });
    setShowEditModal(true);
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      nationality: '',
      birthYear: '',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard de Biblioteca
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona autores y sus libros
          </p>
        </div>

        {/* Estadísticas Generales */}
        {generalStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Autores</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {generalStats.totalAuthors}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Libros</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {generalStats.totalBooks}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Promedio Libros/Autor</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {generalStats.averageBooksPerAuthor}
              </div>
            </div>
          </div>
        )}

        {/* Botón Crear Autor */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Crear Nuevo Autor
          </button>
          <Link
            href="/books"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            Buscar Libros
          </Link>
        </div>

        {/* Lista de Autores */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Autores ({authors.length})
            </h2>
          </div>
          
          {authors.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No hay autores registrados. Crea uno para comenzar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nacionalidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Libros
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {authors.map((author) => (
                    <tr key={author.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {author.name}
                        </div>
                        {author.birthYear && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Nació en {author.birthYear}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {author.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {author.nationality || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {author._count?.books || 0} libros
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/authors/${author.id}`}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                          >
                            Ver Detalle
                          </Link>
                          <button
                            onClick={() => window.location.href = `/authors/${author.id}/books`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            Ver Libros
                          </button>
                          <button
                            onClick={() => handleViewStats(author)}
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                          >
                            Estadísticas
                          </button>
                          <button
                            onClick={() => openEditModal(author)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAuthor(author.id, author.name)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Crear Autor */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Crear Nuevo Autor
              </h2>
              <form onSubmit={handleCreateAuthor}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Biografía
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nacionalidad
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Año de Nacimiento
                    </label>
                    <input
                      type="number"
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Autor */}
        {showEditModal && selectedAuthor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Editar Autor
              </h2>
              <form onSubmit={handleEditAuthor}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Biografía
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nacionalidad
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Año de Nacimiento
                    </label>
                    <input
                      type="number"
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAuthor(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Estadísticas */}
        {showStatsModal && selectedStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Estadísticas de {selectedStats.authorName}
              </h2>
              
              <div className="space-y-6">
                {/* Resumen */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-300 mb-1">Total de Libros</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                      {selectedStats.totalBooks}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-300 mb-1">Promedio de Páginas</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-200">
                      {selectedStats.averagePages}
                    </div>
                  </div>
                </div>

                {/* Cronología */}
                {selectedStats.firstBook && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Primer Libro</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedStats.firstBook.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Año: {selectedStats.firstBook.year}
                    </div>
                  </div>
                )}

                {selectedStats.latestBook && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Último Libro</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedStats.latestBook.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Año: {selectedStats.latestBook.year}
                    </div>
                  </div>
                )}

                {/* Géneros */}
                {selectedStats.genres.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Géneros</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStats.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Records */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStats.longestBook && (
                    <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg">
                      <div className="text-sm text-amber-600 dark:text-amber-300 mb-1">Libro más largo</div>
                      <div className="font-semibold text-amber-900 dark:text-amber-100">
                        {selectedStats.longestBook.title}
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-200">
                        {selectedStats.longestBook.pages} páginas
                      </div>
                    </div>
                  )}

                  {selectedStats.shortestBook && (
                    <div className="bg-cyan-50 dark:bg-cyan-900 p-4 rounded-lg">
                      <div className="text-sm text-cyan-600 dark:text-cyan-300 mb-1">Libro más corto</div>
                      <div className="font-semibold text-cyan-900 dark:text-cyan-100">
                        {selectedStats.shortestBook.title}
                      </div>
                      <div className="text-sm text-cyan-700 dark:text-cyan-200">
                        {selectedStats.shortestBook.pages} páginas
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowStatsModal(false);
                    setSelectedStats(null);
                  }}
                  className="w-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
