import { SPOTS, type Spot, type SpotCategory } from "@/lib/spots";

/**
 * The single seam between the UI and spot data.
 *
 * Everything here is `async` and returns plain objects, deliberately mirroring
 * the route signatures in BACKEND_STRUCTURE_SPEC.txt section 9:
 *
 *   GET  /api/spots            -> listSpots
 *   GET  /api/spots/[id]       -> getSpot
 *   GET  /api/categories       -> (see CATEGORIES in lib/spots)
 *   POST /api/bookings         -> createBooking
 *   GET  /api/bookings         -> listBookings
 *
 * The bodies below read from an in-memory array and, for bookings,
 * `localStorage`. Swapping in the real backend means replacing the
 * implementations below with `fetch` calls and changing nothing else --
 * no component imports anything from this file except these functions.
 */

export interface SpotFilter {
  category?: SpotCategory;
  query?: string;
}

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface BookingInput {
  spotId: string;
  /** ISO `YYYY-MM-DD` date, not a timestamp. */
  date: string;
  partySize: number;
  notes?: string;
  guestName?: string;
  guestEmail?: string;
}

export interface Booking extends BookingInput {
  id: string;
  status: BookingStatus;
  createdAt: string;
}

const STORAGE_KEY = "enzi.bookings.v1";

/**
 * Bookings are guest-first: the product promise is "Book in two taps", so no
 * account is required. `userId` is intentionally absent until auth lands; the
 * backend spec now allows `Booking.userId` to be null for exactly this reason.
 */

export async function listSpots(filter: SpotFilter = {}): Promise<Spot[]> {
  const { category, query } = filter;
  const q = query?.trim().toLowerCase();

  return SPOTS.filter((spot) => {
    if (category && spot.category !== category) return false;
    if (!q) return true;
    return (
      spot.name.toLowerCase().includes(q) ||
      spot.address.toLowerCase().includes(q) ||
      spot.description.toLowerCase().includes(q)
    );
  });
}

export async function getSpot(id: string): Promise<Spot | null> {
  return SPOTS.find((spot) => spot.id === id) ?? null;
}

export async function getSpotsByIds(ids: string[]): Promise<Spot[]> {
  const wanted = new Set(ids);
  return SPOTS.filter((spot) => wanted.has(spot.id));
}

/* ---------------- bookings (localStorage backed) ---------------- */

function readBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    // Corrupt or unavailable storage (private mode, quota) should never take
    // the page down; treat it as "no bookings yet".
    return [];
  }
}

function writeBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // Non-fatal: the in-memory result is still returned to the caller.
  }
}

export async function listBookings(): Promise<Booking[]> {
  return readBookings().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  const booking: Booking = {
    ...input,
    id: `bk_${Math.random().toString(36).slice(2, 10)}`,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  const existing = readBookings();
  writeBookings([booking, ...existing]);

  return booking;
}

export async function cancelBooking(id: string): Promise<Booking | null> {
  const existing = readBookings();
  const target = existing.find((b) => b.id === id);
  if (!target) return null;

  const cancelled: Booking = { ...target, status: "CANCELLED" };
  writeBookings(existing.map((b) => (b.id === id ? cancelled : b)));
  return cancelled;
}
