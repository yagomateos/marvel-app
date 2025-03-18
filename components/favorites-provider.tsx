"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type FavoritesContextType = {
  favorites: string[]
  toggleFavorite: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
})

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("marvelFavorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error)
    }
    setIsLoaded(true)
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("marvelFavorites", JSON.stringify(favorites))
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error)
      }
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favId) => favId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  return <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => useContext(FavoritesContext)

