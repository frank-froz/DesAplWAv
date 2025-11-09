interface GeneralStats {
  totalAuthors: number;
  totalBooks: number;
  averageBooksPerAuthor: number;
}

interface StatsCardsProps {
  stats: GeneralStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-[#2c2824] border border-[#e8e5e0] dark:border-[#3a3530] rounded shadow-sm p-8">
        <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-2">
          Total de Autores
        </div>
        <div className="text-4xl font-serif text-[#5c4b3a] dark:text-[#a68a6d]">
          {stats.totalAuthors}
        </div>
      </div>

      <div className="bg-white dark:bg-[#2c2824] border border-[#e8e5e0] dark:border-[#3a3530] rounded shadow-sm p-8">
        <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-2">
          Total de Libros
        </div>
        <div className="text-4xl font-serif text-[#5c4b3a] dark:text-[#a68a6d]">
          {stats.totalBooks}
        </div>
      </div>

      <div className="bg-white dark:bg-[#2c2824] border border-[#e8e5e0] dark:border-[#3a3530] rounded shadow-sm p-8">
        <div className="text-sm text-[#8b7355] dark:text-[#a68a6d] mb-2">
          Promedio de Libros por Autor
        </div>
        <div className="text-4xl font-serif text-[#5c4b3a] dark:text-[#a68a6d]">
          {stats.averageBooksPerAuthor}
        </div>
      </div>
    </div>
  );
}
