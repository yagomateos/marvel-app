import type { Character, Comic } from "./types"
import md5 from "crypto-js/md5"

// Marvel API credentials
const API_BASE_URL = "https://gateway.marvel.com/v1/public"
const PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY || ""
const PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY || ""

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000

// Generate auth parameters for Marvel API
function getAuthParams() {
  const ts = new Date().getTime().toString()
  const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY).toString()
  return `ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`
}

// Cache for API responses
let charactersCache: {
  data: Character[] | null
  timestamp: number
  query: string
} = {
  data: null,
  timestamp: 0,
  query: "",
}

const characterCache: {
  [id: string]: {
    data: Character | null
    timestamp: number
  }
} = {}

const comicsCache: {
  [characterId: string]: {
    data: Comic[] | null
    timestamp: number
  }
} = {}

// Get characters from Marvel API
export async function getCharacters(nameStartsWith = ""): Promise<Character[]> {
  // Check if we have a valid cache
  const now = Date.now()
  if (
    charactersCache.data &&
    charactersCache.query === nameStartsWith &&
    now - charactersCache.timestamp < CACHE_DURATION
  ) {
    return charactersCache.data
  }

  // Build query parameters
  let params = `limit=50&${getAuthParams()}`
  if (nameStartsWith) {
    params += `&nameStartsWith=${encodeURIComponent(nameStartsWith)}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}/characters?${params}`)

    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status}`)
    }

    const data = await response.json()
    const characters = data.data.results

    // Update cache
    charactersCache = {
      data: characters,
      timestamp: now,
      query: nameStartsWith,
    }

    return characters
  } catch (error) {
    console.error("Error fetching characters:", error)
    return []
  }
}

// Get a single character by ID
export async function getCharacterById(id: string): Promise<Character | null> {
  // Check if we have a valid cache
  const now = Date.now()
  if (characterCache[id]?.data && now - characterCache[id].timestamp < CACHE_DURATION) {
    return characterCache[id].data
  }

  try {
    const response = await fetch(`${API_BASE_URL}/characters/${id}?${getAuthParams()}`)

    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status}`)
    }

    const data = await response.json()
    const character = data.data.results[0] || null

    // Update cache
    characterCache[id] = {
      data: character,
      timestamp: now,
    }

    return character
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error)
    return null
  }
}

// Get comics for a character
export async function getCharacterComics(characterId: string): Promise<Comic[]> {
  // Check if we have a valid cache
  const now = Date.now()
  if (comicsCache[characterId]?.data && now - comicsCache[characterId].timestamp < CACHE_DURATION) {
    return comicsCache[characterId].data
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/characters/${characterId}/comics?orderBy=onsaleDate&limit=20&${getAuthParams()}`,
    )

    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status}`)
    }

    const data = await response.json()
    const comics = data.data.results

    // Update cache
    comicsCache[characterId] = {
      data: comics,
      timestamp: now,
    }

    return comics
  } catch (error) {
    console.error(`Error fetching comics for character ${characterId}:`, error)
    return []
  }
}

