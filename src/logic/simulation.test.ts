import { expect, test } from "vitest";

import { simulateIndigon } from "./simulation";

test("simulateIndigon sanity check", () => {
  const config = {
    server: { tickInterval: 1, duration: 5 },
    player: { manaMax: 1000, manaRegen: 100 },
    skill: {
      baseCost: 100,
      costMultiplier: 1,
      extraCostPercent: 0,
      incCostPercent: 0,
      moreLessCost: 1,
      castPerSecond: 1,
    },
    indigon: { dmgPer200: 50, costIncPer200: 50 },
  };

  const result = simulateIndigon(config);
  expect(result.time.length).toBeGreaterThan(0);
  expect(result.manaLeft[0]).toEqual(1000);
});
