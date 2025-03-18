"use client"

import { useFavorites } from "./favorites-provider"

export function FavoriteButton({ characterId }: { characterId: string }) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorite = favorites.includes(characterId)

  return (
    <button
      onClick={() => toggleFavorite(characterId)}
      className="p-2 rounded-full hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-red-500"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isFavorite ? "red" : "none"}
        stroke={isFavorite ? "red" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  )
}

