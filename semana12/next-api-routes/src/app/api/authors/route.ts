import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const authors = await prisma.author.findMany({
            include: {
                books: true,
                _count: {
                    select: { books: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(authors);
    } catch (error) {
        console.error('Error fetching authors:', error);
        return NextResponse.json(
            { error: 'Failed to fetch authors' }, 
            { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, bio, nationality, birthYear } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' }, 
                { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' }, 
                { status: 400 })
        }

        const author = await prisma.author.create({
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

        return NextResponse.json(author, { status: 201 })
    } catch (error: unknown) {
        const err = error as { code?: string };
        if (err?.code === 'P2002') {
            return NextResponse.json(
                { error: 'An author with this email already exists' },
                { status: 409 })
        }

        console.log(error);
        return NextResponse.json(
            { error: 'Failed to create author' }, 
            { status: 500 })
    }
}
