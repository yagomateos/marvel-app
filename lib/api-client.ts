import type { Character, Comic, ApiResponse } from "./types"
import md5 from "crypto-js/md5"

// Import mock data
import { mockCharacters, mockComics } from "./mock-data"

// API configuration
const MARVEL_API_BASE_URL = "https://gateway.marvel.com/v1/public"
const DRAGONBALL_API_BASE_URL = "https://www.dragonball-api.com/api"

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000

// Cache for API responses
let charactersCache: {
  data: Character[] | null
  timestamp: number
  query: string
  source: "marvel" | "dragonball"
} = {
  data: null,
  timestamp: 0,
  query: "",
  source: "marvel",
}

const characterCache: {
  [id: string]: {
    data: Character | null
    timestamp: number
    source: "marvel" | "dragonball"
  }
} = {}

const comicsCache: {
  [characterId: string]: {
    data: Comic[] | null
    timestamp: number
    source: "marvel" | "dragonball"
  }
} = {}

// Generate auth parameters for Marvel API
function getMarvelAuthParams() {
  const ts = new Date().getTime().toString()
  const publicKey = process.env.MARVEL_PUBLIC_KEY || ""
  const privateKey = process.env.MARVEL_PRIVATE_KEY || ""

  // Check if keys are available
  if (!publicKey || !privateKey) {
    console.warn("Marvel API keys are missing. Will use fallback API.")
    return ""
  }

  const hash = md5(ts + privateKey + publicKey).toString()
  return `ts=${ts}&apikey=${publicKey}&hash=${hash}`
}

// Get Dragon Ball API auth token
async function getDragonBallAuthToken() {
  // This would be implemented with your Dragon Ball API credentials
  // For now, we'll return a placeholder
  return process.env.DRAGONBALL_API_TOKEN || ""
}

