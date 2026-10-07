"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { GebetaMap } from "@/components/map/GebetaMap"
import {
  CATEGORIES,
  CATEGORY_LABELS,
  SPOTS,
  type Spot,
  type SpotCategory,
} from "@/lib/spots"

export { type SpotCategory }
export type { Spot } from "@/lib/spots"

interface DirectionStep {
  instruction: string
  distance: number
  duration: number
}

interface Directions {
  origin: [number, number]
  destination: [number, number]
  steps: DirectionStep[]
  totalDistance: number
  totalDuration: number
}

const ADDIS_CENTER: [number, number] = [38.7685, 9.0161]

function estimateDirections(
  origin: [number, number],
  spot: Spot
): Directions | null {
  const destination: [number, number] = [spot.longitude, spot.latitude]
  const distance =
    Math.sqrt(
      Math.pow(destination[0] - origin[0], 2) +
        Math.pow(destination[1] - origin[1], 2)
    ) * 111
  const duration = distance * 2

  return {
    origin,
    destination,
    steps: [
      {
        instruction: `Head toward ${spot.name}`,
        distance: distance * 1000,
        duration: duration * 60,
      },
      { instruction: `Arrive at ${spot.name}`, distance: 0, duration: 0 },
    ],
    totalDistance: distance * 1000,
    totalDuration: duration * 60,
  }
}

