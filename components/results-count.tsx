import { getCharacters } from "@/lib/api-client"
import { ClientResultsCount } from "./client-results-count"

export default async function ResultsCount({
  query,
  showFavorites,
}: {
  query: string
  showFavorites: boolean
}) {
  try {
    const characters = await getCharacters(query)

    return (
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-2xl font-bold">{showFavorites ? "Favorite Characters" : "Characters"}</h2>
        <ClientResultsCount totalCount={characters.length} showFavorites={showFavorites} />
      </div>
    )
  } catch (error) {
    console.error("Error in ResultsCount:", error)
    return (
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-2xl font-bold">{showFavorites ? "Favorite Characters" : "Characters"}</h2>
        <p className="text-gray-400">Error loading results</p>
      </div>
    )
  }
}

