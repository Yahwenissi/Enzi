"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type {
  CircleLayerSpecification,
  ErrorEvent as MapLibreErrorEvent,
  StyleSpecification,
  ExpressionSpecification,
  GeoJSONSource,
  MapLayerMouseEvent,
  Map as MapLibreMap,
} from "maplibre-gl"
import {
  GPUInitializationError,
  Map,
  NavigationControl,
  getVersion,
  setWorkerUrl,
} from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { CATEGORY_HEX, type Spot } from "@/lib/spots"

setWorkerUrl(`/maplibre/${getVersion()}/maplibre-gl-worker.mjs`)

const DEFAULT_CENTER: [number, number] = [38.7685, 9.0161]
const DEFAULT_ZOOM = 12

const SPOTS_SOURCE = "spots"
const SPOTS_LAYER = "spots-circles"

const OSM_STYLE: StyleSpecification = {
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
} as const

const colorEntries = Object.entries(CATEGORY_HEX)

export interface GebetaMapProps {
  spots?: Spot[]
  center?: [number, number]
  zoom?: number
  selectedSpotId?: string | null
  onSpotSelect?: (spot: Spot) => void
  onMapReady?: (map: MapLibreMap) => void
}

export function GebetaMap({
  spots = [],
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  selectedSpotId = null,
  onSpotSelect,
  onMapReady,
}: GebetaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  const spotsRef = useRef(spots)
  const onSpotSelectRef = useRef(onSpotSelect)
  spotsRef.current = spots
  onSpotSelectRef.current = onSpotSelect

  const spotsGeoJson = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(
    () => ({
      type: "FeatureCollection",
      features: spots.map((spot) => ({
        type: "Feature",
        id: spot.id,
        geometry: {
          type: "Point",
          coordinates: [spot.longitude, spot.latitude],
        },
        properties: { id: spot.id, category: spot.category },
      })),
    }),
    [spots]
  )

  useEffect(() => {
    const source = mapRef.current?.getSource(SPOTS_SOURCE) as
      | GeoJSONSource
      | undefined
    source?.setData(spotsGeoJson)
  }, [spotsGeoJson])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer(SPOTS_LAYER)) return
    const sel = selectedSpotId ?? ""
    map.setPaintProperty(SPOTS_LAYER, "circle-radius", [
      "case",
      ["==", ["get", "id"], sel],
      11,
      7,
    ] as unknown as ExpressionSpecification)
    map.setPaintProperty(SPOTS_LAYER, "circle-stroke-width", [
      "case",
      ["==", ["get", "id"], sel],
      4,
      2,
    ] as unknown as ExpressionSpecification)
  }, [selectedSpotId])

  useEffect(() => {
    if (!containerRef.current) return

    let map: Map
    try {
      map = new Map({
        container: containerRef.current,
        style: OSM_STYLE,
        center,
        zoom,
        attributionControl: false,
      })
    } catch (error) {
      const message =
        error instanceof GPUInitializationError
          ? "This browser does not support WebGL2, which MapLibre requires."
          : `Map failed to start: ${
              error instanceof Error ? error.message : String(error)
            }`
      queueMicrotask(() => setMapError(message))
      return
    }

    map.addControl(new NavigationControl(), "top-right")
    mapRef.current = map

    map.on("error", (e: MapLibreErrorEvent & { sourceId?: string }) => {
      if (e.sourceId && e.sourceId !== "map") return
      const errMsg = e?.error?.message
      if (!errMsg) return
      console.error("[Map] error:", errMsg)
      queueMicrotask(() => setMapError(`Map error: ${errMsg}`))
    })

    map.on("load", () => {
      try {
        const sel = selectedSpotId ?? ""
        const colorMatch: unknown[] = ["match", ["get", "category"]]
        for (const [cat, hex] of colorEntries) {
          colorMatch.push(cat, hex)
        }
        colorMatch.push("#d96142")

        map.addSource(SPOTS_SOURCE, {
          type: "geojson",
          data: spotsGeoJson,
        })

        map.addLayer({
          id: SPOTS_LAYER,
          type: "circle",
          source: SPOTS_SOURCE,
          paint: {
            "circle-color": colorMatch as unknown as ExpressionSpecification,
            "circle-radius": [
              "case",
              ["==", ["get", "id"], sel],
              11,
              7,
            ] as unknown as ExpressionSpecification,
            "circle-opacity": 0.92,
            "circle-stroke-color": "#fff5e8",
            "circle-stroke-width": [
              "case",
              ["==", ["get", "id"], sel],
              4,
              2,
            ] as unknown as ExpressionSpecification,
          },
        } as CircleLayerSpecification)

        map.on("click", SPOTS_LAYER, (e: MapLayerMouseEvent) => {
          const feature = e.features?.[0]
          const id = feature?.properties?.id
          if (typeof id !== "string") return
          const spot = spotsRef.current.find((s) => s.id === id)
          if (spot) onSpotSelectRef.current?.(spot)
        })

        map.on("mouseenter", SPOTS_LAYER, () => {
          map.getCanvas().style.cursor = "pointer"
        })
        map.on("mouseleave", SPOTS_LAYER, () => {
          map.getCanvas().style.cursor = ""
        })

        onMapReady?.(map)
      } catch (error) {
        console.error("[Map] failed to add spot markers:", error)
        queueMicrotask(() =>
          setMapError(
            error instanceof Error
              ? error.message
              : "Failed to load spot markers"
          )
        )
      }
    })

    return () => {
      mapRef.current = null
      map.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    mapRef.current?.flyTo({ center, zoom })
  }, [center, zoom])

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
