import type { CombinedSettings } from "../config/formConfig";
import { calculateSkillCost } from "./cost";
export interface CastDelay {
  ideal: number; // Scheduled cast time (snapped)
  actual: number; // Actual time the cast occurred
}

export interface CastEvent {
  ideal: number;
  actual: number;
}

export interface SimulationResult {
  // Basic timeline arrays
  time: number[];
  spellDmg: number[];
  manaLeft: number[];
  manaCost: number[];
  missedCast: boolean[]; // For ticks when a cast is pending but not done
  totalSpentLast4Sec: number[]; // Sum of mana spent in last 4s

  // Detailed cast info
  castEvents: CastEvent[]; // All successful casts
  castDelays: CastDelay[]; // Only the ones that were delayed

  // Stats
  maxSpellDmg: number;
  timeToMaxDmg: number;
  missRateAfterFirstMiss: number;
}

/** Rounds up a time to the next multiple of tickInterval */
function snapToTick(time: number, tickInterval: number): number {
  return Math.ceil(time / tickInterval) * tickInterval;
}

export function simulateIndigon(config: CombinedSettings): SimulationResult {
  const { server, player, skill, indigon } = config;
  const tickInterval = server.tickInterval; // e.g. 0.033
  const totalTicks = Math.floor(server.duration / tickInterval);

  // The raw cast interval (e.g. 0.2s for 5 casts/s).
  const rawInterval = 1 / skill.castPerSecond;
  // Snap that up to the next server tick
  const idealInterval = snapToTick(rawInterval, tickInterval);

  let mana = player.manaMax;
  let timeline: { time: number; cost: number }[] = [];

  // The next cast is scheduled at time `idealInterval` initially
  let scheduledCastTime = idealInterval;
  let pendingCast = false;

  // We'll store all successful casts (including those without delay)
  const castEvents: CastEvent[] = [];
  const castDelays: CastDelay[] = [];

  let maxDmgSoFar = 0;
  let timeOfMaxDmg = 0;

  // Prepare result arrays
  const result: SimulationResult = {
    time: [],
    spellDmg: [],
    manaLeft: [],
    manaCost: [],
    missedCast: [],
    totalSpentLast4Sec: [],
    castEvents, // will fill
    castDelays, // will fill
    maxSpellDmg: 0,
    timeToMaxDmg: 0,
    missRateAfterFirstMiss: 0,
  };

  // MAIN SIMULATION LOOP
  for (let i = 0; i <= totalTicks; i++) {
    const t = +(i * tickInterval).toFixed(3);

    // Clear out old timeline events older than 4s
    timeline = timeline.filter((e) => t - e.time <= 4);

    const recentSpent = timeline.reduce((sum, e) => sum + e.cost, 0);
    const indigonInc = Math.floor(recentSpent / 200) * indigon.costIncPer200;

    // Calculate cost for a cast attempt at this tick
    const calculatedCost = calculateSkillCost({
      baseCost: skill.baseCost,
      costMultiplier: skill.costMultiplier,
      extraCostPercent: skill.extraCostPercent,
      incCostPercent: skill.incCostPercent,
      indigonIncPercent: indigonInc,
      moreLessCost: skill.moreLessCost,
      playerManaMax: player.manaMax,
    });

    let missed = false;

    // If time >= scheduledCastTime => we want to cast ASAP (pending)
    if (t >= scheduledCastTime) {
      pendingCast = true;
    }

    if (pendingCast) {
      // Attempt the cast
      if (mana >= calculatedCost) {
        // We can cast now
        const actual = t;
        // If actual is after the scheduled time, it's a delay
        const delay = actual - scheduledCastTime;
        if (delay > 0.033) {
          castDelays.push({ ideal: scheduledCastTime, actual });
        }
        // Always record the cast
        castEvents.push({ ideal: scheduledCastTime, actual });

        // Deduct mana
        mana -= calculatedCost;
        timeline.push({ time: t, cost: calculatedCost });

        // Next cast scheduled for (actual + idealInterval)
        scheduledCastTime = actual + idealInterval;
        pendingCast = false;
      } else {
        // Not enough mana => cast is still pending
        missed = true;
      }
    }

    // End of tick: mana regen
    mana = Math.min(player.manaMax, mana + player.manaRegen * tickInterval);

    // Compute Indigon damage
    const dmgStacks = Math.floor(recentSpent / 200);
    const currentDmg = dmgStacks * indigon.dmgPer200;
    if (currentDmg > maxDmgSoFar) {
      maxDmgSoFar = currentDmg;
      timeOfMaxDmg = t;
    }

    // Fill per-tick arrays
    result.time.push(t);
    result.spellDmg.push(currentDmg);
    result.manaLeft.push(Math.round(mana));
    result.manaCost.push(calculatedCost);
    result.missedCast.push(missed);
    result.totalSpentLast4Sec.push(recentSpent);
  }

  // Post-simulation stats
  result.maxSpellDmg = maxDmgSoFar;
  result.timeToMaxDmg = timeOfMaxDmg;

  // =============== Compute missRateAfterFirstMiss ===============
  // Simulation end time is the last tick time
  const simulationEndTime = result.time[result.time.length - 1];
  // The beginning of the delayed period is at the first delayed cast's actual time.
  // That is roughly when the player deals the most damage.
  const t0 = timeOfMaxDmg;
  // Calculate the expected number of casts between t0 and the simulation end time,
  // based on the ideal interval.
  const expectedCasts = Math.floor((simulationEndTime - t0) / idealInterval);
  // Count the number of actual casts that occurred at or after t0.
  const actualCasts = castEvents.filter((ce) => ce.actual >= t0).length;
  // Miss rate percentage is the fraction missed compared to expected, expressed from 0 to 100.
  result.missRateAfterFirstMiss = ((expectedCasts - actualCasts) / expectedCasts) * 100;

  return result;
}
