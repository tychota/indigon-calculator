export interface ServerSettings {
  tickInterval: number;
  duration: number;
}

export interface PlayerSettings {
  manaMax: number;
  manaRegen: number;
}

export interface SkillSettings {
  baseCost: number;
  costMultiplier: number;
  extraCostPercent: number;
  incCostPercent: number;
  moreLessCost: number;
  castPerSecond: number;
}

export interface IndigonSettings {
  dmgPer200: number;
  costIncPer200: number;
}

export interface CombinedSettings {
  server: ServerSettings;
  player: PlayerSettings;
  skill: SkillSettings;
  indigon: IndigonSettings;
}

export interface SimulationResult {
  time: number[];
  spellDmg: number[];
  manaLeft: number[];
  manaCost: number[];
}

export const simulateIndigon = (config: CombinedSettings): SimulationResult => {
  const { server, player, skill, indigon } = config;
  const tickCount = Math.floor(server.duration / server.tickInterval);

  const result: SimulationResult = {
    time: [],
    spellDmg: [],
    manaLeft: [],
    manaCost: [],
  };

  let mana = player.manaMax;
  let timeline: { time: number; cost: number }[] = [];

  for (let i = 0; i <= tickCount; i++) {
    const t = +(i * server.tickInterval).toFixed(3);
    timeline = timeline.filter((e) => t - e.time <= 4);
    const recentSpent = timeline.reduce((sum, e) => sum + e.cost, 0);
    const indigonInc = Math.floor(recentSpent / 200) * indigon.costIncPer200;

    const totalIncCost = skill.incCostPercent + indigonInc;
    const calculatedCost =
      (skill.baseCost * skill.costMultiplier +
        skill.extraCostPercent * player.manaMax) *
      (1 + totalIncCost / 100) *
      skill.moreLessCost;

    const roundedCost = Math.round(calculatedCost);
    const canCast = mana >= roundedCost;

    if (
      canCast &&
      i % Math.round(1 / (skill.castPerSecond * server.tickInterval)) === 0
    ) {
      mana -= roundedCost;
      timeline.push({ time: t, cost: roundedCost });
    }

    mana = Math.min(
      player.manaMax,
      mana + player.manaRegen * server.tickInterval
    );

    result.time.push(t);
    result.spellDmg.push(Math.floor(recentSpent / 200) * indigon.dmgPer200);
    result.manaLeft.push(Math.round(mana));
    result.manaCost.push(roundedCost);
  }

  return result;
};