// Fetch characters from Marvel API
async function fetchMarvelCharacters(nameStartsWith = ""): Promise<ApiResponse<Character[]>> {
  // Check if API keys are available
  const publicKey = process.env.MARVEL_PUBLIC_KEY
  const privateKey = process.env.MARVEL_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    console.warn("Marvel API keys are missing. Skipping Marvel API request.")
    return {
      data: null,
      success: false,
      error: "Marvel API keys are not configured",
      source: "marvel" as const,
    }
  }

  try {
    // Build query parameters
    const authParams = getMarvelAuthParams()
    if (!authParams) {
      throw new Error("Failed to generate authentication parameters")
    }

    let params = `limit=50&${authParams}`
    if (nameStartsWith) {
      params += `&nameStartsWith=${encodeURIComponent(nameStartsWith)}`
    }

    console.log(
      `Fetching from Marvel API: ${MARVEL_API_BASE_URL}/characters?${params.replace(/hash=\w+/, "hash=REDACTED")}`,
    )

    const response = await fetch(`${MARVEL_API_BASE_URL}/characters?${params}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour on the server
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Marvel API error: ${response.status}`, errorText)
      throw new Error(`Marvel API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform Marvel API response to our app's format
    const characters = data.data.results.map((char: any) => ({
      id: char.id,
      name: char.name,
      description: char.description,
      thumbnail: {
        path: char.thumbnail.path,
        extension: char.thumbnail.extension,
      },
      comics: {
        available: char.comics.available,
        items: char.comics.items,
      },
      source: "marvel" as const,
    }))

    return {
      data: characters,
      success: true,
      source: "marvel" as const,
    }
  } catch (error) {
    console.error("Error fetching Marvel characters:", error)
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      source: "marvel" as const,
    }
  }
}

// Fetch characters from Dragon Ball API
async function fetchDragonBallCharacters(name = ""): Promise<ApiResponse<Character[]>> {
  try {
    const token = await getDragonBallAuthToken()

    // Check if token exists
    if (!token) {
      console.warn("Dragon Ball API token is missing")
      return {
        data: null,
        success: false,
        error: "Dragon Ball API token is not configured",
        source: "dragonball" as const,
      }
    }

    let url = `${DRAGONBALL_API_BASE_URL}/characters?limit=50`

    if (name) {
      url += `&name=${encodeURIComponent(name)}`
    }

    console.log(`Attempting to fetch from Dragon Ball API: ${url}`)

    // Add timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
        next: { revalidate: 3600 }, // Cache for 1 hour on the server
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Could not read error response")
        console.error(`Dragon Ball API error: ${response.status}`, errorText)
        throw new Error(`Dragon Ball API error: ${response.status}`)
      }

      const data = await response.json()

      // Transform Dragon Ball API response to our app's format
      const characters = data.items.map((char: any) => ({
        id: char.id,
        name: char.name,
        description: char.description || "",
        thumbnail: {
          // Dragon Ball API might have a different structure, adjust as needed
          path: char.image || "/placeholder-character",
          extension: "jpg",
        },
        // Map transformations to comics for consistency
        comics: {
          available: char.transformations?.length || 0,
          items: (char.transformations || []).map((t: any) => ({
            name: t.name,
            resourceURI: `/transformations/${t.id}`,
          })),
        },
        source: "dragonball" as const,
      }))

      return {
        data: characters,
        success: true,
        source: "dragonball" as const,
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    console.error("Error fetching Dragon Ball characters:", error)
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      source: "dragonball" as const,
    }
  }
}

// Get characters with fallback mechanism
export async function getCharacters(nameStartsWith = ""): Promise<Character[]> {
  // Check if we have a valid cache
  const now = Date.now()
  if (
    charactersCache.data &&
    charactersCache.query === nameStartsWith &&
    now - charactersCache.timestamp < CACHE_DURATION
  ) {
    console.log("Returning cached characters data")
    return charactersCache.data
  }

  console.log("Cache miss or expired, fetching fresh data")

  let marvelSuccess = false
  let dragonBallSuccess = false
  let marvelData: Character[] | null = null
  let dragonBallData: Character[] | null = null

  // Try Marvel API if keys are available
  const hasMarvelKeys = !!(process.env.MARVEL_PUBLIC_KEY && process.env.MARVEL_PRIVATE_KEY)
  if (hasMarvelKeys) {
    console.log("Attempting to fetch from Marvel API")
    const marvelResponse = await fetchMarvelCharacters(nameStartsWith)
    marvelSuccess = marvelResponse.success && !!marvelResponse.data && marvelResponse.data.length > 0
    if (marvelSuccess) {
      marvelData = marvelResponse.data
      console.log(`Marvel API returned ${marvelData.length} characters`)
    } else {
      console.log("Marvel API failed or returned no data")
    }
  } else {
    console.log("Marvel API keys not available")
  }

  // Try Dragon Ball API if Marvel failed or keys aren't available
  if (!marvelSuccess) {
    console.log("Attempting to fetch from Dragon Ball API")
    const dragonBallResponse = await fetchDragonBallCharacters(nameStartsWith)
    dragonBallSuccess = dragonBallResponse.success && !!dragonBallResponse.data
    if (dragonBallSuccess) {
      dragonBallData = dragonBallResponse.data
      console.log(`Dragon Ball API returned ${dragonBallData.length} characters`)
    } else {
      console.log("Dragon Ball API failed or returned no data")
    }
  }

  // Return data based on which API succeeded
  if (marvelSuccess && marvelData) {
    // Update cache with Marvel data
    charactersCache = {
      data: marvelData,
      timestamp: now,
      query: nameStartsWith,
      source: "marvel",
    }
    return marvelData
  }

  if (dragonBallSuccess && dragonBallData) {
    // Update cache with Dragon Ball data
    charactersCache = {
      data: dragonBallData,
      timestamp: now,
      query: nameStartsWith,
      source: "dragonball",
    }
    return dragonBallData
  }

  // If both APIs fail, use mock data
  console.log("Both APIs failed, using mock data")
  const filteredMockData = nameStartsWith
    ? mockCharacters.filter((char) => char.name.toLowerCase().includes(nameStartsWith.toLowerCase()))
    : mockCharacters

  // Update cache with mock data
  charactersCache = {
    data: filteredMockData,
    timestamp: now,
    query: nameStartsWith,
    source: "mock" as any,
  }

  return filteredMockData
}

// Get a single character by ID with fallback mechanism
export async function getCharacterById(id: string): Promise<Character | null> {
  // Check if we have a valid cache
  const now = Date.now()
  if (characterCache[id]?.data && now - characterCache[id].timestamp < CACHE_DURATION) {
    return characterCache[id].data
  }

  try {
    // Try Marvel API first
    const marvelResponse = await fetch(`${MARVEL_API_BASE_URL}/characters/${id}?${getMarvelAuthParams()}`, {
      next: { revalidate: 3600 },
    })

    if (marvelResponse.ok) {
      const data = await marvelResponse.json()
      const character = data.data.results[0] || null

      if (character) {
        const formattedCharacter = {
          id: character.id,
          name: character.name,
          description: character.description,
          thumbnail: {
            path: character.thumbnail.path,
            extension: character.thumbnail.extension,
          },
          comics: {
            available: character.comics.available,
            items: character.comics.items,
          },
          source: "marvel" as const,
        }

        // Update cache
        characterCache[id] = {
          data: formattedCharacter,
          timestamp: now,
          source: "marvel",
        }

        return formattedCharacter
      }
    }

    // If Marvel API fails, try Dragon Ball API
    const token = await getDragonBallAuthToken()
    const dragonBallResponse = await fetch(`${DRAGONBALL_API_BASE_URL}/characters/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    })

    if (dragonBallResponse.ok) {
      const character = await dragonBallResponse.json()

      const formattedCharacter = {
        id: character.id,
        name: character.name,
        description: character.description || "",
        thumbnail: {
          path: character.image || "/placeholder-character",
          extension: "jpg",
        },
        comics: {
          available: character.transformations?.length || 0,
          items: (character.transformations || []).map((t: any) => ({
            name: t.name,
            resourceURI: `/transformations/${t.id}`,
          })),
        },
        source: "dragonball" as const,
      }

      // Update cache
      characterCache[id] = {
        data: formattedCharacter,
        timestamp: now,
        source: "dragonball",
      }

      return formattedCharacter
    }

    // If both APIs fail, check mock data
    const mockCharacter = mockCharacters.find((char) => char.id.toString() === id)
    if (mockCharacter) {
      // Update cache with mock data
      characterCache[id] = {
        data: mockCharacter,
        timestamp: now,
        source: "mock" as any,
      }

      return mockCharacter
    }

    // If character not found in any source, return null
    return null
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error)

    // Check mock data as a fallback
    const mockCharacter = mockCharacters.find((char) => char.id.toString() === id)
    if (mockCharacter) {
      // Update cache with mock data
      characterCache[id] = {
        data: mockCharacter,
        timestamp: now,
        source: "mock" as any,
      }

      return mockCharacter
    }

    return null
  }
}