export function MapExplorer({
  initialCategory = null,
}: {
  initialCategory?: SpotCategory | null;
}) {
  const [center, setCenter] = useState<[number, number]>(ADDIS_CENTER)
  const [zoom, setZoom] = useState(12)
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<SpotCategory | null>(
    initialCategory
  )

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (query.length < 3) {
      return []
    }
    return SPOTS.filter(
      (spot) =>
        spot.name.toLowerCase().includes(query) ||
        spot.address.toLowerCase().includes(query) ||
        spot.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const visibleSpots = useMemo(
    () =>
      activeCategory
        ? SPOTS.filter((spot) => spot.category === activeCategory)
        : SPOTS,
    [activeCategory]
  )

  const directions = useMemo(
    () => (selectedSpot ? estimateDirections(center, selectedSpot) : null),
    [center, selectedSpot]
  )

  const showSearchResults = searchResults.length > 0

  const resetToAddis = () => {
    setCenter(ADDIS_CENTER)
    setZoom(12)
    setSelectedSpot(null)
  }

  const enableMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.longitude, pos.coords.latitude])
        setZoom(15)
      },
      (err) => console.error("Geolocation error:", err.message)
    )
  }

  const selectCategory = (category: SpotCategory) => {
    setActiveCategory((current) => (current === category ? null : category))
    setSearchQuery("")
  }

  const imageUrl = selectedSpot?.images?.[0]?.url

  return (
    <div className="flex min-h-screen flex-col bg-clay">
      <header className="relative z-10 flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-8 w-8 text-orange" />
          <span className="font-display text-xl font-extrabold text-charcoal">
            Enzi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="relative inline-flex items-center gap-1.5 rounded-btn border-2 border-charcoal/20 bg-clay/80 px-4 py-1.5 text-sm transition-colors hover:bg-orange/10 hover:text-orange"
          >
            Home
          </Link>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="relative inline-flex items-center gap-1.5 rounded-btn border-2 border-orange bg-orange/10 px-4 py-1.5 text-sm text-orange transition-colors hover:bg-orange/20"
            >
              {CATEGORY_LABELS[activeCategory]} ✕
            </button>
          )}
          <button
            type="button"
            onClick={resetToAddis}
            className="relative inline-flex items-center gap-1.5 rounded-btn border-2 border-charcoal/20 bg-clay/80 px-4 py-1.5 text-sm transition-colors hover:bg-orange/10 hover:text-orange"
          >
            Addis
          </button>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col md:flex-row">
        <div className="relative h-[500px] w-full md:h-auto md:flex-1">
          <GebetaMap
            spots={visibleSpots}
            center={center}
            zoom={zoom}
            selectedSpotId={selectedSpot?.id ?? null}
            onSpotSelect={setSelectedSpot}
          />

          {showSearchResults && (
            <div className="absolute left-6 right-4 top-6 z-20 max-h-80 max-w-sm overflow-y-auto rounded-xl border border-charcoal/10 bg-white shadow-xl">
              {searchResults.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => {
                    setSelectedSpot(spot)
                    setSearchQuery("")
                    setCenter([spot.longitude, spot.latitude])
                  }}
                  className="block w-full cursor-pointer p-3 text-left transition-colors hover:bg-clay/50"
                >
                  <span className="font-display line-clamp-1 font-medium text-charcoal">
                    {spot.name}
                  </span>
                  <span className="line-clamp-1 text-sm text-orange">
                    {CATEGORY_LABELS[spot.category]}
                  </span>
                  <span className="line-clamp-1 text-xs text-charcoal/60">
                    {spot.address}
                  </span>
                </button>
              ))}
            </div>
          )}

          {directions && selectedSpot && (
            <div className="absolute left-6 top-8 z-20 max-w-xs rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
              <h4 className="font-display mb-2 text-sm font-bold text-orange">
                Route
              </h4>
              <p className="line-clamp-5 text-xs text-charcoal/60">
                {directions.steps
                  .slice(0, 5)
                  .map(
                    (step, i) =>
                      `${i + 1}. ${step.instruction} (${(step.distance / 1000).toFixed(1)}km, ${Math.round(step.duration / 60)}min)`
                  )
                  .join("\n")}
              </p>
              <p className="mt-2 font-medium text-orange">
                Total: {(directions.totalDistance / 1000).toFixed(1)}km •{" "}
                {Math.round(directions.totalDuration / 60)}min
              </p>
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="mt-2 text-xs text-charcoal/50 underline transition-colors hover:text-orange"
              >
                Clear route
              </button>
            </div>
          )}

          {selectedSpot && (
            <div className="absolute bottom-6 left-1/2 z-20 w-full max-w-md -translate-x-1/2 rounded-xl border border-charcoal/10 bg-white p-6 shadow-xl">
              <div className="mb-3 flex items-start gap-3">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={selectedSpot.name}
                    width={120}
                    height={80}
                    className="h-20 w-30 shrink-0 rounded object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    aria-hidden
                    className="h-20 w-30 shrink-0 rounded bg-subtle"
                  />
                )}
                <div>
                  <h3 className="font-display font-extrabold text-charcoal">
                    {selectedSpot.name}
                  </h3>
                  <p className="text-sm text-charcoal/60">{selectedSpot.address}</p>
                  <p className="mt-1 text-sm text-orange">
                    {CATEGORY_LABELS[selectedSpot.category]}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-charcoal/80">
                    <Star className="h-3 w-3 text-orange/60" />
                    <span>
                      {selectedSpot.rating.toFixed(1)} ({selectedSpot.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
              <p className="mb-3 text-sm text-charcoal/70">
                {selectedSpot.description}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/spots/${selectedSpot.id}`}
                  className="flex-1 rounded-btn border-2 border-orange/40 py-2 text-center font-display font-bold text-orange transition-colors hover:bg-orange/10"
                >
                  View details
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedSpot(null)}
                  className="flex-1 rounded-btn bg-orange py-2 font-display font-bold text-white shadow-[0_4px_0_0_rgba(169,67,45,0.9)] transition-all hover:shadow-[0_6px_0_0_rgba(169,67,45,0.9)]"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.key
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => selectCategory(cat.key)}
                  className={`relative inline-flex items-center gap-1.5 rounded-btn border-2 px-4 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-orange bg-orange/10 text-orange"
                      : "border-charcoal/20 bg-clay/80 hover:bg-orange/10 hover:text-orange"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        <aside className="w-full shrink-0 overflow-y-auto border-l border-charcoal/10 bg-white p-6 md:w-64">
          <h2 className="font-display mb-4 text-lg font-extrabold text-charcoal">
            Nearby Spots
          </h2>

          <div className="relative mb-4">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange/40" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spots..."
              aria-label="Search spots"
              className="w-full rounded-md border border-charcoal/20 bg-clay/80 py-2.5 pl-8 pr-4 text-charcoal focus:border-orange focus:outline-none"
            />
          </div>

          <div className="mb-4 space-y-2">
            {visibleSpots.slice(0, 8).map((spot) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => {
                  setSelectedSpot(spot)
                  setCenter([spot.longitude, spot.latitude])
                }}
                className="w-full rounded-btn border border-charcoal/20 bg-clay/80 py-2.5 text-left transition-colors hover:bg-orange/10 hover:text-orange"
              >
                <span className="font-display line-clamp-1 text-sm font-semibold">
                  {spot.name}
                </span>
                <span className="line-clamp-1 text-xs text-charcoal/60">
                  {spot.address}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-charcoal/10 pt-6">
            <h3 className="font-display mb-3 text-sm font-bold text-charcoal/60">
              Quick Actions
            </h3>
            <button
              type="button"
              onClick={enableMyLocation}
              className="w-full rounded-btn bg-orange py-2.5 font-display font-bold text-white shadow-[0_4px_0_0_rgba(169,67,45,0.9)] transition-all hover:shadow-[0_6px_0_0_rgba(169,67,45,0.9)]"
            >
              Enable My Location
            </button>
          </div>
        </aside>
      </main>
    </div>
  )
}
