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

interface AuthorStatsModalProps {
  isOpen: boolean;
  stats: AuthorStats | null;
  onClose: () => void;
}

export function AuthorStatsModal({ isOpen, stats, onClose }: AuthorStatsModalProps) {
  if (!isOpen || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#2c2824] rounded max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto border border-[#e8e5e0] dark:border-[#3a3530] shadow-lg">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-serif text-[#2c2c2c] dark:text-[#e8e5e0]">
            Estadísticas de {stats.authorName}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8b7355] hover:text-[#5c4b3a] dark:text-[#a68a6d] dark:hover:text-[#c4a676] text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
          <div className="mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

        <button
          onClick={onClose}
          className="w-full bg-[#8b7355] hover:bg-[#755e44] dark:bg-[#5c4b3a] dark:hover:bg-[#4a3d2f] text-white px-4 py-3 rounded font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
