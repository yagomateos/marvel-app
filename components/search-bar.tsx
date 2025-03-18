"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      const params = new URLSearchParams(searchParams)

      if (query) {
        params.set("query", query)
      } else {
        params.delete("query")
      }

      // Preserve favorites filter if it exists
      if (params.has("favorites")) {
        params.set("favorites", "true")
      }

      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mt-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Marvel characters..."
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Search characters"
        />
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          aria-label="Search"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  )
}

