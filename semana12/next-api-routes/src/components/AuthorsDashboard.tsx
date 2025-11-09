'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ToastContainer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LoadingOverlay } from '@/components/LoadingSpinner';
import { AuthorFormModal } from '@/components/AuthorFormModal';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AuthorsTable } from '@/components/dashboard/AuthorsTable';
import { AuthorStatsModal } from '@/components/dashboard/AuthorStatsModal';

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
  const { toasts, showToast, removeToast } = useToast();

  // Estados de datos
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [selectedStats, setSelectedStats] = useState<AuthorStats | null>(null);

  // Estados de UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    author: Author | null;
  }>({ isOpen: false, author: null });

  // Cargar autores
  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/authors');
      
      if (!response.ok) {
        throw new Error('Error al cargar autores');
      }

      const data = await response.json();
      setAuthors(data);
      calculateGeneralStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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
  const handleCreateAuthor = async (formData: {
    name: string;
    email: string;
    bio: string;
    nationality: string;
    birthYear: string;
  }) => {
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

      setShowCreateModal(false);
      await fetchAuthors();
      showToast('Autor creado exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear autor';
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  // Editar autor
  const handleEditAuthor = async (formData: {
    name: string;
    email: string;
    bio: string;
    nationality: string;
    birthYear: string;
  }) => {
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

      setShowEditModal(false);
      setSelectedAuthor(null);
      await fetchAuthors();
      showToast('Autor actualizado exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar autor';
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  // Eliminar autor
  const handleDeleteAuthor = async () => {
    const author = deleteConfirm.author;
    if (!author) return;

    try {
      const response = await fetch(`/api/authors/${author.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar autor');
      }

      setDeleteConfirm({ isOpen: false, author: null });
      await fetchAuthors();
      showToast(`Autor "${author.name}" eliminado exitosamente`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar autor';
      showToast(errorMessage, 'error');
    }
  };

  // Ver estadísticas
  const handleViewStats = async (author: Author) => {
    try {
      const response = await fetch(`/api/authors/${author.id}/stats`);
      
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const stats = await response.json();
      setSelectedStats(stats);
      setShowStatsModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      showToast(errorMessage, 'error');
    }
  };

  // Abrir modal de edición
  const openEditModal = (author: Author) => {
    setSelectedAuthor(author);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfcfa] dark:bg-[#1a1816]">
        <LoadingOverlay message="Cargando dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfcfa] dark:bg-[#1a1816]">
        <div className="text-center">
          <div className="text-xl text-[#8b7355] dark:text-[#a68a6d] mb-4">Error: {error}</div>
          <button
            onClick={fetchAuthors}
            className="bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-6 py-3 rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#fdfcfa] dark:bg-[#1a1816] p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0] mb-3 tracking-tight">
              Biblioteca
            </h1>
            <p className="text-lg text-[#5c4b3a] dark:text-[#a68a6d]">
              Gestiona los autores y consulta sus estadísticas
            </p>
          </div>

          {/* Estadísticas Generales */}
          {generalStats && <StatsCards stats={generalStats} />}

          {/* Botones de Acción */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#5c4b3a] hover:bg-[#4a3d2f] dark:bg-[#8b7355] dark:hover:bg-[#a68a6d] text-white px-8 py-3 rounded transition-colors"
            >
              Crear autor
            </button>
            <Link
              href="/books"
              className="bg-[#8b7355] hover:bg-[#755e44] dark:bg-[#5c4b3a] dark:hover:bg-[#4a3d2f] text-white px-8 py-3 rounded transition-colors"
            >
              Buscar libros
            </Link>
          </div>

          {/* Tabla de Autores */}
          <div className="bg-white dark:bg-[#2c2824] rounded shadow-sm border border-[#e8e5e0] dark:border-[#3a3530] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e8e5e0] dark:border-[#3a3530]">
              <h2 className="text-xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0]">
                Autores ({authors.length})
              </h2>
            </div>
            
            <AuthorsTable
              authors={authors}
              onEdit={openEditModal}
              onDelete={(author) => setDeleteConfirm({ isOpen: true, author })}
              onViewStats={handleViewStats}
            />
          </div>
        </div>
      </div>

      {/* Modales */}
      <AuthorFormModal
        isOpen={showCreateModal}
        title="Crear Nuevo Autor"
        onSubmit={handleCreateAuthor}
        onClose={() => setShowCreateModal(false)}
        submitLabel="Crear Autor"
      />

      <AuthorFormModal
        isOpen={showEditModal}
        title="Editar Autor"
        initialData={selectedAuthor ? {
          name: selectedAuthor.name,
          email: selectedAuthor.email,
          bio: selectedAuthor.bio || '',
          nationality: selectedAuthor.nationality || '',
          birthYear: selectedAuthor.birthYear?.toString() || '',
        } : undefined}
        onSubmit={handleEditAuthor}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAuthor(null);
        }}
        submitLabel="Guardar Cambios"
      />

      <AuthorStatsModal
        isOpen={showStatsModal}
        stats={selectedStats}
        onClose={() => {
          setShowStatsModal(false);
          setSelectedStats(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar al autor "${deleteConfirm.author?.name}"? Esta acción también eliminará todos sus libros y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDeleteAuthor}
        onCancel={() => setDeleteConfirm({ isOpen: false, author: null })}
      />

      {/* Sistema de notificaciones */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
