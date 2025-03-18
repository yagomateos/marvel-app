"use client"

import { useFavorites } from "./favorites-provider"

export function ClientResultsCount({
  totalCount,
  showFavorites,
}: {
  totalCount: number
  showFavorites: boolean
}) {
  const { favorites } = useFavorites()

  if (showFavorites) {
    return (
      <p className="text-gray-400" aria-live="polite">
        {favorites.length} {favorites.length === 1 ? "favorite" : "favorites"}
      </p>
    )
  }

  return (
    <p className="text-gray-400" aria-live="polite">
      Found {totalCount} {totalCount === 1 ? "character" : "characters"}
    </p>
  )
}

