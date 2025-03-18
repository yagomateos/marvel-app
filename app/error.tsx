"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-xl mb-8">We encountered an error while loading this page.</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

