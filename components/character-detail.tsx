import Image from "next/image"
import { getCharacterById } from "@/lib/api-client"
import { FavoriteButton } from "./favorite-button"
import { notFound } from "next/navigation"

export default async function CharacterDetail({ id }: { id: string }) {
  try {
    const character = await getCharacterById(id)

    if (!character) {
      notFound()
    }

    // Handle different image path formats
    let imageUrl = "/placeholder-character.jpg"

    if (character.source === "mock") {
      // For mock data, use local images
      imageUrl = character.thumbnail.path.startsWith("/")
        ? `${character.thumbnail.path}.${character.thumbnail.extension}`
        : `/placeholder-character.jpg`
    } else if (character.thumbnail.path.startsWith("http")) {
      // For URLs that already include http/https
      imageUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`
    } else if (character.thumbnail.path.includes("not_available")) {
      // Handle Marvel's image not available
      imageUrl = "/placeholder-character.jpg"
    } else {
      // For relative paths
      imageUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={character.name}
            width={350}
            height={450}
            className="object-contain max-h-[450px]"
            priority
            onError={(e) => {
              // Fallback for image errors
              ;(e.target as HTMLImageElement).src = "/placeholder-character.jpg"
            }}
          />
        </div>
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-4">{character.name}</h1>
            <FavoriteButton characterId={id} />
          </div>
          <p className="text-gray-300 mb-6">
            {character.description || "No description available for this character."}
          </p>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
              {character.source === "marvel" ? "Comics" : "Transformations"}
            </h2>
            <p className="text-gray-400">
              {character.comics.available} {character.source === "marvel" ? "comics" : "transformations"} available
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in CharacterDetail:", error)
    notFound()
  }
}