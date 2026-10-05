import { Suspense } from "react";
import { MapExplorer } from "@/components/map/MapExplorer";
import type { SpotCategory } from "@/components/map/MapExplorer";

const validCategories: SpotCategory[] = [
  "parks",
  "museums",
  "game-zones",
  "galleries",
  "hidden-gems",
];

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory = validCategories.includes(category as SpotCategory)
    ? (category as SpotCategory)
    : null;

  return (
    <Suspense fallback={null}>
      <MapExplorer initialCategory={initialCategory} />
    </Suspense>
  );
}