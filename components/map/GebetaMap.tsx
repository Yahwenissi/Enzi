"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Map, NavigationControl } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

export interface GebetaMapProps {
  accessToken: string
  center?: [number, number]
  zoom?: number
  onMapReady?: (map: Map) => void
}

const DEFAULT_CENTER: [number, number] = [38.7685, 9.0161]
const DEFAULT_ZOOM = 12

export function GebetaMap({
  accessToken,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onMapReady,
}: GebetaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  const handleMapReady = useCallback(
    (map: Map) => {
      onMapReady?.(map)
    },
    [onMapReady]
  )

  useEffect(() => {
    if (!accessToken || !containerRef.current) {
      return
    }

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center,
      zoom,
      attributionControl: false,
    })

    map.addControl(new NavigationControl(), "top-right")
    mapRef.current = map

    map.on("error", (e) => {
      const errMsg = e.error?.message ?? e.message
      if (errMsg) {
        console.error("[GebetaMap] MapLibre error:", errMsg)
        setMapError(`Map error: ${errMsg}`)
      }
    })

    map.on("load", () => {
      handleMapReady(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // center/zoom are applied imperatively below so that parent re-renders
    // with new array identities do not tear down and rebuild the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, handleMapReady])

  useEffect(() => {
    mapRef.current?.flyTo({ center, zoom })
  }, [center, zoom])

  if (!accessToken) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center rounded-xl border-2 border-dashed border-orange/50 bg-clay/50">
        <p className="font-body text-sm text-charcoal/60">
          Map unavailable — <code className="font-display text-orange">NEXT_PUBLIC_GEBETA_ACCESS_TOKEN</code> not set
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative h-full min-h-[500px] w-full bg-subtle">
      {mapError && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-orange bg-clay">
          <div className="px-6 text-center">
            <p className="font-display font-semibold text-charcoal">Map Unavailable</p>
            <p className="font-body text-sm text-charcoal/60">{mapError}</p>
          </div>
        </div>
      )}
    </div>
  )
}