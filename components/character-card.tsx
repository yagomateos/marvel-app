"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "./favorites-provider"
import type { Character } from "@/lib/types"
import { useState } from "react"

export default function CharacterCard({
  character,
  isFavorite,
}: {
  character: Character
  isFavorite: boolean
}) {
  const { toggleFavorite } = useFavorites()
  const [imageError, setImageError] = useState(false)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(character.id.toString())
  }

  // Update the image handling to better support mock data and fallbacks

  // Handle different image path formats
  let imageUrl = "/placeholder-character.jpg"

  if (!imageError) {
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
  }

  return (
    <Link
      href={`/character/${character.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
    >
      <div
        className="bg-gray-900 rounded-lg overflow-hidden transition-transform hover:scale-105 focus-within:ring-2 focus-within:ring-red-500"
        tabIndex={-1}
      >
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={character.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            priority={false}
          />
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-red-500"
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
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{character.name}</h3>
        </div>
      </div>
    </Link>
  )
}

