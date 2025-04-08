import { describe, expect, test } from "vitest";
import { simulateIndigon } from "./simulate";
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

  test("no ramp if you never spend 200 in 4s", () => {
    // cost is extremely low, e.g. 10, regen is high, so it never accumulates 200 in 4s
    const config: CombinedSettings = {
      server: { tickInterval: 1, duration: 8 },
      player: { manaMax: 3000, manaRegen: 3000 },
      skill: {
        baseCost: 10,
        costMultiplier: 1,
        extraCostPercent: 0,
        incCostPercent: 0,
        moreLessCost: 1,
        castPerSecond: 1,
      },
      indigon: { dmgPer200: 50, costIncPer200: 50 },
    };
    const result = simulateIndigon(config);
    expect(result.spellDmg.every((x) => x === 0)).toBe(true);
  });

  test("missed casts when cost > max mana", () => {
    // cost is huge so we always miss
    const config: CombinedSettings = {
      server: { tickInterval: 1, duration: 3 },
      player: { manaMax: 200, manaRegen: 0 },
      skill: {
        baseCost: 1000,
        costMultiplier: 1,
        extraCostPercent: 0,
        incCostPercent: 0,
        moreLessCost: 1,
        castPerSecond: 2,
      },
      indigon: { dmgPer200: 50, costIncPer200: 50 },
    };
    const result = simulateIndigon(config);
    // we cast every 0.5s, but never have enough mana
    expect(result.missedCast.some((miss) => miss === true)).toBe(true);
    // no damage
    expect(result.spellDmg.every((x) => x === 0)).toBe(true);
  });
});
