import { describe, expect, test } from "vitest";
import { simulateIndigon } from "./simulation";
import type { CombinedSettings } from "../config/formConfig"; // now exported from config

describe("simulateIndigon (nested config)", () => {
  test("sanity check for basic mana and damage progression", () => {
    const config: CombinedSettings = {
      server: {
        tickInterval: 1,
        duration: 5,
      },
      player: {
        manaMax: 1000,
        manaRegen: 100,
      },
      skill: {
        baseCost: 100,
        costMultiplier: 1,
        extraCostPercent: 0,
        incCostPercent: 0,
        moreLessCost: 1,
        castPerSecond: 1,
      },
      indigon: {
        dmgPer200: 50,
        costIncPer200: 50,
      },
    };

    const result = simulateIndigon(config);

    expect(result.time.length).toBeGreaterThan(0);
    expect(result.manaLeft[0]).toBe(1000);
    expect(result.spellDmg.some((dmg) => dmg > 0)).toBe(true);
  });

  test("returns no damage when spell cost is never paid", () => {
    const config: CombinedSettings = {
      server: {
        tickInterval: 1,
        duration: 5,
      },
      player: {
        manaMax: 10, // Not enough to cast even once
        manaRegen: 0,
      },
      skill: {
        baseCost: 100,
        costMultiplier: 1,
        extraCostPercent: 0,
        incCostPercent: 0,
        moreLessCost: 1,
        castPerSecond: 1,
      },
      indigon: {
        dmgPer200: 50,
        costIncPer200: 50,
      },
    };

    const result = simulateIndigon(config);

    expect(result.spellDmg.every((dmg) => dmg === 0)).toBe(true);
  });
});
