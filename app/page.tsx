"use client";

import { MapPin, Navigation, MapPinOff, Users, TreePine, Building, Gamepad2, Palette, Gem, Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="relative min-h-screen bg-clay flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-clay via-clay to-subtle" />
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-clay/50 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-clay/30 to-transparent" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-10 h-10 text-orange" />
          <span className="font-display text-3xl font-extrabold text-charcoal tracking-tight">enzi</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-clay/80 border-2 border-charcoal/20 rounded-btn px-4 py-1.5 shadow-[0_4px_0_0_rgba(48,35,30,0.15)]">
            <MapPin className="w-5 h-5 text-orange" />
            <span className="font-display text-lg font-bold text-charcoal">Lvl 1</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none">
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-orange/20 blur-xl animate-pulse" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange rounded-full transform rotate-45" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-clay rounded-full" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange rounded-full" />
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-28 bg-orange rounded-t-[50px] rounded-b-[50px] before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-16 before:bg-clay before:rounded-full before:-translate-y-1/2" />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-4 h-4 bg-clay rounded-full shadow-[0_4px_0_0_rgba(48,35,30,0.3)]" />
          </div>
        </div>

        <div className="relative w-full max-w-xl bg-clay/95 backdrop-blur-sm rounded-3xl border border-charcoal/10 shadow-[0_12px_0_0_rgba(48,35,30,0.1),0_20px_40px_rgba(48,35,30,0.12)] p-10 md:p-14 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-charcoal leading-tight mb-6">
            Explore Addis<br />
            <span className="text-orange">and Enjoy</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-charcoal/80 leading-relaxed mb-10 max-w-lg mx-auto">
            Nearby spots, pinned live. Book in two taps.<br />
            Level up as you go.
          </p>
          <button className="relative inline-flex items-center justify-center gap-3 bg-orange text-white font-display text-xl font-bold rounded-btn px-10 py-4 shadow-[0_6px_0_0_rgba(169,67,45,0.9)] hover:shadow-[0_8px_0_0_rgba(169,67,45,0.9)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(169,67,45,0.9)] transition-all duration-150">
            <Navigation className="w-6 h-6" />
            Enable location
          </button>
        </div>
      </main>

      <footer className="relative z-10 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-body text-sm text-charcoal/50 text-center mb-6">Explore by category</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="relative inline-flex items-center gap-2 bg-green/10 border-2 border-green/30 text-green/90 font-display text-base font-semibold rounded-btn px-5 py-2.5 shadow-[0_4px_0_0_rgba(120,184,74,0.3)] hover:shadow-[0_6px_0_0_rgba(120,184,74,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(120,184,74,0.3)] transition-all duration-150">
              <TreePine className="w-5 h-5" />
              Parks
            </button>
            <button className="relative inline-flex items-center gap-2 bg-purple/10 border-2 border-purple/30 text-purple/90 font-display text-base font-semibold rounded-btn px-5 py-2.5 shadow-[0_4px_0_0_rgba(130,80,180,0.3)] hover:shadow-[0_6px_0_0_rgba(130,80,180,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(130,80,180,0.3)] transition-all duration-150">
              <Building className="w-5 h-5" />
              Museums
            </button>
            <button className="relative inline-flex items-center gap-2 bg-cyan/10 border-2 border-cyan/30 text-cyan/90 font-display text-base font-semibold rounded-btn px-5 py-2.5 shadow-[0_4px_0_0_rgba(85,185,200,0.3)] hover:shadow-[0_6px_0_0_rgba(85,185,200,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(85,185,200,0.3)] transition-all duration-150">
              <Gamepad2 className="w-5 h-5" />
              Game Zones
            </button>
            <button className="relative inline-flex items-center gap-2 bg-pink/10 border-2 border-pink/30 text-pink/90 font-display text-base font-semibold rounded-btn px-5 py-2.5 shadow-[0_4px_0_0_rgba(217,94,134,0.3)] hover:shadow-[0_6px_0_0_rgba(217,94,134,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(217,94,134,0.3)] transition-all duration-150">
              <Palette className="w-5 h-5" />
              Galleries
            </button>
            <button className="relative inline-flex items-center gap-2 bg-gold/10 border-2 border-gold/30 text-gold/90 font-display text-base font-semibold rounded-btn px-5 py-2.5 shadow-[0_4px_0_0_rgba(221,170,69,0.3)] hover:shadow-[0_6px_0_0_rgba(221,170,69,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(221,170,69,0.3)] transition-all duration-150">
              <Gem className="w-5 h-5" />
              Hidden Gems
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}