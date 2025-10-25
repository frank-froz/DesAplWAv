import Link from 'next/link'
import { FaHome, FaSearch } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="mb-6">
          <FaSearch className="mx-auto text-6xl text-gray-400 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Página no encontrada</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Lo sentimos, no pudimos encontrar la página que buscas.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <FaHome className="mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}