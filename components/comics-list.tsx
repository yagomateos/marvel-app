import Image from "next/image"
import { getCharacterComics, getCharacterById } from "@/lib/api-client"
import { EmptyState } from "./empty-state"

export default async function ComicsList({ characterId }: { characterId: string }) {
  try {
    const comics = await getCharacterComics(characterId)
    const character = await getCharacterById(characterId)

    if (!character) {
      return <EmptyState title="Character not found" description="We couldn't find this character in our database." />
    }

    if (comics.length === 0) {
      return (
        <EmptyState
          title={`No ${character?.source === "marvel" ? "comics" : "transformations"} found`}
          description={`This character doesn't have any ${character?.source === "marvel" ? "comics" : "transformations"} available.`}
        />
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {comics.map((comic) => (
          <div key={comic.id} className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback for image errors
                  ;(e.target as HTMLImageElement).src = "/placeholder-comic.jpg"
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold line-clamp-2">{comic.title}</h3>
              {comic.source === "marvel" && comic.dates && comic.dates.length > 0 && (
                <p className="text-gray-400 text-sm mt-2">{new Date(comic.dates[0].date).toLocaleDateString()}</p>
              )}
              {comic.source === "dragonball" && comic.ki && (
                <p className="text-gray-400 text-sm mt-2">KI: {comic.ki}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error in ComicsList:", error)
    return (
      <EmptyState
        title="Error loading comics"
        description="There was a problem loading the comics for this character."
      />
    )
  }
}

