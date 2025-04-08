import { FlatFormValues } from "../config/formConfig";

export interface SimulationResult {
  time: number[];
  spellDmg: number[];
  manaLeft: number[];
  manaCost: number[];
}

export const simulateIndigon = (config: FlatFormValues): SimulationResult => {
  const {
    tickInterval,
    duration,
    manaMax,
    manaRegen,
    baseCost,
    costMultiplier,
    extraCostPercent,
    incCostPercent,
    moreLessCost,
    castPerSecond,
    dmgPer200,
    costIncPer200,
  } = config;

  const tickCount = Math.floor(duration / tickInterval);

  const result: SimulationResult = {
    time: [],
    spellDmg: [],
    manaLeft: [],
    manaCost: [],
  };

  let mana = manaMax;
  let timeline: { time: number; cost: number }[] = [];

  for (let i = 0; i <= tickCount; i++) {
    const t = +(i * tickInterval).toFixed(3);
    timeline = timeline.filter((e) => t - e.time <= 4);
    const recentSpent = timeline.reduce((sum, e) => sum + e.cost, 0);
    const indigonInc = Math.floor(recentSpent / 200) * costIncPer200;

    const totalIncCost = incCostPercent + indigonInc;
    const calculatedCost =
      (baseCost * costMultiplier + extraCostPercent * manaMax) *
      (1 + totalIncCost / 100) *
      moreLessCost;

    const roundedCost = Math.round(calculatedCost);
    const canCast = mana >= roundedCost;

    if (canCast && i % Math.round(1 / (castPerSecond * tickInterval)) === 0) {
      mana -= roundedCost;
      timeline.push({ time: t, cost: roundedCost });
    }

    mana = Math.min(manaMax, mana + manaRegen * tickInterval);

    result.time.push(t);
    result.spellDmg.push(Math.floor(recentSpent / 200) * dmgPer200);
    result.manaLeft.push(Math.round(mana));
    result.manaCost.push(roundedCost);
  }

  return result;
};
