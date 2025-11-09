import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Await params para evitar errores de Next.js con parámetros dinámicos
        const resolvedParams = (await params) as { id?: string };
        const authorId = resolvedParams.id;
        
        if (!authorId) {
            return NextResponse.json(
                { error: 'Missing author id in params' },
                { status: 400 }
            );
        }

        // Verificar que el autor existe
        const author = await prisma.author.findUnique({
            where: { id: authorId },
            select: {
                id: true,
                name: true,
            }
        });

        if (!author) {
            return NextResponse.json(
                { error: 'Author not found' },
                { status: 404 }
            );
        }

        // Obtener todos los libros del autor
        const books = await prisma.book.findMany({
            where: { authorId: authorId },
            select: {
                title: true,
                publishedYear: true,
                pages: true,
                genre: true,
            },
            orderBy: {
                publishedYear: 'asc'
            }
        });

        // Si no tiene libros, devolver estadísticas vacías
        if (books.length === 0) {
            return NextResponse.json({
                authorId: author.id,
                authorName: author.name,
                totalBooks: 0,
                firstBook: null,
                latestBook: null,
                averagePages: 0,
                genres: [],
                longestBook: null,
                shortestBook: null
            });
        }

        // Calcular estadísticas
        const totalBooks = books.length;

        // Filtrar libros que tienen año de publicación
        const booksWithYear = books.filter(book => book.publishedYear !== null);
        
        // Primer y último libro (por año)
        const firstBook = booksWithYear.length > 0 
            ? { 
                title: booksWithYear[0].title, 
                year: booksWithYear[0].publishedYear! 
              }
            : null;
        
        const latestBook = booksWithYear.length > 0
            ? { 
                title: booksWithYear[booksWithYear.length - 1].title, 
                year: booksWithYear[booksWithYear.length - 1].publishedYear! 
              }
            : null;

        // Promedio de páginas (solo libros con páginas definidas)
        const booksWithPages = books.filter(book => book.pages !== null && book.pages > 0);
        const averagePages = booksWithPages.length > 0
            ? Math.round(
                booksWithPages.reduce((sum, book) => sum + book.pages!, 0) / booksWithPages.length
              )
            : 0;

        // Géneros únicos (filtrar nulls y vacíos)
        const genresSet = new Set(
            books
                .map(book => book.genre)
                .filter(genre => genre !== null && genre !== '')
        );
        const genres = Array.from(genresSet).sort();

        // Libro con más páginas
        const longestBook = booksWithPages.length > 0
            ? booksWithPages.reduce((max, book) => 
                book.pages! > max.pages! ? book : max
              )
            : null;

        // Libro con menos páginas
        const shortestBook = booksWithPages.length > 0
            ? booksWithPages.reduce((min, book) => 
                book.pages! < min.pages! ? book : min
              )
            : null;

        // Construir respuesta
        return NextResponse.json({
            authorId: author.id,
            authorName: author.name,
            totalBooks,
            firstBook,
            latestBook,
            averagePages,
            genres,
            longestBook: longestBook 
                ? { title: longestBook.title, pages: longestBook.pages! }
                : null,
            shortestBook: shortestBook
                ? { title: shortestBook.title, pages: shortestBook.pages! }
                : null
        });

    } catch (error) {
        console.error('Error fetching author stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch author statistics' },
            { status: 500 }
        );
    }
}
