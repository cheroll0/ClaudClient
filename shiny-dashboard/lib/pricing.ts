// Moon's official pricing table — sourced directly from her Excel spreadsheet

export type ServiceTier = "Regular Clean" | "Deep Clean" | "Move In/Out" | "Post Construction";

// ─── RESIDENTIAL PRICING ────────────────────────────────────────────────────

export interface ResidentialLineItem {
  name: string;
  category: string;
  prices: Record<ServiceTier, number | string>;
  unit?: string;
}

export const RESIDENTIAL_ITEMS: ResidentialLineItem[] = [
  // Rooms
  { name: "Small Room", category: "Rooms", prices: { "Regular Clean": 40, "Deep Clean": 60, "Move In/Out": 80, "Post Construction": 80 } },
  { name: "Medium Room", category: "Rooms", prices: { "Regular Clean": 60, "Deep Clean": 80, "Move In/Out": 100, "Post Construction": 100 } },
  { name: "Big Room", category: "Rooms", prices: { "Regular Clean": 80, "Deep Clean": 100, "Move In/Out": 120, "Post Construction": 120 } },
  { name: "Small Basement", category: "Rooms", prices: { "Regular Clean": 40, "Deep Clean": 60, "Move In/Out": 80, "Post Construction": 80 } },
  { name: "Hallway", category: "Rooms", prices: { "Regular Clean": 20, "Deep Clean": 30, "Move In/Out": 40, "Post Construction": 40 } },
  { name: "Garage", category: "Rooms", prices: { "Regular Clean": 70, "Deep Clean": 100, "Move In/Out": 120, "Post Construction": 120 } },
  { name: "Laundry Room", category: "Rooms", prices: { "Regular Clean": 25, "Deep Clean": 35, "Move In/Out": 45, "Post Construction": 45 } },
  { name: "Storage Room", category: "Rooms", prices: { "Regular Clean": 30, "Deep Clean": 40, "Move In/Out": 60, "Post Construction": 60 } },
  { name: "Attic", category: "Rooms", prices: { "Regular Clean": 0, "Deep Clean": 0, "Move In/Out": 0, "Post Construction": 0 }, unit: "Quote required" },
  { name: "Patio", category: "Rooms", prices: { "Regular Clean": 40, "Deep Clean": 60, "Move In/Out": 80, "Post Construction": 80 } },

  // Bathrooms
  { name: "Small Bathroom", category: "Bathrooms", prices: { "Regular Clean": 30, "Deep Clean": 35, "Move In/Out": 40, "Post Construction": 40 } },
  { name: "Medium Bathroom", category: "Bathrooms", prices: { "Regular Clean": 40, "Deep Clean": 45, "Move In/Out": 45, "Post Construction": 45 } },
  { name: "Big Bathroom", category: "Bathrooms", prices: { "Regular Clean": 50, "Deep Clean": 55, "Move In/Out": 55, "Post Construction": 55 } },

  // Kitchen & Appliances
  { name: "Kitchen", category: "Kitchen", prices: { "Regular Clean": 30, "Deep Clean": 40, "Move In/Out": 50, "Post Construction": 50 } },
  { name: "Oven Inside", category: "Kitchen", prices: { "Regular Clean": 20, "Deep Clean": 30, "Move In/Out": 50, "Post Construction": 50 } },
  { name: "Microwave Inside", category: "Kitchen", prices: { "Regular Clean": 20, "Deep Clean": 30, "Move In/Out": 30, "Post Construction": 30 } },
  { name: "Cabinet Inside", category: "Kitchen", prices: { "Regular Clean": 20, "Deep Clean": 30, "Move In/Out": 30, "Post Construction": 30 } },
  { name: "Fridge Inside (2-door)", category: "Kitchen", prices: { "Regular Clean": 20, "Deep Clean": 20, "Move In/Out": 20, "Post Construction": 20 } },
  { name: "Fridge Inside (3-door french)", category: "Kitchen", prices: { "Regular Clean": 35, "Deep Clean": 35, "Move In/Out": 35, "Post Construction": 35 } },

  // Windows
  { name: "Small Window", category: "Windows", prices: { "Regular Clean": 6, "Deep Clean": 8, "Move In/Out": 10, "Post Construction": 10 }, unit: "per window" },
  { name: "Medium Window", category: "Windows", prices: { "Regular Clean": 8, "Deep Clean": 10, "Move In/Out": 15, "Post Construction": 15 }, unit: "per window" },
  { name: "Big Window", category: "Windows", prices: { "Regular Clean": 10, "Deep Clean": 15, "Move In/Out": 20, "Post Construction": 20 }, unit: "per window" },
  { name: "Extra Big Window", category: "Windows", prices: { "Regular Clean": 15, "Deep Clean": 18, "Move In/Out": 25, "Post Construction": 25 }, unit: "per window" },

  // Upholstery / Sofa
  { name: "Sofa Cleaning (small)", category: "Upholstery", prices: { "Regular Clean": 70, "Deep Clean": 150, "Move In/Out": 250, "Post Construction": 250 } },
  { name: "Sofa Cleaning (medium)", category: "Upholstery", prices: { "Regular Clean": 150, "Deep Clean": 250, "Move In/Out": 350, "Post Construction": 350 } },
  { name: "Sofa Cleaning (large sectional)", category: "Upholstery", prices: { "Regular Clean": 250, "Deep Clean": 350, "Move In/Out": 350, "Post Construction": 450 } },

  // Add-ons
  { name: "Wood Polishing", category: "Add-ons", prices: { "Regular Clean": 25, "Deep Clean": 55, "Move In/Out": 75, "Post Construction": 75 } },
  { name: "Cabinet Organizing", category: "Add-ons", prices: { "Regular Clean": 50, "Deep Clean": 60, "Move In/Out": 80, "Post Construction": 80 } },
  { name: "Blinds Dusting", category: "Add-ons", prices: { "Regular Clean": 65, "Deep Clean": 85, "Move In/Out": 100, "Post Construction": 100 } },
  { name: "Baseboard Cleaning", category: "Add-ons", prices: { "Regular Clean": 75, "Deep Clean": 90, "Move In/Out": 125, "Post Construction": 125 } },
  { name: "Chimney Sweep", category: "Add-ons", prices: { "Regular Clean": 80, "Deep Clean": 150, "Move In/Out": 200, "Post Construction": 200 } },
  { name: "Gutter Cleaning", category: "Add-ons", prices: { "Regular Clean": 70, "Deep Clean": 140, "Move In/Out": 190, "Post Construction": 190 } },
  { name: "Carpet Cleaning", category: "Add-ons", prices: { "Regular Clean": 100, "Deep Clean": 250, "Move In/Out": 500, "Post Construction": 500 } },
  { name: "Pet Odor Removal", category: "Add-ons", prices: { "Regular Clean": 100, "Deep Clean": 250, "Move In/Out": 550, "Post Construction": 550 } },
  { name: "Air Duct Cleaning", category: "Add-ons", prices: { "Regular Clean": 450, "Deep Clean": 550, "Move In/Out": 750, "Post Construction": 750 } },
  { name: "Linen Change", category: "Add-ons", prices: { "Regular Clean": 13, "Deep Clean": 15, "Move In/Out": 15, "Post Construction": 15 }, unit: "per bed" },
  { name: "Laundry", category: "Add-ons", prices: { "Regular Clean": 10, "Deep Clean": 10, "Move In/Out": 10, "Post Construction": 10 }, unit: "per load" },
  { name: "After Event Cleaning", category: "Add-ons", prices: { "Regular Clean": 50, "Deep Clean": 70, "Move In/Out": 100, "Post Construction": 100 } },
  { name: "Wall Clean (small)", category: "Add-ons", prices: { "Regular Clean": 50, "Deep Clean": 50, "Move In/Out": 60, "Post Construction": 60 } },
  { name: "Ironing & Folding", category: "Add-ons", prices: { "Regular Clean": 30, "Deep Clean": 30, "Move In/Out": 30, "Post Construction": 30 } },
];

