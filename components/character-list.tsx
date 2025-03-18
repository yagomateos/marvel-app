import { getCharacters } from "@/lib/api-client"
import { ClientFavorites } from "./client-favorites"
import { EmptyState } from "./empty-state"

export default async function CharacterList({
  query,
  showFavorites,
}: {
  query: string
  showFavorites: boolean
}) {
  try {
    const characters = await getCharacters(query)

    if (characters.length === 0 && !showFavorites) {
      return (
        <EmptyState
          title="No characters found"
          description={
            query
              ? `No characters matching "${query}"`
              : "No characters available. Please check your API configuration."
          }
        />
      )
    }

    return (
      <div className="mt-4">
        <ClientFavorites characters={characters} showFavorites={showFavorites} />
      </div>
    )
  } catch (error) {
    console.error("Error in CharacterList:", error)
    return (
      <EmptyState
        title="Error loading characters"
        description="There was a problem loading the characters. Please check your API configuration or try again later."
      />
    )
  }
}