// Get comics or transformations for a character with fallback mechanism
export async function getCharacterComics(characterId: string): Promise<Comic[]> {
  // Check if we have a valid cache
  const now = Date.now()
  if (comicsCache[characterId]?.data && now - comicsCache[characterId].timestamp < CACHE_DURATION) {
    return comicsCache[characterId].data
  }

  // Check if we know the source of this character from cache
  const characterSource = characterCache[characterId]?.source || "marvel"

  try {
    if (characterSource === "marvel") {
      // Fetch comics from Marvel API
      const response = await fetch(
        `${MARVEL_API_BASE_URL}/characters/${characterId}/comics?orderBy=onsaleDate&limit=20&${getMarvelAuthParams()}`,
        { next: { revalidate: 3600 } },
      )

      if (response.ok) {
        const data = await response.json()
        const comics = data.data.results.map((comic: any) => ({
          id: comic.id,
          title: comic.title,
          description: comic.description || "",
          thumbnail: {
            path: comic.thumbnail.path,
            extension: comic.thumbnail.extension,
          },
          dates: comic.dates || [],
          source: "marvel" as const,
        }))

        // Update cache
        comicsCache[characterId] = {
          data: comics,
          timestamp: now,
          source: "marvel",
        }

        return comics
      }
    } else if (characterSource === "dragonball") {
      // Fetch transformations from Dragon Ball API
      const token = await getDragonBallAuthToken()
      const response = await fetch(`${DRAGONBALL_API_BASE_URL}/characters/${characterId}/transformations?sort=ki`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 3600 },
      })

      if (response.ok) {
        const data = await response.json()
        const transformations = data.items.map((transform: any) => ({
          id: transform.id,
          title: transform.name,
          description: transform.description || "",
          thumbnail: {
            path: transform.image || "/placeholder-transformation",
            extension: "jpg",
          },
          dates: [{ type: "ki", date: new Date().toISOString() }],
          ki: transform.ki,
          source: "dragonball" as const,
        }))

        // Update cache
        comicsCache[characterId] = {
          data: transformations,
          timestamp: now,
          source: "dragonball",
        }

        return transformations
      }
    } else if (characterSource === "mock") {
      // Return mock comics for mock characters
      const filteredMockComics = mockComics.filter((_, index) => index < 2)

      // Update cache
      comicsCache[characterId] = {
        data: filteredMockComics,
        timestamp: now,
        source: "mock" as any,
      }

      return filteredMockComics
    }

    // If API fails or source is unknown, return mock comics as fallback
    const filteredMockComics = mockComics.filter((_, index) => index < 2)

    // Update cache
    comicsCache[characterId] = {
      data: filteredMockComics,
      timestamp: now,
      source: "mock" as any,
    }

    return filteredMockComics
  } catch (error) {
    console.error(`Error fetching comics for character ${characterId}:`, error)

    // Return mock comics as fallback
    const filteredMockComics = mockComics.filter((_, index) => index < 2)

    // Update cache
    comicsCache[characterId] = {
      data: filteredMockComics,
      timestamp: now,
      source: "mock" as any,
    }

    return filteredMockComics
  }
}

