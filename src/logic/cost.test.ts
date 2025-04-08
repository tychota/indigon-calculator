import { describe, it, expect } from "vitest";
import { calculateSkillCost } from "./cost";

describe("calculateSkillCost", () => {
  it("computes a simple cost scenario", () => {
    const cost = calculateSkillCost({
      baseCost: 50,
      costMultiplier: 1.2,
      extraCostPercent: 0,
      incCostPercent: 0,
      indigonIncPercent: 0,
      moreLessCost: 1,
      playerManaMax: 1000,
    });
    expect(cost).toBe(Math.round(50 * 1.2)); // 60
  });

  it("applies extra cost % and inc costs", () => {
    const cost = calculateSkillCost({
      baseCost: 50,
      costMultiplier: 1,
      extraCostPercent: 0.1, // 0.1 * 1000 = 100 extra
      incCostPercent: 50, // +50%
      indigonIncPercent: 50, // +50% more from Indigon
      moreLessCost: 1,
      playerManaMax: 1000,
    });
    // base 50 + 100 = 150
    // inc total = 100% => 150 * 2 = 300
    expect(cost).toBe(300);
  });

  // more tests ...
});
