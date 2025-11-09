import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        
        const author = await prisma.author.findUnique({
            where: { id: userId },
            include: {
                books: {
                    orderBy: {
                        publishedYear: 'desc'
                    }
                },
                _count: {
                    select: { books: true }
                }
            },
        })

        if (!author) {
            return NextResponse.json(
                { error: 'Author not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(author);
    } catch (error) {
        console.error('Error fetching author:', error);
        return NextResponse.json(
            { error: 'Failed to fetch author' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        const body = await request.json()
        const { name, email, bio, nationality, birthYear } = body;

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { error: 'Invalid email format' },
                    { status: 400 }
                )
            }
        }

        const author = await prisma.author.update({
            where: { id: userId },
            data: {
                name,
                email,
                bio,
                nationality,
                birthYear: birthYear ? parseInt(birthYear) : null,
            },
            include: {
                books: true,
            }
        })

        return NextResponse.json(author)
    } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === 'P2025') {
            return NextResponse.json(
                { error: 'Author not found' },
                { status: 404 }
            )
        }
        if (err?.code === 'P2002') {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to update author' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        
        await prisma.author.delete({
            where: { id: userId }
        })
        
        return NextResponse.json({
            message: 'Author deleted successfully' 
        })
    } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === 'P2025') {
            return NextResponse.json(
                { error: 'Author not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to delete author' },
            { status: 500 }
        )
    }
}
