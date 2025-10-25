'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-red-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="mb-6">
          <FaExclamationTriangle className="mx-auto text-6xl text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">¡Ups!</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Algo salió mal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <FaRedo className="mr-2" />
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}