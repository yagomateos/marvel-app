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

    if (character.thumbnail) {
      if (character.source === "mock") {
        imageUrl = character.thumbnail.path?.startsWith("/")
          ? `${character.thumbnail.path}.${character.thumbnail.extension}`
          : `/placeholder-character.jpg`
      } else if (character.thumbnail.path?.startsWith("http")) {
        imageUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`
      } else if (character.thumbnail.path?.includes("not_available")) {
        imageUrl = "/placeholder-character.jpg"
      } else if (character.thumbnail.path) {
        imageUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`
      }
    }

    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Contenedor principal */}
        <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Contenido del personaje */}
          <div className="flex flex-col md:flex-row">
            {/* Columna de la imagen */}
            <div className="w-full md:w-1/2 bg-gray-900 p-4 flex items-center justify-center">
              <div className="relative w-full h-[400px] flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={character.name || "Character"}
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-character.jpg"
                  }}
                />
              </div>
            </div>
            
            {/* Columna de la información */}
            <div className="w-full md:w-1/2 p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-white">{character.name}</h1>
                <FavoriteButton characterId={id} />
              </div>
              
              {/* Detalles del personaje */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {character.race && (
                  <div>
                    <h3 className="text-sm text-gray-400">Race</h3>
                    <p className="text-white font-medium">{character.race}</p>
                  </div>
                )}
                
                {character.gender && (
                  <div>
                    <h3 className="text-sm text-gray-400">Gender</h3>
                    <p className="text-white font-medium">{character.gender}</p>
                  </div>
                )}
                
                {character.ki && (
                  <div>
                    <h3 className="text-sm text-gray-400">KI</h3>
                    <p className="text-white font-medium">{character.ki}</p>
                  </div>
                )}
                
                {character.affiliation && (
                  <div>
                    <h3 className="text-sm text-gray-400">Affiliation</h3>
                    <p className="text-white font-medium">{character.affiliation}</p>
                  </div>
                )}
              </div>
              
              {/* Descripción */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-400 mb-2">Description</h3>
                <div className="text-gray-300 max-h-[200px] overflow-y-auto">
                  {character.description || "No description available for this character."}
                </div>
              </div>
              
              {/* Comics/Transformaciones */}
              {character.comics && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {character.source === "marvel" ? "Comics" : "Transformations"}
                  </h2>
                  <p className="text-gray-400">
                    {character.comics.available || 0} {character.source === "marvel" ? "comics" : "transformations"} available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in CharacterDetail:", error)
    notFound()
  }
}