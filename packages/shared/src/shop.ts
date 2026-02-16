/**
 * Monetization / Shop system.
 * Philosophy: Pay for Variety and Convenience, not Win-State (HLDD §9).
 */

export enum PremiumCurrency {
  /** The premium currency purchasable with real money. */
  Crystals = "CRYSTALS",
}

export enum ShopItemId {
  ExperimentalCapacitorIce = "EXP_CAP_ICE",
  ExperimentalCapacitorGraveyard = "EXP_CAP_GRAVEYARD",
  EmergencyTransponder = "EMERGENCY_TRANSPONDER",
  SpecialistRefresh = "SPECIALIST_REFRESH",
  CloneInsurance = "CLONE_INSURANCE",
  WarpOverclocker = "WARP_OVERCLOCKER",
  ResearchSpeedUp = "RESEARCH_SPEED_UP",
  ConstructionSpeedUp = "CONSTRUCTION_SPEED_UP",
  CyberneticModuleBasic = "CYBERNETIC_MODULE_BASIC",
  CosmeticShipSkin = "COSMETIC_SHIP_SKIN",
  CosmeticHomeBackground = "COSMETIC_HOME_BG",
}

export interface ShopItemDef {
  id: ShopItemId;
  name: string;
  description: string;
  priceCrystals: number;
  category: "access" | "insurance" | "convenience" | "cosmetic";
  /** Whether this item requires Nanites to activate (e.g. Cybernetic Modules). */
  requiresNanites: boolean;
}

export const SHOP_ITEMS: Record<ShopItemId, ShopItemDef> = {
  [ShopItemId.ExperimentalCapacitorIce]: {
    id: ShopItemId.ExperimentalCapacitorIce,
    name: "Experimental Capacitor (Ice Field)",
    description: "Guarantees an Ice Field biome OGate instance.",
    priceCrystals: 50,
    category: "access",
    requiresNanites: false,
  },
  [ShopItemId.ExperimentalCapacitorGraveyard]: {
    id: ShopItemId.ExperimentalCapacitorGraveyard,
    name: "Experimental Capacitor (Ship Graveyard)",
    description: "Guarantees a Ship Graveyard biome OGate instance.",
    priceCrystals: 50,
    category: "access",
    requiresNanites: false,
  },
  [ShopItemId.EmergencyTransponder]: {
    id: ShopItemId.EmergencyTransponder,
    name: "Emergency Transponder",
    description: "One-time hull insurance for Cruisers/Capitals. Burns out on use.",
    priceCrystals: 100,
    category: "insurance",
    requiresNanites: false,
  },
  [ShopItemId.SpecialistRefresh]: {
    id: ShopItemId.SpecialistRefresh,
    name: "Specialist Headhunter",
    description: "Instantly refresh the specialist recruitment pool.",
    priceCrystals: 30,
    category: "convenience",
    requiresNanites: false,
  },
  [ShopItemId.CloneInsurance]: {
    id: ShopItemId.CloneInsurance,
    name: "Clone Insurance",
    description: "Save a specialist's XP after death.",
    priceCrystals: 75,
    category: "insurance",
    requiresNanites: false,
  },
  [ShopItemId.WarpOverclocker]: {
    id: ShopItemId.WarpOverclocker,
    name: "Warp Drive Overclocker",
    description: "Reduce travel time within OGate instances.",
    priceCrystals: 40,
    category: "convenience",
    requiresNanites: false,
  },
  [ShopItemId.ResearchSpeedUp]: {
    id: ShopItemId.ResearchSpeedUp,
    name: "Research Accelerator",
    description: "Reduce current research time by 50%.",
    priceCrystals: 25,
    category: "convenience",
    requiresNanites: false,
  },
  [ShopItemId.ConstructionSpeedUp]: {
    id: ShopItemId.ConstructionSpeedUp,
    name: "Construction Accelerator",
    description: "Reduce current building upgrade time by 50%.",
    priceCrystals: 25,
    category: "convenience",
    requiresNanites: false,
  },
  [ShopItemId.CyberneticModuleBasic]: {
    id: ShopItemId.CyberneticModuleBasic,
    name: "Basic Cybernetic Module",
    description: "A stat booster that requires Nanites to attach.",
    priceCrystals: 60,
    category: "convenience",
    requiresNanites: true,
  },
  [ShopItemId.CosmeticShipSkin]: {
    id: ShopItemId.CosmeticShipSkin,
    name: "Custom Ship Skin",
    description: "AI-generated custom ship skin.",
    priceCrystals: 40,
    category: "cosmetic",
    requiresNanites: false,
  },
  [ShopItemId.CosmeticHomeBackground]: {
    id: ShopItemId.CosmeticHomeBackground,
    name: "Home System Background",
    description: "Custom background for the home system view.",
    priceCrystals: 30,
    category: "cosmetic",
    requiresNanites: false,
  },
};

export enum ShopAction {
  PurchaseItem = "shop_purchase",
  GetBalance = "shop_get_balance",
}

export enum ShopResponse {
  PurchaseSuccess = "shop_purchase_success",
  BalanceUpdate = "shop_balance_update",
  ShopError = "shop_error",
}

export interface PurchaseItemPayload {
  itemId: ShopItemId;
}
