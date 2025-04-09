interface SkillCostParams {
  baseCost: number;
  costMultiplier: number;
  extraCostPercent: number;
  incCostPercent: number; // from skill
  indigonIncPercent: number; // from Indigon effect
  moreLessCost: number;
  playerManaMax: number;
}

/**
 * Calculates the final skill cost based on various multipliers.
 * Pulling out the formula so it's easier to tweak for future patches.
 */
export function calculateSkillCost(params: SkillCostParams): number {
  const { baseCost, costMultiplier, extraCostPercent, incCostPercent, indigonIncPercent, moreLessCost, playerManaMax } =
    params;

  // 1) base cost, multiplied by costMultiplier
  // 2) extraCostPercent * player's max mana
  // 3) sum the skill’s incCost + Indigon inc
  // 4) then multiply by moreLessCost
  const totalIncCost = incCostPercent + indigonIncPercent;
  const rawCost =
    (baseCost * costMultiplier + extraCostPercent * playerManaMax) * (1 + totalIncCost / 100) * moreLessCost;

  // Round the final cost to nearest integer for POE-like behavior
  return Math.round(rawCost);
}
