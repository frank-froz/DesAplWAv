import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookId } = await params;
        
        if (!bookId) {
            return NextResponse.json({ error: 'Missing book id in params' }, { status: 400 });
        }

        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                author: true,
            },
        })

        if (!book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        return NextResponse.json(
            { error: 'Failed to fetch book' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookId } = await params;
        const body = await request.json();
        const {
            title,
            description,
            isbn,
            publishedYear,
            genre,
            pages,
            authorId
        } = body

        if (title && title.length < 3) {
            return NextResponse.json(
                { error: 'Title must be at least 3 characters long' },
                { status: 400 })
        }

        if (pages && pages <= 1) {
            return NextResponse.json(
                { error: 'Pages must be greater than 1' },
                { status: 400 })
        }

        if (authorId) {
            const authorExists = await prisma.author.findUnique({
                where: { id: authorId }
            })

            if (!authorExists) {
                return NextResponse.json(
                    { error: 'Author not found' },
                    { status: 404 })
            }
        }

        const book = await prisma.book.update({
            where: { id: bookId },
            data: {
                title,
                description,
                isbn,
                publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
                genre,
                pages: pages ? parseInt(pages) : undefined,
                authorId,
            },
            include: {
                author: true,
            },
        })

        return NextResponse.json(book)
    } catch (error: unknown) {
         const err = error as { code?: string };
         if (err?.code === 'P2025') {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            )
        }
        if (err?.code === 'P2002') {
            return NextResponse.json(
                { error: 'Book with this ISBN already exists' },
                { status: 409 }
            )
        }

        console.error('Error updating book:', error)
        return NextResponse.json(
            { error: 'Failed to update book' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookId } = await params;

        await prisma.book.delete({
            where: { id: bookId },
        })

        return NextResponse.json({ message: 'Book deleted successfully' })
    } catch (error: unknown) {
        const err = error as { code?: string };
        if (err?.code === 'P2025') {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            )
        }

        console.error('Error deleting book:', error)
        return NextResponse.json(
            { error: 'Failed to delete book' },
            { status: 500 }
        )
    }
}