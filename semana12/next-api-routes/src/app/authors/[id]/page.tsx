'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
  createdAt: string;
  updatedAt: string;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  isbn: string;
  publishedYear?: number;
  genre?: string;
  pages?: number;
  createdAt: string;
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

export default function AuthorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateBookModal, setShowCreateBookModal] = useState(false);

  // Formularios
  const [authorFormData, setAuthorFormData] = useState({
    name: '',
    email: '',
    bio: '',
    nationality: '',
    birthYear: '',
  });

  const [bookFormData, setBookFormData] = useState({
    title: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    pages: '',
  });

  // Cargar datos del autor
  const fetchAuthorData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Cargar autor, libros y estadísticas en paralelo
      const [authorRes, booksRes, statsRes] = await Promise.all([
        fetch(`/api/authors/${authorId}`),
        fetch(`/api/authors/${authorId}/books`),
        fetch(`/api/authors/${authorId}/stats`),
      ]);

      if (!authorRes.ok) {
        if (authorRes.status === 404) {
          throw new Error('Autor no encontrado');
        }
        throw new Error('Error al cargar el autor');
      }

      const authorData = await authorRes.json();
      setAuthor(authorData);

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData.books || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Pre-cargar formulario de edición
      setAuthorFormData({
        name: authorData.name,
        email: authorData.email,
        bio: authorData.bio || '',
        nationality: authorData.nationality || '',
        birthYear: authorData.birthYear?.toString() || '',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    if (authorId) {
      fetchAuthorData();
    }
  }, [authorId, fetchAuthorData]);

  // Editar autor
  const handleEditAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...authorFormData,
          birthYear: authorFormData.birthYear ? parseInt(authorFormData.birthYear) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar autor');
      }

      setShowEditModal(false);
      fetchAuthorData();
      alert('Autor actualizado exitosamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar autor');
    }
  };

  // Crear libro para este autor
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookFormData,
          authorId: authorId,
          publishedYear: bookFormData.publishedYear ? parseInt(bookFormData.publishedYear) : null,
          pages: bookFormData.pages ? parseInt(bookFormData.pages) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear libro');
      }

      setShowCreateBookModal(false);
      resetBookForm();
      fetchAuthorData();
      alert('Libro creado exitosamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear libro');
    }
  };

  // Eliminar libro
  const handleDeleteBook = async (bookId: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el libro "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar libro');
      }

      fetchAuthorData();
      alert('Libro eliminado exitosamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar libro');
    }
  };

  const resetBookForm = () => {
    setBookFormData({
      title: '',
      description: '',
      isbn: '',
      publishedYear: '',
      genre: '',
      pages: '',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfcfa] dark:bg-[#1a1816]">
        <div className="text-xl text-[#5c4b3a] dark:text-[#a68a6d]">Cargando información del autor...</div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4 bg-[#fdfcfa] dark:bg-[#1a1816]">
        <div className="text-xl text-[#8b7355] dark:text-[#a68a6d]">Error: {error || 'Autor no encontrado'}</div>
        <Link
          href="/"
          className="bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-6 py-3 rounded font-medium transition-colors"
        >
          ← Volver al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfa] dark:bg-[#1a1816] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con navegación */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium"
            >
              ← Volver al Dashboard
            </Link>
            <Link
              href="/books"
              className="text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium"
            >
              Ver todos los libros
            </Link>
          </div>
        </div>

        {/* Información del Autor */}
        <div className="bg-white dark:bg-[#2c2824] rounded shadow-sm border border-[#e8e5e0] dark:border-[#3a3530] p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0] mb-2">
                {author.name}
              </h1>
              <p className="text-lg text-[#5c4b3a] dark:text-[#a68a6d]">
                {author.email}
              </p>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-6 py-3 rounded font-medium transition-colors"
            >
              Editar autor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {author.bio && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-[#8b7355] dark:text-[#a68a6d] mb-2">
                  Biografía
                </h3>
                <p className="text-[#2c2c2c] dark:text-[#e8e5e0]">
                  {author.bio}
                </p>
              </div>
            )}

            {author.nationality && (
              <div>
                <h3 className="text-sm font-medium text-[#8b7355] dark:text-[#a68a6d] mb-2">
                  Nacionalidad
                </h3>
                <p className="text-[#2c2c2c] dark:text-[#e8e5e0]">
                  {author.nationality}
                </p>
              </div>
            )}

            {author.birthYear && (
              <div>
                <h3 className="text-sm font-medium text-[#8b7355] dark:text-[#a68a6d] mb-2">
                  Año de Nacimiento
                </h3>
                <p className="text-[#2c2c2c] dark:text-[#e8e5e0]">
                  {author.birthYear}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas del Autor */}
        {stats && (
          <div className="bg-white dark:bg-[#2c2824] rounded shadow-sm border border-[#e8e5e0] dark:border-[#3a3530] p-8 mb-8">
            <h2 className="text-2xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0] mb-6">
              Estadísticas
            </h2>

            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#f5f3f0] dark:bg-[#1a1816] p-5 rounded border border-[#e8e5e0] dark:border-[#3a3530]">
                <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-1">Total de Libros</div>
                <div className="text-4xl font-serif text-[#5c4b3a] dark:text-[#c4a676]">
                  {stats.totalBooks}
                </div>
              </div>
              <div className="bg-[#f5f3f0] dark:bg-[#1a1816] p-5 rounded border border-[#e8e5e0] dark:border-[#3a3530]">
                <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-1">Promedio de Páginas</div>
                <div className="text-4xl font-serif text-[#5c4b3a] dark:text-[#c4a676]">
                  {stats.averagePages}
                </div>
              </div>
              <div className="bg-[#f5f3f0] dark:bg-[#1a1816] p-5 rounded border border-[#e8e5e0] dark:border-[#3a3530]">
                <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-1">Géneros</div>
                <div className="text-4xl font-serif text-[#5c4b3a] dark:text-[#c4a676]">
                  {stats.genres.length}
                </div>
              </div>
            </div>

            {/* Cronología */}
            {(stats.firstBook || stats.latestBook) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {stats.firstBook && (
                  <div className="border-l-4 border-[#5c4b3a] dark:border-[#a68a6d] pl-4">
                    <div className="text-sm text-[#8b7355] dark:text-[#a68a6d]">Primer Libro</div>
                    <div className="font-medium text-[#2c2c2c] dark:text-[#e8e5e0] mt-1">
                      {stats.firstBook.title}
                    </div>
                    <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mt-1">
                      Año: {stats.firstBook.year}
                    </div>
                  </div>
                )}

                {stats.latestBook && (
                  <div className="border-l-4 border-[#8b7355] dark:border-[#c4a676] pl-4">
                    <div className="text-sm text-[#8b7355] dark:text-[#a68a6d]">Último Libro</div>
                    <div className="font-medium text-[#2c2c2c] dark:text-[#e8e5e0] mt-1">
                      {stats.latestBook.title}
                    </div>
                    <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mt-1">
                      Año: {stats.latestBook.year}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Géneros */}
            {stats.genres.length > 0 && (
              <div className="mb-6">
                <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-3">Géneros Literarios</div>
                <div className="flex flex-wrap gap-2">
                  {stats.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-[#f5f3f0] dark:bg-[#1a1816] text-[#5c4b3a] dark:text-[#a68a6d] rounded text-sm font-medium border border-[#e8e5e0] dark:border-[#3a3530]"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.longestBook && (
                <div className="bg-[#f5f3f0] dark:bg-[#1a1816] p-4 rounded border border-[#e8e5e0] dark:border-[#3a3530]">
                  <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-1">
                    Libro Más Largo
                  </div>
                  <div className="font-medium text-[#2c2c2c] dark:text-[#e8e5e0]">
                    {stats.longestBook.title}
                  </div>
                  <div className="text-sm text-[#5c4b3a] dark:text-[#a68a6d] mt-1">
                    {stats.longestBook.pages} páginas
                  </div>
                </div>
              )}

              {stats.shortestBook && (
                <div className="bg-[#f5f3f0] dark:bg-[#1a1816] p-4 rounded border border-[#e8e5e0] dark:border-[#3a3530]">
                  <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-1">
                    Libro Más Corto
                  </div>
                  <div className="font-medium text-[#2c2c2c] dark:text-[#e8e5e0]">
                    {stats.shortestBook.title}
                  </div>
                  <div className="text-sm text-[#5c4b3a] dark:text-[#a68a6d] mt-1">
                    {stats.shortestBook.pages} páginas
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Libros del Autor */}
        <div className="bg-white dark:bg-[#2c2824] rounded shadow-sm border border-[#e8e5e0] dark:border-[#3a3530] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0]">
              Libros ({books.length})
            </h2>
            <button
              onClick={() => setShowCreateBookModal(true)}
              className="bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-6 py-3 rounded font-medium transition-colors"
            >
              Agregar libro
            </button>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-[#8b7355] dark:text-[#a68a6d] mb-4">
                Este autor aún no tiene libros registrados
              </p>
              <button
                onClick={() => setShowCreateBookModal(true)}
                className="text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium"
              >
                Agregar el primer libro
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {book.title}
                  </h3>

                  {book.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {book.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {book.publishedYear && (
                      <div className="text-sm text-[#5c4b3a] dark:text-[#a68a6d]">
                        Año: {book.publishedYear}
                      </div>
                    )}
                    {book.genre && (
                      <div className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#f5f3f0] text-[#5c4b3a] dark:bg-[#1a1816] dark:text-[#a68a6d] border border-[#e8e5e0] dark:border-[#3a3530]">
                        {book.genre}
                      </div>
                    )}
                    {book.pages && (
                      <div className="text-sm text-[#5c4b3a] dark:text-[#a68a6d]">
                        {book.pages} páginas
                      </div>
                    )}
                    <div className="text-xs text-[#8b7355] dark:text-[#a68a6d]">
                      ISBN: {book.isbn}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-[#e8e5e0] dark:border-[#3a3530]">
                    <button
                      onClick={() => router.push(`/books?search=${encodeURIComponent(book.title)}`)}
                      className="flex-1 bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="flex-1 bg-[#8b7355] hover:bg-[#755e44] dark:bg-[#5c4b3a] dark:hover:bg-[#4a3d2f] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Editar Autor */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Editar Información del Autor
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
                      value={authorFormData.name}
                      onChange={(e) => setAuthorFormData({ ...authorFormData, name: e.target.value })}
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
                      value={authorFormData.email}
                      onChange={(e) => setAuthorFormData({ ...authorFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Biografía
                    </label>
                    <textarea
                      value={authorFormData.bio}
                      onChange={(e) => setAuthorFormData({ ...authorFormData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nacionalidad
                      </label>
                      <input
                        type="text"
                        value={authorFormData.nationality}
                        onChange={(e) => setAuthorFormData({ ...authorFormData, nationality: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Año de Nacimiento
                      </label>
                      <input
                        type="number"
                        value={authorFormData.birthYear}
                        onChange={(e) => setAuthorFormData({ ...authorFormData, birthYear: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Crear Libro */}
        {showCreateBookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 my-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Agregar Nuevo Libro para {author.name}
              </h2>
              <form onSubmit={handleCreateBook}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookFormData.title}
                      onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={bookFormData.description}
                      onChange={(e) => setBookFormData({ ...bookFormData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookFormData.isbn}
                      onChange={(e) => setBookFormData({ ...bookFormData, isbn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Año de Publicación
                    </label>
                    <input
                      type="number"
                      value={bookFormData.publishedYear}
                      onChange={(e) => setBookFormData({ ...bookFormData, publishedYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Género
                    </label>
                    <input
                      type="text"
                      value={bookFormData.genre}
                      onChange={(e) => setBookFormData({ ...bookFormData, genre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número de Páginas
                    </label>
                    <input
                      type="number"
                      value={bookFormData.pages}
                      onChange={(e) => setBookFormData({ ...bookFormData, pages: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Crear Libro
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateBookModal(false);
                      resetBookForm();
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
      </div>
    </div>
  );
}
