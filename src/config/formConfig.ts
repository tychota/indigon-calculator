export interface FieldConfig {
  key: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  tooltip?: string;
}

export interface GroupConfig {
  title: string;
  fields: FieldConfig[];
}

export const formGroups: GroupConfig[] = [
  {
    title: "Server Settings",
    fields: [
      {
        key: "tickInterval",
        label: "Tick Interval",
        min: 0.001,
        max: 1,
        step: 0.001,
        precision: 3,
        tooltip: "Server tick rate (seconds)",
      },
      {
        key: "duration",
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
        key: "manaMax",
        label: "Max Mana",
        min: 100,
        max: 10000,
        step: 100,
        precision: 0,
        tooltip: "Player maximum mana",
      },
      {
        key: "manaRegen",
        label: "Mana Regen",
        min: 0,
        max: 10000,
        step: 10,
        precision: 0,
        tooltip: "Mana regenerated per second",
      },
    ],
  },
  {
    title: "Skill Settings",
    fields: [
      {
        key: "baseCost",
        label: "Gem Base Cost",
        min: 0,
        max: 1000,
        step: 1,
        precision: 0,
      },
      {
        key: "costMultiplier",
        label: "Cost Multiplier",
        min: 0.1,
        max: 5,
        step: 0.0001,
        precision: 4,
      },
      {
        key: "extraCostPercent",
        label: "Extra Cost %",
        min: 0,
        max: 1,
        step: 0.01,
        precision: 2,
        tooltip: "Extra cost (% max mana), e.g. Archmage support",
      },
      {
        key: "incCostPercent",
        label: "Increased Cost %",
        min: 0,
        max: 500,
        step: 1,
        precision: 0,
      },
      {
        key: "moreLessCost",
        label: "More/Less Cost Multiplier",
        min: 0,
        max: 2,
        step: 0.01,
        precision: 2,
      },
      {
        key: "castPerSecond",
        label: "Casts per Second",
        min: 0.1,
        max: 20,
        step: 0.1,
        precision: 1,
      },
    ],
  },
  {
    title: "Indigon Settings",
    fields: [
      {
        key: "dmgPer200",
        label: "Damage % per 200 Mana",
        min: 0,
        max: 500,
        step: 1,
        precision: 0,
      },
      {
        key: "costIncPer200",
        label: "Cost % Increase per 200 Mana",
        min: 0,
        max: 500,
        step: 1,
        precision: 0,
      },
    ],
  },
];
