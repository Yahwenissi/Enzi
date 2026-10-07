import {
  Building,
  Gamepad2,
  Gem,
  Palette,
  TreePine,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Category slugs are the contract with the backend: they must stay in sync with
 * the seeded Category rows (BACKEND_STRUCTURE_SPEC.txt section 8). `food` was
 * added alongside parks/museums/game-zones/galleries/hidden-gems.
 */
export type SpotCategory =
  | "food"
  | "parks"
  | "museums"
  | "game-zones"
  | "galleries"
  | "hidden-gems";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** Matches the `hours Json?` column: `{ mon: "9-22", ... }`, null = closed. */
export type SpotHours = Partial<Record<Weekday, string>>;

/**
 * Attribution travels with the URL. CC BY and CC BY-SA both legally require
 * crediting the author, so a bare URL string cannot satisfy the licence and the
 * detail page could not render a credit line.
 */
export interface SpotImage {
  url: string;
  author: string;
  license: string;
  /** Commons file description page, where the licence and author are authoritative. */
  sourceUrl: string;
}

export interface Spot {
  id: string;
  name: string;
  category: SpotCategory;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  images: SpotImage[];
  rating: number;
  reviewCount: number;
  phone?: string;
  website?: string;
  hours?: SpotHours;
  isVerified: boolean;
  creator?: { name: string };
}

export interface CategoryMeta {
  key: SpotCategory;
  label: string;
  icon: LucideIcon;
  /** Hex used for map markers; must match the Tailwind `dot-*` tone below. */
  hex: string;
  /** Chip + button styling, shared by the landing page and the map sidebar. */
  box: string;
  text: string;
  shadow: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "food",
    label: "Food",
    icon: UtensilsCrossed,
    hex: "#ddaa45",
    box: "border-gold/30 bg-gold/10",
    text: "text-gold/90",
    shadow:
      "shadow-[0_4px_0_0_rgba(221,170,69,0.3)] hover:shadow-[0_6px_0_0_rgba(221,170,69,0.4)]",
  },
  {
    key: "parks",
    label: "Parks",
    icon: TreePine,
    hex: "#78b84a",
    box: "border-green/30 bg-green/10",
    text: "text-green/90",
    shadow:
      "shadow-[0_4px_0_0_rgba(120,184,74,0.3)] hover:shadow-[0_6px_0_0_rgba(120,184,74,0.4)]",
  },
  {
    key: "museums",
    label: "Museums",
    icon: Building,
    hex: "#8250b4",
    box: "border-purple/30 bg-purple/10",
    text: "text-purple/90",
    shadow:
      "shadow-[0_4px_0_0_rgba(130,80,180,0.3)] hover:shadow-[0_6px_0_0_rgba(130,80,180,0.4)]",
  },
  {
    key: "game-zones",
    label: "Game Zones",
    icon: Gamepad2,
    hex: "#55b9c8",
    box: "border-cyan/30 bg-cyan/10",
    text: "text-cyan/90",
    shadow:
      "shadow-[0_4px_0_0_rgba(85,185,200,0.3)] hover:shadow-[0_6px_0_0_rgba(85,185,200,0.4)]",
  },
  {
    key: "galleries",
    label: "Galleries",
    icon: Palette,
    hex: "#d95e86",
    box: "border-pink/30 bg-pink/10",
    text: "text-pink/90",
    shadow:
      "shadow-[0_4px_0_0_rgba(217,94,134,0.3)] hover:shadow-[0_6px_0_0_rgba(217,94,134,0.4)]",
  },
  {
    key: "hidden-gems",
    label: "Hidden Gems",
    icon: Gem,
    hex: "#d96142",
    box: "border-orange/30 bg-orange/10",
    text: "text-orange",
    shadow:
      "shadow-[0_4px_0_0_rgba(169,67,45,0.3)] hover:shadow-[0_6px_0_0_rgba(169,67,45,0.4)]",
  },
];

export const CATEGORY_BY_KEY: Record<SpotCategory, CategoryMeta> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
    SpotCategory,
    CategoryMeta
  >;

export const CATEGORY_LABELS: Record<SpotCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label])
) as Record<SpotCategory, string>;

/** Hex lookup for the GeoJSON `match` expression in GebetaMap. */
export const CATEGORY_HEX: Record<SpotCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.hex])
) as Record<SpotCategory, string>;

