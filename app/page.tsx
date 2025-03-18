import { Suspense } from "react"
import CharacterList from "@/components/character-list"
import SearchBar from "@/components/search-bar"
import { Navbar } from "@/components/navbar"
import { ErrorBoundary, ErrorFallback } from "@/components/error-boundary"
import ResultsCount from "@/components/results-count"

export default function Home({
  searchParams,
}: {
  searchParams: { query?: string; favorites?: string }
}) {
  const query = searchParams.query || ""
  const showFavorites = searchParams.favorites === "true"

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <SearchBar initialQuery={query} />

        <ErrorBoundary
          fallback={
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{showFavorites ? "Favorite Characters" : "Characters"}</h2>
              </div>
              <ErrorFallback message="Failed to load characters. Please check your API configuration or try again later." />
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{showFavorites ? "Favorite Characters" : "Characters"}</h2>
                  <p className="text-gray-400">Loading...</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
                      <div className="h-64 w-full bg-gray-800"></div>
                      <div className="p-4">
                        <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <ResultsCount query={query} showFavorites={showFavorites} />
            <CharacterList query={query} showFavorites={showFavorites} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}

