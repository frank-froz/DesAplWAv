'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  isbn: string;
  publishedYear?: number;
  genre?: string;
  pages?: number;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SearchResponse {
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function BooksSearchPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Modales y formularios
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    pages: '',
    authorId: '',
  });

  // Cargar autores
  const fetchAuthors = useCallback(async () => {
    try {
      const response = await fetch('/api/authors');
      if (!response.ok) throw new Error('Error al cargar autores');
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
    }
  }, []);

  // Extraer géneros únicos
  const extractGenres = useCallback((booksData: Book[]) => {
    const uniqueGenres = new Set<string>();
    booksData.forEach(book => {
      if (book.genre) uniqueGenres.add(book.genre);
    });
    setGenres(Array.from(uniqueGenres).sort());
  }, []);

  // Buscar libros con filtros
  const searchBooks = useCallback(async () => {
    try {
      setSearching(true);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedAuthor) params.append('authorName', selectedAuthor);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('sortBy', sortBy);
      params.append('order', order);

      const response = await fetch(`/api/books/search?${params.toString()}`);
      if (!response.ok) throw new Error('Error al buscar libros');
      
      const data: SearchResponse = await response.json();
      setBooks(data.data);
      setPagination(data.pagination);
      
      // Extraer géneros de todos los libros
      if (page === 1 && !selectedGenre) {
        extractGenres(data.data);
      }
    } catch (err) {
      console.error('Error searching books:', err);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  }, [searchTerm, selectedGenre, selectedAuthor, page, limit, sortBy, order, extractGenres]);

  // Cargar todos los géneros disponibles
  const fetchAllGenres = useCallback(async () => {
    try {
      const response = await fetch('/api/books');
      if (!response.ok) throw new Error('Error al cargar géneros');
      const data = await response.json();
      extractGenres(data);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  }, [extractGenres]);

  // Inicialización
  useEffect(() => {
    fetchAuthors();
    fetchAllGenres();
  }, [fetchAuthors, fetchAllGenres]);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBooks();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchBooks]);

  // Crear libro
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
          pages: formData.pages ? parseInt(formData.pages) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear libro');
      }

      setShowCreateModal(false);
      resetForm();
      setPage(1);
      searchBooks();
      alert('Libro creado exitosamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear libro');
    }
  };

  // Editar libro
  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    try {
      const response = await fetch(`/api/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
          pages: formData.pages ? parseInt(formData.pages) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar libro');
      }

      setShowEditModal(false);
      setSelectedBook(null);
      resetForm();
      searchBooks();
      alert('Libro actualizado exitosamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar libro');
    }
  };

  // Eliminar libro
  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el libro "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar libro');
      }

      searchBooks();
      alert('Libro eliminado exitosamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar libro');
    }
  };

  // Abrir modal de edición
  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      description: book.description || '',
      isbn: book.isbn,
      publishedYear: book.publishedYear?.toString() || '',
      genre: book.genre || '',
      pages: book.pages?.toString() || '',
      authorId: book.authorId,
    });
    setShowEditModal(true);
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isbn: '',
      publishedYear: '',
      genre: '',
      pages: '',
      authorId: '',
    });
  };

  // Cambiar página
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfa] dark:bg-[#1a1816] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0] mb-3 tracking-tight">
                Biblioteca
              </h1>
              <p className="text-lg text-[#5c4b3a] dark:text-[#a68a6d]">
                Explora la colección literaria
              </p>
            </div>
            <Link
              href="/"
              className="bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-6 py-2.5 rounded transition-colors"
            >
              Volver
            </Link>
          </div>
        </div>

        {/* Botón Crear Libro */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-8 py-3 rounded transition-colors"
          >
            Crear libro
          </button>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white dark:bg-[#2c2824] rounded shadow-sm border border-[#e8e5e0] dark:border-[#3a3530] p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                Buscar por título
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Escribe el título..."
                className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
              />
            </div>

            {/* Filtro por Género */}
            <div>
              <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                Género
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Autor */}
            <div>
              <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                Autor
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => {
                  setSelectedAuthor(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
              >
                <option value="">Todos los autores</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div>
              <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                Ordenar por
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="flex-1 px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                >
                  <option value="createdAt">Fecha creación</option>
                  <option value="title">Título</option>
                  <option value="publishedYear">Año publicación</option>
                </select>
                <button
                  onClick={() => {
                    setOrder(order === 'asc' ? 'desc' : 'asc');
                    setPage(1);
                  }}
                  className="px-4 py-2.5 bg-[#f5f3f0] hover:bg-[#e8e5e0] dark:bg-[#3a3530] dark:hover:bg-[#4a453f] rounded transition-colors"
                  title={order === 'asc' ? 'Ascendente' : 'Descendente'}
                >
                  {order === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Limpiar Filtros */}
          {(searchTerm || selectedGenre || selectedAuthor || sortBy !== 'createdAt' || order !== 'desc') && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                  setSelectedAuthor('');
                  setSortBy('createdAt');
                  setOrder('desc');
                  setPage(1);
                }}
                className="text-sm text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-[#5c4b3a] dark:text-[#a68a6d]">
            {searching ? (
              <span>Buscando...</span>
            ) : (
              <span>
                <strong>{pagination.total}</strong> {pagination.total === 1 ? 'libro encontrado' : 'libros encontrados'}
                {pagination.totalPages > 1 && (
                  <span className="ml-2">
                    — Página {pagination.page} de {pagination.totalPages}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {searching && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b7355]"></div>
          </div>
        )}

        {/* Lista de Libros */}
        {!searching && books.length === 0 ? (
          <div className="bg-white dark:bg-[#2c2824] rounded shadow-sm border border-[#e8e5e0] dark:border-[#3a3530] p-16 text-center">
            <p className="text-xl text-[#5c4b3a] dark:text-[#a68a6d] mb-4">
              No se encontraron libros con los filtros seleccionados
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
                setSelectedAuthor('');
                setPage(1);
              }}
              className="mt-4 text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          !searching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-[#2c2824] rounded shadow-sm hover:shadow-md border border-[#e8e5e0] dark:border-[#3a3530] p-6 transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0] mb-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-2">
                      {book.author.name}
                    </p>
                    {book.description && (
                      <p className="text-sm text-[#5c4b3a] dark:text-[#8b7355] line-clamp-3">
                        {book.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-[#5c4b3a] dark:text-[#8b7355]">
                    {book.publishedYear && (
                      <div>
                        Año: {book.publishedYear}
                      </div>
                    )}
                    {book.genre && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f5f3f0] text-[#5c4b3a] dark:bg-[#3a3530] dark:text-[#a68a6d] border border-[#e8e5e0] dark:border-[#3a3530]">
                        {book.genre}
                      </div>
                    )}
                    {book.pages && (
                      <div>
                        {book.pages} páginas
                      </div>
                    )}
                    <div className="text-xs text-[#8b7355] dark:text-[#8b7355]">
                      ISBN: {book.isbn}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-[#e8e5e0] dark:border-[#3a3530]">
                    <button
                      onClick={() => openEditModal(book)}
                      className="flex-1 bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="flex-1 bg-[#8b7355] hover:bg-[#755e44] dark:bg-[#5c4b3a] dark:hover:bg-[#4a3d2f] text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Paginación */}
        {!searching && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!pagination.hasPrev}
              className={`px-5 py-2.5 rounded transition-colors ${
                pagination.hasPrev
                  ? 'bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white'
                  : 'bg-[#f5f3f0] dark:bg-[#3a3530] text-[#8b7355] dark:text-[#8b7355] cursor-not-allowed'
              }`}
            >
              Anterior
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2.5 rounded transition-colors ${
                      page === pageNum
                        ? 'bg-[#5c4b3a] dark:bg-[#8b7355] text-white'
                        : 'bg-white dark:bg-[#2c2824] text-[#5c4b3a] dark:text-[#a68a6d] hover:bg-[#f5f3f0] dark:hover:bg-[#3a3530] border border-[#e8e5e0] dark:border-[#3a3530]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!pagination.hasNext}
              className={`px-5 py-2.5 rounded transition-colors ${
                pagination.hasNext
                  ? 'bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white'
                  : 'bg-[#f5f3f0] dark:bg-[#3a3530] text-[#8b7355] dark:text-[#8b7355] cursor-not-allowed'
              }`}
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Modal Crear Libro */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-[#2c2824] rounded shadow-lg border border-[#e8e5e0] dark:border-[#3a3530] max-w-2xl w-full p-8 my-8">
              <h2 className="text-2xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0] mb-6">
                Nuevo libro
              </h2>
              <form onSubmit={handleCreateBook}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Autor *
                    </label>
                    <select
                      required
                      value={formData.authorId}
                      onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Selecciona un autor</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Año de Publicación
                    </label>
                    <input
                      type="number"
                      value={formData.publishedYear}
                      onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Género
                    </label>
                    <input
                      type="text"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número de Páginas
                    </label>
                    <input
                      type="number"
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-5 py-3 rounded transition-colors"
                  >
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-[#f5f3f0] hover:bg-[#e8e5e0] dark:bg-[#3a3530] dark:hover:bg-[#4a453f] text-[#5c4b3a] dark:text-[#e8e5e0] px-5 py-3 rounded transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Libro */}
        {showEditModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-[#2c2824] rounded shadow-lg border border-[#e8e5e0] dark:border-[#3a3530] max-w-2xl w-full p-8 my-8">
              <h2 className="text-2xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0] mb-6">
                Editar libro
              </h2>
              <form onSubmit={handleEditBook}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Autor *
                    </label>
                    <select
                      required
                      value={formData.authorId}
                      onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    >
                      <option value="">Selecciona un autor</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Año de Publicación
                    </label>
                    <input
                      type="number"
                      value={formData.publishedYear}
                      onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Género
                    </label>
                    <input
                      type="text"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5c4b3a] dark:text-[#a68a6d] mb-2">
                      Número de Páginas
                    </label>
                    <input
                      type="number"
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#e8e5e0] dark:border-[#3a3530] rounded focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:bg-[#1a1816] dark:text-[#e8e5e0]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-5 py-3 rounded transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedBook(null);
                      resetForm();
                    }}
                    className="flex-1 bg-[#f5f3f0] hover:bg-[#e8e5e0] dark:bg-[#3a3530] dark:hover:bg-[#4a453f] text-[#5c4b3a] dark:text-[#e8e5e0] px-5 py-3 rounded transition-colors"
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
