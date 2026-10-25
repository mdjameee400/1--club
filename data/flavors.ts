export type FlavorIcon = "cane" | "coconut" | "bean" | "banana" | "mango";

export type Flavor = {
  id: string;
  no: string;
  name: string;
  type: string;
  tagline: string;
  notes: string;
  ingredients: string[];
  /** Liquid gradient (top → bottom) */
  liquid: string;
  liquid2: string;
  /** Page / section tint when this bottle is active */
  tint: string;
  /** Slightly deeper tint for arch backdrops */
  soft: string;
  accent: string;
  icon: FlavorIcon;
  /** 0–1 fill level of the bottle */
  level: number;
  ice?: boolean;
  slim?: boolean;
  /** PLACEHOLDER prices in BDT — replace with real pricing. */
  price: number;
};

export const flavors: Flavor[] = [
  {
    id: "sugarcane-splash",
    no: "01",
    name: "Sugarcane Splash",
    type: "Sugarcane juice",
    tagline: "Straight from the cane.",
    notes:
      "Bright, grassy and clean, with a honeyed sweetness that finishes cool and light.",
    ingredients: ["sugarcane"],
    liquid: "#C9DBA8",
    liquid2: "#A5C185",
    tint: "#E9F0DA",
    soft: "#D9E5C3",
    accent: "#5E7F4E",
    icon: "cane",
    level: 0.5,
    slim: true,
    price: 100,
  },
  {
    id: "coconut-milkshake",
    no: "02",
    name: "Coconut Milkshake",
    type: "Coconut milkshake",
    tagline: "Tropical. Creamy. Chill.",
    notes:
      "Soft coconut cream over light, sweet milk, with coconut jelly for a gentle chew.",
    ingredients: ["coconut water", "coconut jelly", "milk", "sugar"],
    liquid: "#E2DED5",
    liquid2: "#BDB8AE",
    tint: "#DDECEA",
    soft: "#C9E0DD",
    accent: "#3F8683",
    icon: "coconut",
    level: 0.7,
    ice: true,
    price: 150,
  },
  {
    id: "coco-blast",
    no: "03",
    name: "Coco Blast",
    type: "Cold coffee",
    tagline: "Cold coffee, turned up.",
    notes:
      "Bold coffee lifted by coconut water, silky from milk and poured over coconut jelly.",
    ingredients: [
      "coffee powder",
      "coconut jelly",
      "coconut water",
      "milk",
      "sugar",
    ],
    liquid: "#4A352B",
    liquid2: "#241712",
    tint: "#E8DCD0",
    soft: "#D8C6B6",
    accent: "#7A5A45",
    icon: "bean",
    level: 0.74,
    ice: true,
    price: 160,
  },
  {
    id: "banana-breeze",
    no: "04",
    name: "Banana Breeze",
    type: "Banana milkshake",
    tagline: "Good mood inside.",
    notes:
      "Ripe banana and cold milk, rounded off with almonds and a touch of dates.",
    ingredients: ["banana", "milk", "almonds", "dates", "sugar"],
    liquid: "#EBE3A4",
    liquid2: "#C9C07A",
    tint: "#F4EEC8",
    soft: "#EBE3AE",
    accent: "#A8902A",
    icon: "banana",
    level: 0.7,
    price: 140,
  },
  {
    id: "mango-milkshake",
    no: "05",
    name: "Mango Milkshake",
    type: "Mango milkshake",
    tagline: "Summer in a bottle.",
    notes:
      "Sun-ripe mango blended thick with cold milk. Sweet, smooth and unmistakably summer.",
    ingredients: ["mango", "milk", "sugar"],
    liquid: "#F3B04A",
    liquid2: "#D9861E",
    tint: "#F9E3BE",
    soft: "#F2D199",
    accent: "#CF7D14",
    icon: "mango",
    level: 0.72,
    price: 160,
  },
];

export const flavorById = (id: string) => flavors.find((f) => f.id === id)!;
