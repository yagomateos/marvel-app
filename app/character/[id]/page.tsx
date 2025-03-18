import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import DragonBallCharacterDetail from "@/components/dragonball-character-detail";
import { ErrorBoundary, ErrorFallback } from "@/components/error-boundary";

// Eliminar completamente la dependencia de params.id en este componente
export default function CharacterPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <ErrorBoundary
          fallback={
            <ErrorFallback message="Failed to load character details. Please try again later." />
          }
        >
          <Suspense
            fallback={
              <div className="mt-8 text-center" aria-live="polite">
                Loading character details...
              </div>
            }
          >
            {/* Pasar params directamente al componente hijo */}
            <CharacterDetailWrapper params={params} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}

// Componente intermedio para manejar la extracción del ID
async function CharacterDetailWrapper({ params }: { params: { id: string } }) {
  // Aquí podemos usar await porque este es un componente separado
  const resolvedParams = await Promise.resolve(params);
  const characterId = resolvedParams.id;
  
  return <DragonBallCharacterDetail id={characterId} />;
}