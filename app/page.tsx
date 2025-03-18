import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { getCharacters } from "@/lib/dragonball-api";
import Link from "next/link";
import Image from "next/image";
import { ErrorBoundary, ErrorFallback } from "@/components/error-boundary";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { query?: string; favorites?: string }
}) {
  // Corregir el uso de searchParams con el operador opcional
  const query = searchParams?.query || "";
  const showFavorites = searchParams?.favorites === "true";

  const data = await getCharacters();
  
  // Filtrar personajes si hay una consulta
  const filteredCharacters = query 
    ? data.items.filter(character => 
        character.name.toLowerCase().includes(query.toLowerCase())
      )
    : data.items;
  
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dragon Ball Characters</h1>
        
        <ErrorBoundary
          fallback={
            <ErrorFallback message="Failed to load characters. Please try again later." />
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <Link 
                href={`/character/${character.id}`} 
                key={character.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{character.name}</h2>
                  <p className="text-gray-400">{character.race}</p>
                </div>
              </Link>
            ))}
          </div>
        </ErrorBoundary>
      </div>
    </main>
  );
}