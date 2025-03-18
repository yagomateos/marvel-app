"use client"

import { useFavorites } from "./favorites-provider"
import CharacterCard from "./character-card"
import type { Character } from "@/lib/types"
import { EmptyState } from "./empty-state"

export function ClientFavorites({
  characters,
  showFavorites,
}: {
  characters: Character[]
  showFavorites: boolean
}) {
  const { favorites } = useFavorites()

  // Filter characters if showing favorites
  const displayedCharacters = showFavorites
    ? characters.filter((char) => favorites.includes(char.id.toString()))
    : characters

  if (showFavorites && displayedCharacters.length === 0) {
    return (
      <EmptyState title="No favorites yet" description="Add characters to your favorites by clicking the heart icon" />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayedCharacters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          isFavorite={favorites.includes(character.id.toString())}
        />
      ))}
    </div>
  )
}

