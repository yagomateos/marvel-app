export interface Character {
  id: number | string
  name: string
  description: string
  thumbnail: {
    path: string
    extension: string
  }
  comics: {
    available: number
    items: {
      name: string
      resourceURI: string
    }[]
  }
  source: "marvel" | "dragonball" | "mock"
}

export interface Comic {
  id: number | string
  title: string
  description: string
  thumbnail: {
    path: string
    extension: string
  }
  dates: {
    type: string
    date: string
  }[]
  ki?: number // For Dragon Ball transformations
  source: "marvel" | "dragonball" | "mock"
}

export interface ApiResponse<T> {
  data: T | null
  success: boolean
  error?: string
  source: "marvel" | "dragonball" | "mock"
}

