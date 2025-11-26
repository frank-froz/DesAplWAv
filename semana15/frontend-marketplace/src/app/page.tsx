'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product, Category, ApiResponse } from '@/types/product';
import { API_URL } from '@/config/api';

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_URL}/categories`);
                if (res.ok) {
                    const data: ApiResponse<Category[]> = await res.json();
                    if (data.success) {
                        setCategories(data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProducts = async (categoryId?: string) => {
            try {
                const url = categoryId ? `${API_URL}/products?categoryId=${categoryId}` : `${API_URL}/products`;
                const res = await fetch(url);
                if (res.ok) {
                    const data: ApiResponse<Product[]> = await res.json();
                    if (data.success) {
                        setProducts(data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    const handleCategoryChange = async (categoryId: string) => {
        setSelectedCategory(categoryId);
        setLoading(true);
        try {
            const url = categoryId ? `${API_URL}/products?categoryId=${categoryId}` : `${API_URL}/products`;
            const res = await fetch(url);
            if (res.ok) {
                const data: ApiResponse<Product[]> = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Productos</h1>

            <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por categoría
                </label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-blue-600 font-medium"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Cargando productos...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">No hay productos disponibles</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            {product.imageUrl && product.imageUrl.trim() !== '' && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.nombre}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            )}
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {product.nombre}
                            </h2>
                            <p className="text-2xl font-bold text-gray-900 mb-3">
                                S/ {product.precio}
                            </p>
                            {product.category && (
                                <p className="text-sm text-gray-500 mb-2">
                                    Categoría: {product.category.name}
                                </p>
                            )}
                            {product.descripcion && (
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {product.descripcion}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}