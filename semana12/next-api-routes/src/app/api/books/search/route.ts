import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Extraer parámetros de búsqueda
        const search = searchParams.get('search') || ''
        const genre = searchParams.get('genre') || ''
        const authorName = searchParams.get('authorName') || ''
        
        // Extraer parámetros de paginación
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limitParam = parseInt(searchParams.get('limit') || '10')
        const limit = Math.min(50, Math.max(1, limitParam)) // máximo 50, mínimo 1
        
        // Extraer parámetros de ordenamiento
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const order = searchParams.get('order') || 'desc'
        
        // Validar sortBy (solo permitir campos seguros)
        const allowedSortFields = ['title', 'publishedYear', 'createdAt']
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
        
        // Validar order
        const validOrder = order === 'asc' ? 'asc' : 'desc'
        
        // Construir el objeto where dinámicamente
        const where: Prisma.BookWhereInput = {}
        
        // Filtro por título (búsqueda parcial, case-insensitive)
        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive'
            }
        }
        
        // Filtro por género exacto
        if (genre) {
            where.genre = genre
        }
        
        // Filtro por nombre de autor (búsqueda parcial, case-insensitive)
        if (authorName) {
            where.author = {
                name: {
                    contains: authorName,
                    mode: 'insensitive'
                }
            }
        }
        
        // Calcular skip para paginación
        const skip = (page - 1) * limit
        
        // Ejecutar query con filtros, paginación y ordenamiento
        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                },
                orderBy: {
                    [validSortBy]: validOrder
                },
                skip,
                take: limit,
            }),
            prisma.book.count({ where })
        ])
        
        // Calcular metadata de paginación
        const totalPages = Math.ceil(total / limit)
        const hasNext = page < totalPages
        const hasPrev = page > 1
        
        // Respuesta con data y pagination
        return NextResponse.json({
            data: books,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev
            }
        })
        
    } catch (error) {
        console.error('Error searching books:', error)
        return NextResponse.json(
            { error: 'Failed to search books' },
            { status: 500 }
        )
    }
}
