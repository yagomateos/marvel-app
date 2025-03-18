"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useFavorites } from "./favorites-provider"

export function Navbar() {
  const { favorites } = useFavorites()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFavoritesClick = () => {
    if (pathname !== "/") {
      router.push("/?favorites=true")
    } else {
      const params = new URLSearchParams(searchParams)
      params.set("favorites", "true")
      router.push(`/?${params.toString()}`)
    }
  }

  const handleLogoClick = () => {
    if (searchParams.has("favorites") || searchParams.has("query")) {
      router.push("/")
    }
  }

  return (
    <nav className="bg-red-600 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-white rounded-md"
          onClick={handleLogoClick}
        >
          <Image src="/marvel-logo.svg" alt="Marvel Logo" width={130} height={52} className="h-8 w-auto" />
        </Link>
        <button
          onClick={handleFavoritesClick}
          className="flex items-center gap-2 text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1"
          aria-label="View favorites"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="bg-white text-red-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
            {favorites.length}
          </span>
        </button>
      </div>
    </nav>
  )
}