export const SPOT_CATEGORIES = CATEGORIES.map((c) => c.key);

/* ------------------------------------------------------------------ *
 * Seed imagery
 *
 * Every URL below was resolved against Wikimedia Commons and confirmed to
 * return an image (HTTP 200, image/*) before being committed. Each photo was
 * also checked to actually show the spot it is attached to -- Commons text
 * search returns confident wrong answers ("Friendship Square" returns Dalian,
 * "Ambassador Theatre" returns New York), and those candidates were discarded
 * rather than shipped.
 *
 * Spots with no verified photograph deliberately have an empty `images` array;
 * the UI renders a designed placeholder instead of a generic cityscape.
 * ------------------------------------------------------------------ */

const W = "https://upload.wikimedia.org/wikipedia/commons";
const C = "https://commons.wikimedia.org/wiki/File:";

const img = (
  path: string,
  author: string,
  license: string,
  file: string
): SpotImage => ({
  url: `${W}/thumb/${path}`,
  author,
  license,
  sourceUrl: `${C}${file}`,
});

const IMAGES = {
  nationalMuseum: img(
    "5/55/National_museum_of_Ethiopia_New_facility.JPG/1280px-National_museum_of_Ethiopia_New_facility.JPG",
    "Richard van Alphen",
    "Public domain",
    "National_museum_of_Ethiopia_New_facility.JPG"
  ),
  ethnographicInterior: img(
    "2/27/Interior_of_Institute_of_Ethiopian_Studies_%28Ethnographic_Museum_-_Former_Imperial_Palace%29_-_Addis_Ababa_University_-_Addis_Ababa_-_Ethiopia_%288667491659%29.jpg/1280px-Interior_of_Institute_of_Ethiopian_Studies_%28Ethnographic_Museum_-_Former_Imperial_Palace%29_-_Addis_Ababa_University_-_Addis_Ababa_-_Ethiopia_%288667491659%29.jpg",
    "Adam Jones",
    "CC BY-SA 2.0",
    "Interior_of_Institute_of_Ethiopian_Studies_(Ethnographic_Museum_-_Former_Imperial_Palace)_-_Addis_Ababa_University_-_Addis_Ababa_-_Ethiopia_(8667491659).jpg"
  ),
  ethnographicJewelry: img(
    "6/62/Display_of_Woman%27s_Traditional_Jewelry_-_Institute_of_Ethiopian_Studies_%28Ethnographic_Museum%29_-_Addis_Ababa_University_-_Addis_Ababa_-_Ethiopia_%288667492065%29.jpg/1280px-Display_of_Woman%27s_Traditional_Jewelry_-_Institute_of_Ethiopian_Studies_%28Ethnographic_Museum%29_-_Addis_Ababa_University_-_Addis_Ababa_-_Ethiopia_%288667492065%29.jpg",
    "Adam Jones",
    "CC BY-SA 2.0",
    "Display_of_Woman's_Traditional_Jewelry_-_Institute_of_Ethiopian_Studies_(Ethnographic_Museum)_-_Addis_Ababa_University_-_Addis_Ababa_-_Ethiopia_(8667492065).jpg"
  ),
  redTerror: img(
    "a/a6/Photographs_of_Victims_of_Dergue_Regime_-_Red_Terror_Martyrs%27_Memorial_Museum_-_Addis_Ababa_-_Ethiopia_%288665513047%29.jpg/1280px-Photographs_of_Victims_of_Dergue_Regime_-_Red_Terror_Martyrs%27_Memorial_Museum_-_Addis_Ababa_-_Ethiopia_%288665513047%29.jpg",
    "Adam Jones",
    "CC BY-SA 2.0",
    "Photographs_of_Victims_of_Dergue_Regime_-_Red_Terror_Martyrs'_Memorial_Museum_-_Addis_Ababa_-_Ethiopia_(8665513047).jpg"
  ),
  meskelSquare: img(
    "d/dc/Meskel_Square%2C_December_2014.jpg/1280px-Meskel_Square%2C_December_2014.jpg",
    "LuckyInWaco",
    "CC BY-SA 4.0",
    "Meskel_Square,_December_2014.jpg"
  ),
  entotoView: img(
    "9/9d/Addis_Ababa_from_Entoto_Mountains.jpg/1280px-Addis_Ababa_from_Entoto_Mountains.jpg",
    "Ninaras",
    "CC BY 4.0",
    "Addis_Ababa_from_Entoto_Mountains.jpg"
  ),
  entotoMountains: img(
    "e/e1/Entoto_Mountains_in_Addis_Ababa.jpg/1280px-Entoto_Mountains_in_Addis_Ababa.jpg",
    "Ninaras",
    "CC BY 4.0",
    "Entoto_Mountains_in_Addis_Ababa.jpg"
  ),
  menelikPalace: img(
    "3/3f/Emperor_Menelik%27s_Palace_in_Entoto_hill_in_Addis_Ababa.jpg/1280px-Emperor_Menelik%27s_Palace_in_Entoto_hill_in_Addis_Ababa.jpg",
    "Ninaras",
    "CC BY 4.0",
    "Emperor_Menelik's_Palace_in_Entoto_hill_in_Addis_Ababa.jpg"
  ),
  unityPark: img(
    "7/70/Unity_Park_Addis_Ababa_Ethiopia_2.jpg/1280px-Unity_Park_Addis_Ababa_Ethiopia_2.jpg",
    "ምቅ37382",
    "CC BY-SA 4.0",
    "Unity_Park_Addis_Ababa_Ethiopia_2.jpg"
  ),
  unityParkAlt: img(
    "6/6b/Unity_ParkU.jpg/1280px-Unity_ParkU.jpg",
    "Tadesserebecca",
    "CC BY-SA 4.0",
    "Unity_ParkU.jpg"
  ),
  entotoMaryam: img(
    "0/01/Addis_Abeba-Entoto_Maryam_Church_%282%29.jpg/1280px-Addis_Abeba-Entoto_Maryam_Church_%282%29.jpg",
    "Ji-Elle",
    "CC BY-SA 3.0",
    "Addis_Abeba-Entoto_Maryam_Church_(2).jpg"
  ),
  entotoMaryamAlt: img(
    "1/1a/Addis_Abeba-Entoto_Maryam_Church_%288%29.jpg/1280px-Addis_Abeba-Entoto_Maryam_Church_%288%29.jpg",
    "Ji-Elle",
    "CC BY-SA 3.0",
    "Addis_Abeba-Entoto_Maryam_Church_(8).jpg"
  ),
  addisPlaza: img(
    "2/27/Addis_Plaza_-_Addisa_Ababa_city_centre_%281%29.jpg/1280px-Addis_Plaza_-_Addisa_Ababa_city_centre_%281%29.jpg",
    "Radosław Botev",
    "CC BY 3.0",
    "Addis_Plaza_-_Addisa_Ababa_city_centre_(1).jpg"
  ),
  cityCentre: img(
    "d/da/Addis_Ababa_City_Center_01.jpg/1280px-Addis_Ababa_City_Center_01.jpg",
    "Ninaras",
    "CC BY 4.0",
    "Addis_Ababa_City_Center_01.jpg"
  ),
  merkato: img(
    "4/4c/Addis_Mercato%2C_Ad%C3%ADs_Abeba%2C_Etiop%C3%ADa%2C_2024-01-19%2C_DD_28.jpg/1280px-Addis_Mercato%2C_Ad%C3%ADs_Abeba%2C_Etiop%C3%ADa%2C_2024-01-19%2C_DD_28.jpg",
    "Diego Delso",
    "CC BY-SA 4.0",
    "Addis_Mercato,_Ad%C3%ADs_Abeba,_Etiop%C3%ADa,_2024-01-19,_DD_28.jpg"
  ),
  tomocaFront: img(
    "0/08/Tomoca%2C_Kaffa_Coffee_House%2C_Addis_%2812586176153%29.jpg/1280px-Tomoca%2C_Kaffa_Coffee_House%2C_Addis_%2812586176153%29.jpg",
    "Rod Waddington",
    "CC BY-SA 2.0",
    "Tomoca,_Kaffa_Coffee_House,_Addis_(12586176153).jpg"
  ),
  tomocaInside: img(
    "3/35/Inside_Tomoca_Coffee_House%2C_Addis_%2812586315014%29.jpg/1280px-Inside_Tomoca_Coffee_House%2C_Addis_%2812586315014%29.jpg",
    "Rod Waddington",
    "CC BY-SA 2.0",
    "Inside_Tomoca_Coffee_House,_Addis_(12586315014).jpg"
  ),
  tomocaAlt: img(
    "d/d7/Tomoca_Coffee_House%2C_Addis_%2812585688875%29.jpg/1280px-Tomoca_Coffee_House%2C_Addis_%2812585688875%29.jpg",
    "Rod Waddington",
    "CC BY-SA 2.0",
    "Tomoca_Coffee_House,_Addis_(12585688875).jpg"
  ),
  coffeeCeremony: img(
    "e/e0/Ethiopian_coffee_ceremony_-_Addis_Ababa.jpg/1280px-Ethiopian_coffee_ceremony_-_Addis_Ababa.jpg",
    "Irene2005",
    "CC BY 2.0",
    "Ethiopian_coffee_ceremony_-_Addis_Ababa.jpg"
  ),
  jebena: {
    url: `${W}/f/fe/Jebena_Ethiopian_coffee_pot.jpg`,
    author: "Pete unseth",
    license: "CC BY-SA 3.0",
    sourceUrl: `${C}Jebena_Ethiopian_coffee_pot.jpg`,
  } satisfies SpotImage,
};

