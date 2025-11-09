import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  email: string;
  birthYear?: number;
  nationality?: string;
  _count?: {
    books: number;
  };
}

interface AuthorsTableProps {
  authors: Author[];
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
  onViewStats: (author: Author) => void;
}

export function AuthorsTable({ authors, onEdit, onDelete, onViewStats }: AuthorsTableProps) {
  if (authors.length === 0) {
    return (
      <div className="p-12 text-center text-[#8b7355] dark:text-[#a68a6d]">
        No hay autores registrados. Crea uno para comenzar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#f5f3f0] dark:bg-[#2c2824]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-[#5c4b3a] dark:text-[#a68a6d] uppercase tracking-wider">
              Autor
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-[#5c4b3a] dark:text-[#a68a6d] uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-[#5c4b3a] dark:text-[#a68a6d] uppercase tracking-wider">
              Nacionalidad
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-[#5c4b3a] dark:text-[#a68a6d] uppercase tracking-wider">
              Libros
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-[#5c4b3a] dark:text-[#a68a6d] uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e8e5e0] dark:divide-[#3a3530]">
          {authors.map((author) => (
            <tr key={author.id} className="hover:bg-[#f5f3f0] dark:hover:bg-[#2c2824] transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-[#2c2c2c] dark:text-[#e8e5e0]">
                  {author.name}
                </div>
                {author.birthYear && (
                  <div className="text-sm text-[#8b7355] dark:text-[#a68a6d]">
                    Nació en {author.birthYear}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-[#5c4b3a] dark:text-[#a68a6d]">
                {author.email}
              </td>
              <td className="px-6 py-4 text-sm text-[#5c4b3a] dark:text-[#a68a6d]">
                {author.nationality || '-'}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#f5f3f0] text-[#5c4b3a] dark:bg-[#2c2824] dark:text-[#a68a6d] border border-[#e8e5e0] dark:border-[#3a3530]">
                  {author._count?.books || 0} libros
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/authors/${author.id}`}
                    className="text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium"
                  >
                    Ver detalle
                  </Link>
                  <button
                    onClick={() => onViewStats(author)}
                    className="text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium"
                  >
                    Estadísticas
                  </button>
                  <button
                    onClick={() => onEdit(author)}
                    className="text-[#5c4b3a] hover:text-[#4a3d2f] dark:text-[#a68a6d] dark:hover:text-[#c4a676] font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(author)}
                    className="text-[#8b7355] hover:text-[#755e44] dark:text-[#8b7355] dark:hover:text-[#755e44] font-medium"
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
  );
}