// ─── COMMERCIAL PRICING ────────────────────────────────────────────────────

// Moon's commercial formula: Hours = SQFT / 70, Rate = $120/hr
export const COMMERCIAL_RATE_PER_HOUR = 120;
export const SQFT_PER_HOUR = 70;

export function calcCommercialBase(sqft: number): { hours: number; total: number } {
  const hours = sqft / SQFT_PER_HOUR;
  return { hours: Math.round(hours * 10) / 10, total: Math.round(hours * COMMERCIAL_RATE_PER_HOUR) };
}

// Commercial service multipliers (applied on top of base)
export const COMMERCIAL_MULTIPLIERS: Record<string, number> = {
  "Regular Commercial": 1.0,
  "Deep Clean": 1.5,
  "Post Construction": 1.71,  // matches Moon's $2,571 for 1,500 sqft
  "Medical / Biohazard": 2.0,
  "Restaurant": 1.6,
  "Gym": 1.3,
  "School": 1.4,
};

// Commercial add-on flat fees
export const COMMERCIAL_ADDONS: { name: string; price: number | string; unit?: string }[] = [
  { name: "Floor Stripping & Wax", price: 0.35, unit: "per sqft" },
  { name: "High-Rise Window Cleaning", price: 0.51, unit: "per sqft (min $500)" },
  { name: "Carpet Cleaning", price: 0.25, unit: "per sqft" },
  { name: "Back Hot Mop", price: 52.50, unit: "flat avg" },
  { name: "Graffiti Removal", price: 150, unit: "starting" },
  { name: "Parking Lot Cleaning", price: 0.03, unit: "per sqft" },
  { name: "Hood Cleaning", price: 200, unit: "starting" },
  { name: "Air Duct Cleaning", price: 750, unit: "starting" },
  { name: "Window Track Cleaning", price: 7, unit: "per track" },
  { name: "Post-Const. Window Cleaning", price: 0.45, unit: "per sqft" },
];

// ─── ESTIMATE HELPERS ──────────────────────────────────────────────────────

export interface EstimateLineItem {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
  note?: string;
}

export function calcEstimateTotal(items: EstimateLineItem[]): number {
  return items.reduce((sum, i) => sum + i.total, 0);
}

export function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