/** Reused so every seeded row carries a creator without repeating the literal. */
const enzi = { name: "Enzi Community" };

const WEEKDAYS_9_6: SpotHours = {
  mon: "09:00-18:00",
  tue: "09:00-18:00",
  wed: "09:00-18:00",
  thu: "09:00-18:00",
  fri: "09:00-18:00",
  sat: "09:00-18:00",
  sun: "09:00-18:00",
};

/**
 * Development seed data. This mirrors the shape the real API will return so it
 * can be swapped for `fetch("/api/spots")` without touching any caller -- see
 * lib/spots-api.ts.
 */
export const SPOTS: Spot[] = [
  {
    id: "national-museum-ethiopia",
    name: "National Museum of Ethiopia",
    category: "museums",
    latitude: 9.0333,
    longitude: 38.75,
    address: "King George VI St, Addis Ababa",
    description:
      "Home to Lucy, the 3.2 million-year-old hominid fossil, alongside collections spanning the country's ancient, imperial and contemporary eras. The museum has recently moved to a large new facility near the old one.",
    images: [IMAGES.nationalMuseum],
    rating: 4.3,
    reviewCount: 89,
    phone: "+251 11 611 963",
    hours: WEEKDAYS_9_6,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "ethnographic-museum",
    name: "Ethnographic Museum",
    category: "museums",
    latitude: 9.0325,
    longitude: 38.7577,
    address: "Institute of Ethiopian Studies, Addis Ababa University",
    description:
      "Housed in the former imperial palace, this museum covers Ethiopian arts and culture across more than forty rooms, with strong textile, jewellery and traditional-attire collections.",
    images: [IMAGES.ethnographicInterior, IMAGES.ethnographicJewelry],
    rating: 4.1,
    reviewCount: 54,
    hours: WEEKDAYS_9_6,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "red-terror-memorial",
    name: "Red Terror Martyrs' Memorial Museum",
    category: "museums",
    latitude: 9.0197,
    longitude: 38.7461,
    address: "Boleyn Hotel, Bole, Addis Ababa",
    description:
      "A memorial to the victims of the Red Terror, told through photographs, personal effects and testimony. Somber and worth reading before visiting.",
    images: [IMAGES.redTerror],
    rating: 4.5,
    reviewCount: 112,
    hours: WEEKDAYS_9_6,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "addis-ababa-museum",
    name: "Addis Ababa Museum",
    category: "museums",
    latitude: 9.02,
    longitude: 38.74,
    address: "Meskel Square area, Addis Ababa",
    description:
      "A compact local museum tracing the history of the city from its founding as a settlement to the modern capital.",
    images: [],
    rating: 4.0,
    reviewCount: 34,
    isVerified: false,
    creator: enzi,
  },
  {
    id: "entoto-natural-park",
    name: "Entoto Natural Park",
    category: "parks",
    latitude: 9.0667,
    longitude: 38.75,
    address: "Entoto, Addis Ababa",
    description:
      "Mountain park above the city with walking trails and the classic elevated view over Addis Ababa. Cooler and quieter than anywhere in the centre.",
    images: [IMAGES.entotoView, IMAGES.entotoMountains],
    rating: 4.5,
    reviewCount: 128,
    hours: { mon: "08:00-18:00", tue: "08:00-18:00", wed: "08:00-18:00", thu: "08:00-18:00", fri: "08:00-18:00", sat: "08:00-18:00", sun: "08:00-18:00" },
    isVerified: true,
    creator: enzi,
  },
  {
    id: "meskel-square",
    name: "Meskel Square",
    category: "parks",
    latitude: 9.0167,
    longitude: 38.75,
    address: "Meskel Square, Addis Ababa",
    description:
      "The city's ceremonial square, host to the Meskel festival and Timkat. Tall obelisk, wide open space, and the usual stage for public gatherings.",
    images: [IMAGES.meskelSquare],
    rating: 4.2,
    reviewCount: 67,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "unity-park",
    name: "Unity Park",
    category: "parks",
    latitude: 9.0161,
    longitude: 38.7685,
    address: "Unity Park, Addis Ababa",
    description:
      "A large modern park in the government district with landscaped grounds, sports courts and wide paths that make it a default spot for a walk.",
    images: [IMAGES.unityPark, IMAGES.unityParkAlt],
    rating: 4.4,
    reviewCount: 156,
    hours: WEEKDAYS_9_6,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "friendship-park",
    name: "Friendship Park",
    category: "parks",
    latitude: 9.03,
    longitude: 38.74,
    address: "Bole, Addis Ababa",
    description:
      "Small neighbourhood green space with benches and shade trees, popular with people walking through Bole.",
    images: [],
    rating: 3.9,
    reviewCount: 23,
    isVerified: false,
    creator: enzi,
  },
  {
    id: "bihere-tsion",
    name: "Bihere Tsion",
    category: "parks",
    latitude: 9.01,
    longitude: 38.76,
    address: "Bole, Addis Ababa",
    description:
      "Quiet park near Bole with exercise areas and mature shade trees.",
    images: [],
    rating: 3.8,
    reviewCount: 12,
    isVerified: false,
    creator: enzi,
  },
  {
    id: "entoto-maryam-church",
    name: "Entoto Maryam Church",
    category: "hidden-gems",
    latitude: 9.0833,
    longitude: 38.7667,
    address: "Entoto Mountain, Addis Ababa",
    description:
      "A historic hilltop church with panoramic views over the city. Combined with Menelik's Palace nearby it makes a strong half-day trip.",
    images: [IMAGES.entotoMaryam, IMAGES.entotoMaryamAlt],
    rating: 4.7,
    reviewCount: 45,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "menelik-palace",
    name: "Emperor Menelik's Palace",
    category: "hidden-gems",
    latitude: 9.0722,
    longitude: 38.7611,
    address: "Entoto Hill, Addis Ababa",
    description:
      "Menelik II's palace on Entoto hill, preserved much as it was left, with the surrounding grounds open to visitors and a commanding view back over Addis Ababa.",
    images: [IMAGES.menelikPalace],
    rating: 4.6,
    reviewCount: 38,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "merkato",
    name: "Merkato",
    category: "hidden-gems",
    latitude: 9.025,
    longitude: 38.7525,
    address: "Merkato, Addis Ababa",
    description:
      "Addis's largest open-air market, several levels of stalls selling produce, spices, textiles and household goods. Overwhelming at first and genuinely fun once you accept that nobody knows where anything is.",
    images: [IMAGES.merkato],
    rating: 4.4,
    reviewCount: 210,
    hours: { mon: "07:00-19:00", tue: "07:00-19:00", wed: "07:00-19:00", thu: "07:00-19:00", fri: "07:00-19:00", sat: "07:00-19:00", sun: "08:00-18:00" },
    isVerified: true,
    creator: enzi,
  },
  {
    id: "addis-plaza",
    name: "Addis Plaza",
    category: "hidden-gems",
    latitude: 9.0219,
    longitude: 38.7536,
    address: "Addis Plaza, City Centre, Addis Ababa",
    description:
      "A landmark building in the middle of the city centre, with a lobby cafe and rooftop space that most people walk past without stopping.",
    images: [IMAGES.addisPlaza, IMAGES.cityCentre],
    rating: 4.3,
    reviewCount: 29,
    isVerified: false,
    creator: enzi,
  },
  {
    id: "tomoca-coffee-house",
    name: "Tomoca Coffee House",
    category: "food",
    latitude: 9.0198,
    longitude: 38.7561,
    address: "Africa Street, Addis Ababa",
    description:
      "A tiny roastery-cafe that has been roasting and serving coffee on the same corner for generations. The place to try a macchiato if you have not had one.",
    images: [IMAGES.tomocaFront, IMAGES.tomocaInside, IMAGES.tomocaAlt],
    rating: 4.5,
    reviewCount: 320,
    hours: { mon: "07:30-19:00", tue: "07:30-19:00", wed: "07:30-19:00", thu: "07:30-19:00", fri: "07:30-19:00", sat: "08:00-18:00", sun: "Closed" },
    isVerified: true,
    creator: enzi,
  },
  {
    id: "kategna",
    name: "Kategna",
    category: "food",
    latitude: 9.0194,
    longitude: 38.7531,
    address: "Bole, Addis Ababa",
    description:
      "Well known for kitfo and shiro, served with Injera. A reliable first stop for Ethiopian food if you have not eaten it before.",
    images: [],
    rating: 4.4,
    reviewCount: 180,
    hours: { mon: "11:00-22:00", tue: "11:00-22:00", wed: "11:00-22:00", thu: "11:00-22:00", fri: "11:00-22:00", sat: "11:00-22:00", sun: "11:00-22:00" },
    isVerified: false,
    creator: enzi,
  },
  {
    id: "yodit-abyssinia",
    name: "Yodit Abyssinia Cultural Centre",
    category: "food",
    latitude: 9.0212,
    longitude: 38.7596,
    address: "Bole, Addis Ababa",
    description:
      "Eritrean-Ethiopian restaurant with a long menu of home cooking and live music most weekends. A reliable pick for a group meal.",
    images: [],
    rating: 4.2,
    reviewCount: 96,
    hours: { mon: "12:00-23:00", tue: "12:00-23:00", wed: "12:00-23:00", thu: "12:00-23:00", fri: "12:00-23:00", sat: "12:00-23:00", sun: "12:00-23:00" },
    isVerified: false,
    creator: enzi,
  },
  {
    id: "traditional-coffee-ceremony",
    name: "Traditional Coffee Ceremony",
    category: "food",
    latitude: 9.0198,
    longitude: 38.7561,
    address: "Africa Street, Addis Ababa",
    description:
      "The buna ceremony, run with freshly roasted beans and a jebena. Served as an experience to sit through rather than a quick coffee, and the most recognisable part of Ethiopian hospitality.",
    images: [IMAGES.coffeeCeremony, IMAGES.jebena],
    rating: 4.7,
    reviewCount: 140,
    isVerified: true,
    creator: enzi,
  },
  {
    id: "addis-fine-art-gallery",
    name: "Addis Fine Art Gallery",
    category: "galleries",
    latitude: 9.02,
    longitude: 38.75,
    address: "Bole, Addis Ababa",
    description:
      "Contemporary Ethiopian art in a converted residential building, with rotating group shows from local and diaspora artists.",
    images: [],
    rating: 4.6,
    reviewCount: 28,
    isVerified: false,
    creator: enzi,
  },
  {
    id: "zoma-museum",
    name: "Zoma Museum",
    category: "galleries",
    latitude: 9.0392,
    longitude: 38.7625,
    address: "Zoma compound, Addis Ababa",
    description:
      "Contemporary art space in a garden setting, known for large-scale installations and its permanent collection.",
    images: [],
    rating: 4.3,
    reviewCount: 41,
    isVerified: false,
    creator: enzi,
  },
  {
    id: "lions-park",
    name: "Lions Park",
    category: "game-zones",
    latitude: 9.03,
    longitude: 38.74,
    address: "Lideta, Addis Ababa",
    description:
      "Amusement park with rides, arcade games and a food court, popular at weekends with families and groups.",
    images: [],
    rating: 4.1,
    reviewCount: 78,
    isVerified: false,
    creator: enzi,
  },
  {
    id: "gurd-sholla-park",
    name: "Gurd Sholla Park",
    category: "game-zones",
    latitude: 8.99,
    longitude: 38.78,
    address: "Bole, Addis Ababa",
    description:
      "Games and entertainment venue near the airport with billiards, table football and a small arcade.",
    images: [],
    rating: 3.9,
    reviewCount: 23,
    isVerified: false,
    creator: enzi,
  },
];

export function getSpotById(id: string): Spot | undefined {
  return SPOTS.find((spot) => spot.id === id);
}

export function spotsByCategory(category: SpotCategory): Spot[] {
  return SPOTS.filter((spot) => spot.category === category);
}

/** Rough great-circle distance in kilometres. */
export function distanceKm(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLon = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const WEEKDAY_ORDER: Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
