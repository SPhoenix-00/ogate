import {
  ShopItemId,
  SHOP_ITEMS,
  type ShopItemDef,
  BuildingType,
} from "@ogate/shared";
import type { HomeStateSchema } from "../schemas/HomeStateSchema.js";

/**
 * Process a shop purchase. Deducts crystals and applies the item effect.
 */
export function purchaseShopItem(
  state: HomeStateSchema,
  crystals: number,
  itemId: ShopItemId,
): { error: string | null; newCrystals: number } {
  const def = SHOP_ITEMS[itemId];
  if (!def) return { error: "Unknown shop item.", newCrystals: crystals };

  if (crystals < def.priceCrystals) {
    return { error: `Not enough crystals (need ${def.priceCrystals}, have ${crystals}).`, newCrystals: crystals };
  }

  if (def.requiresNanites && state.nanites <= 0) {
    return { error: "Requires Nanites to activate — Nanites cannot be bought.", newCrystals: crystals };
  }

  const remaining = crystals - def.priceCrystals;

  applyItemEffect(state, def);

  return { error: null, newCrystals: remaining };
}

function applyItemEffect(state: HomeStateSchema, def: ShopItemDef): void {
  switch (def.id) {
    case ShopItemId.ExperimentalCapacitorIce:
    case ShopItemId.ExperimentalCapacitorGraveyard:
      state.capacitors1MW += 1;
      break;

    case ShopItemId.EmergencyTransponder:
      // Stored as an inventory item (tracked externally); for now just log
      break;

    case ShopItemId.ResearchSpeedUp:
      state.social.research.forEach((node) => {
        if (node.researching) {
          const now = Date.now();
          const remaining = node.completeAt - now;
          if (remaining > 0) {
            node.completeAt = now + remaining * 0.5;
          }
        }
      });
      break;

    case ShopItemId.ConstructionSpeedUp:
      state.buildings.forEach((building) => {
        if (building.upgrading) {
          const now = Date.now();
          const remaining = building.upgradeCompleteAt - now;
          if (remaining > 0) {
            building.upgradeCompleteAt = now + remaining * 0.5;
          }
        }
      });
      break;

    case ShopItemId.CyberneticModuleBasic:
      if (state.nanites >= 10) {
        state.nanites -= 10;
      }
      break;

    default:
      break;
  }
}
