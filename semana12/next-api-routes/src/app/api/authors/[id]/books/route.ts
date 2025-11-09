import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: authorId } = await params;
        
        if (!authorId) {
            return NextResponse.json({ error: 'Missing author id in params' }, { status: 400 });
        }

        const author = await prisma.author.findUnique({
            where: { id: authorId }
        })

        if (!author) {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            )
        }

        const books = await prisma.book.findMany({
            where: { authorId: authorId },
            orderBy: {
                publishedYear: "desc"
            }
        })

        return NextResponse.json({
            author: {
                id: author.id,
                name: author.name,
            },
            totalBooks: books.length,
            books
        })
    } catch (error) {
        console.error("Error fetching books:", error)
        return NextResponse.json(
            { error: "Failed to fetch books" },
            { status: 500 }
        )
    }
}
