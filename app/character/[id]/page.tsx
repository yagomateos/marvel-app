import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import DragonBallCharacterDetail from "@/components/dragonball-character-detail";
import { ErrorBoundary, ErrorFallback } from "@/components/error-boundary";
import { notFound } from "next/navigation";

export default async function CharacterPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  const characterId = decodeURIComponent(params.id);

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
            <DragonBallCharacterDetail id={characterId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}