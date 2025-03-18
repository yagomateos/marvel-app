const API_URL = process.env.NEXT_PUBLIC_DRAGONBALL_API_URL || 'https://dragonball-api.com/api';

export async function getCharacters() {
  try {
    const response = await fetch(`${API_URL}/characters`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
}

export async function getCharacter(id: string) {
  try {
    const response = await fetch(`${API_URL}/characters/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
}