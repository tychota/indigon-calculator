// src/logic/analyze.ts
import type { SimulationResult } from "./simulate";

export interface SimulationAnalysis {
  status: "red" | "warning" | "perfect" | "other";
  message: string; // short summary
  details: {
    rampTime: number; // In seconds
    maxSpellDmg: number; // e.g. 3360 => 3360%
    missRate: number; // e.g. 35.71 => 35.71%
    adjustedCastRate: number; // 100 - missRate => e.g. 64.29
    estimatedSustainedDmg: number; // e.g. 2160 => 2160%
    additionalNote: string; // any short note about cast speed, etc.
  };
}

export function analyzeSimulation(result: SimulationResult): SimulationAnalysis {
  const rampTime = result.timeToMaxDmg;
  const maxSpellDmg = result.maxSpellDmg;
  // Suppose `missRateAfterFirstMiss` is a raw 0–100 number:
  const missRate = parseFloat(result.missRateAfterFirstMiss.toFixed(2));
  const adjustedCastRate = parseFloat((100 - missRate).toFixed(2));
  const estimatedSustainedDmg = Math.round(maxSpellDmg * (adjustedCastRate / 100));

  let status: SimulationAnalysis["status"] = "other";
  let shortMsg = "Check your stats."; // Fallback

  // Decide status based on missRate
  if (missRate < 40) {
    status = "perfect";
    shortMsg = "Excellent - minimal misses (0-40% miss rate).";
  } else if (missRate >= 70) {
    status = "red";
    shortMsg = "Unstable - high miss rate (70%-100% miss rate).";
  } else {
    status = "warning";
    shortMsg = "Moderate miss rate (40-70% miss rate).";
  }

  // For example, a short note about cast speed
  const additionalNote =
    "Sustaining Indigon without excessive misses is easier at slower cast speeds (which may lengthen ramp time).";

  return {
    status,
    message: shortMsg,
    details: {
      rampTime,
      maxSpellDmg,
      missRate,
      adjustedCastRate,
      estimatedSustainedDmg,
      additionalNote,
    },
  };
}
