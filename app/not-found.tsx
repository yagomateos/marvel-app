import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl mb-8">The character you're looking for doesn't exist in this universe.</p>
      <Link
        href="/"
        className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Return to Home
      </Link>
    </div>
  )
}

