"use client"

import Link from "next/link"
import { MapPin, TreePine, Building, Gamepad2, Palette, Gem } from "lucide-react"

const categories = [
  { key: "parks", label: "Parks", icon: TreePine, tone: "green" },
  { key: "museums", label: "Museums", icon: Building, tone: "purple" },
  { key: "game-zones", label: "Game Zones", icon: Gamepad2, tone: "cyan" },
  { key: "galleries", label: "Galleries", icon: Palette, tone: "pink" },
  { key: "hidden-gems", label: "Hidden Gems", icon: Gem, tone: "gold" },
] as const

const tones: Record<string, { box: string; text: string; shadow: string }> = {
  green: {
    box: "border-green/30 bg-green/10 text-green/90",
    text: "text-green/90",
    shadow: "shadow-[0_4px_0_0_rgba(120,184,74,0.3)] hover:shadow-[0_6px_0_0_rgba(120,184,74,0.4)]",
  },
  purple: {
    box: "border-purple/30 bg-purple/10",
    text: "text-purple/90",
    shadow: "shadow-[0_4px_0_0_rgba(130,80,180,0.3)] hover:shadow-[0_6px_0_0_rgba(130,80,180,0.4)]",
  },
  cyan: {
    box: "border-cyan/30 bg-cyan/10",
    text: "text-cyan/90",
    shadow: "shadow-[0_4px_0_0_rgba(85,185,200,0.3)] hover:shadow-[0_6px_0_0_rgba(85,185,200,0.4)]",
  },
  pink: {
    box: "border-pink/30 bg-pink/10",
    text: "text-pink/90",
    shadow: "shadow-[0_4px_0_0_rgba(217,94,134,0.3)] hover:shadow-[0_6px_0_0_rgba(217,94,134,0.4)]",
  },
  gold: {
    box: "border-gold/30 bg-gold/10",
    text: "text-gold/90",
    shadow: "shadow-[0_4px_0_0_rgba(221,170,69,0.3)] hover:shadow-[0_6px_0_0_rgba(221,170,69,0.4)]",
  },
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-clay">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-clay/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-clay/50 to-transparent" />
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-8 w-8 text-orange" />
          <span className="font-display text-xl font-extrabold text-charcoal">
            Enzi
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/map"
            className="relative inline-flex items-center gap-1.5 rounded-btn border-2 border-charcoal/20 bg-clay/80 px-4 py-1.5 text-sm transition-colors hover:bg-orange/10 hover:text-orange"
          >
            Map
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-12">
        <div className="max-w-2xl text-center">
          <h1 className="font-display mb-6 text-4xl font-extrabold leading-tight text-charcoal md:text-5xl lg:text-6xl">
            Explore Addis
            <span className="text-orange"> and Enjoy</span>
          </h1>
          <p className="font-body mb-10 max-w-lg text-lg leading-relaxed text-charcoal/80 md:text-xl">
            Nearby spots, pinned live. Book in two taps.
            <br />
            Level up as you go.
          </p>
        </div>

        <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon
            const tone = tones[cat.tone]
            return (
              <Link
                key={cat.key}
                href={`/map?category=${cat.key}`}
                className={`relative inline-flex items-center gap-2 rounded-btn border-2 px-5 py-2.5 font-display text-base font-semibold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] ${tone.box} ${tone.text} ${tone.shadow}`}
              >
                <Icon className="h-5 w-5" />
                {cat.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-12 w-full max-w-2xl rounded-2xl border-2 border-dashed border-charcoal/15 bg-clay/60 p-8 text-center">
          <p className="font-display text-lg font-bold text-charcoal">
            Coming soon
          </p>
          <p className="font-body mt-2 text-sm text-charcoal/60">
            Profiles, bookings and spot detail pages are still being built.
          </p>
          <Link
            href="/map"
            className="mt-6 inline-flex items-center gap-2 rounded-btn bg-orange px-5 py-2.5 font-display font-bold text-white shadow-[0_4px_0_0_rgba(169,67,45,0.9)] transition-all hover:shadow-[0_6px_0_0_rgba(169,67,45,0.9)]"
          >
            <MapPin className="h-5 w-5" />
            Open the map
          </Link>
        </div>
      </main>
    </div>
  )
}