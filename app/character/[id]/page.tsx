import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import CharacterDetail from "@/components/character-detail";
import ComicsList from "@/components/comics-list";
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
            <CharacterDetail id={characterId} />
          </Suspense>
        </ErrorBoundary>

        <h2 className="text-2xl font-bold mt-8 mb-4">
          <span className="sr-only">Character appears in</span>
          <span aria-hidden="true">Comics</span>
        </h2>

        <ErrorBoundary
          fallback={
            <ErrorFallback message="Failed to load comics. Please try again later." />
          }
        >
          <Suspense
            fallback={
              <div className="mt-4 text-center" aria-live="polite">
                Loading comics...
              </div>
            }
          >
            <ComicsList characterId={characterId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}
