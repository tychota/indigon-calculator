import { DotToNested, Merge, UnionToIntersection } from "../utils";

export interface FieldConfig<K extends string = string> {
  key: K; // e.g. "skill.baseCost"
  label: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  tooltip: string;
}

export interface GroupConfig<K extends string = string> {
  title: string;
  fields: FieldConfig<K>[];
}

// --------------------------------------
// TYPE-SAFE formGroups
// --------------------------------------

export const formGroups = [
  {
    title: "Server Settings",
    fields: [
      {
        key: "server.tickInterval",
        label: "Tick Interval",
        min: 0.001,
        max: 1,
        step: 0.001,
        precision: 3,
        tooltip: "Server tick rate (seconds)",
      },
      {
        key: "server.duration",
        label: "Duration",
        min: 1,
        max: 300,
        step: 1,
        precision: 0,
        tooltip: "Simulation duration (seconds)",
      },
    ],
  },
  {
    title: "Player Settings",
    fields: [
      {
        key: "player.manaMax",
        label: "Max Mana",
        min: 100,
        max: 30000,
        step: 1,
        precision: 0,
        tooltip: "Player maximum mana",
      },
      {
        key: "player.manaRegen",
        label: "Mana Regen",
        min: 0,
        max: 20000,
        step: 1,
        precision: 0,
        tooltip: "Mana regenerated per second",
      },
    ],
  },
  {
    title: "Skill Settings",
    fields: [
      {
        key: "skill.baseCost",
        label: "Gem Base Cost",
        min: 0,
        max: 1000,
        step: 1,
        precision: 0,
        tooltip: "Base mana cost of the skill gem",
      },
      {
        key: "skill.costMultiplier",
        label: "Cost Multiplier",
        min: 0.1,
        max: 5,
        step: 0.0001,
        precision: 4,
        tooltip: "Cost multiplier from support gem",
      },
      {
        key: "skill.extraCostPercent",
        label: "Extra Cost %",
        min: 0,
        max: 1,
        step: 0.01,
        precision: 3,
        tooltip: "Extra cost (% max mana), e.g. Archmage support",
      },
      {
        key: "skill.incCostPercent",
        label: "Increased Cost %",
        min: 0,
        max: 500,
        step: 1,
        precision: 0,
        tooltip: "Increased cost (%), e.g. Tree, gear, Indigon effects",
      },
      {
        key: "skill.moreLessCost",
        label: "More/Less Cost Multiplier",
        min: 0,
        max: 2,
        step: 0.01,
        precision: 2,
        tooltip: "More/Less cost multiplier, e.g. Tree, Gear, gem supports",
      },
      {
        key: "skill.castPerSecond",
        label: "Casts per Second",
        min: 0.1,
        max: 20,
        step: 0.1,
        precision: 1,
        tooltip: "Casts per second",
      },
    ],
  },
  {
    title: "Indigon Settings",
    fields: [
      {
        key: "indigon.dmgPer200",
        label: "Damage % per 200 Mana",
        // Allow full corrupted range.
        min: 27,
        max: 61,
        step: 1,
        precision: 0,
        tooltip: "Damage increase per 200 mana spent",
      },
      {
        key: "indigon.costIncPer200",
        label: "Cost % Increase per 200 Mana",
        // Allow full corrupted range.
        min: 27,
        max: 61,
        step: 1,
        precision: 0,
        tooltip: "Cost increase per 200 mana spent",
      },
    ],
  },
] as const satisfies readonly GroupConfig[];

// 🔍 Extract literal keys like "skill.baseCost"
type FieldGroups = typeof formGroups;
type FieldKeys = FieldGroups[number]["fields"][number]["key"];

export type CombinedSettings = Merge<UnionToIntersection<DotToNested<FieldKeys>>>;
