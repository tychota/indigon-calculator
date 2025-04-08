// IndigonSimulator.tsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Grid,
  Input,
  Container,
  VStack,
  Text,
  HStack,
  Center,
} from "@chakra-ui/react";
import { Table } from "@chakra-ui/react";
import { Provider } from "./components/ui/provider";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Types
interface ServerSettings {
  tickInterval: number;
  duration: number;
}

interface PlayerSettings {
  manaMax: number;
  manaRegen: number;
}

interface SkillSettings {
  baseCost: number;
  costMultiplier: number;
  extraCostPercent: number;
  incCostPercent: number;
  moreLessCost: number;
  castPerSecond: number;
}

interface IndigonSettings {
  dmgPer200: number;
  costIncPer200: number;
}

interface CombinedSettings {
  server: ServerSettings;
  player: PlayerSettings;
  skill: SkillSettings;
  indigon: IndigonSettings;
}

interface ManaEvent {
  time: number;
  cost: number;
}

interface SimulationResult {
  time: number[];
  spellDmg: number[];
  manaLeft: number[];
  manaCost: number[];
}

const simulateIndigon = (config: CombinedSettings): SimulationResult => {
  const { server, player, skill, indigon } = config;
  const tickCount = Math.floor(server.duration / server.tickInterval);
  const result: SimulationResult = {
    time: [],
    spellDmg: [],
    manaLeft: [],
    manaCost: [],
  };

  let mana = player.manaMax;
  let timeline: ManaEvent[] = [];

  for (let i = 0; i <= tickCount; i++) {
    const t = parseFloat((i * server.tickInterval).toFixed(3));

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

    mana += player.manaRegen * server.tickInterval;
    if (mana > player.manaMax) mana = player.manaMax;

    result.time.push(t);
    result.spellDmg.push(
      Math.floor(Math.floor(recentSpent / 200) * indigon.dmgPer200)
    );
    result.manaLeft.push(Math.round(mana));
    result.manaCost.push(roundedCost);
  }

  return result;
};

const IndigonSimulator: React.FC = () => {
  const [config, setConfig] = useState<CombinedSettings>({
    server: { tickInterval: 0.033, duration: 20 },
    player: { manaMax: 6000, manaRegen: 3400 },
    skill: {
      baseCost: 72,
      costMultiplier: 1.3799,
      extraCostPercent: 0,
      incCostPercent: 10,
      moreLessCost: 0.7,
      castPerSecond: 5,
    },
    indigon: { dmgPer200: 35, costIncPer200: 35 },
  });

  const result = simulateIndigon(config);

  const chartData = {
    labels: result.time,
    datasets: [
      {
        label: "% Spell Damage",
        data: result.spellDmg,
        fill: false,
        borderColor: "#4F46E5",
        tension: 0.1,
      },
      {
        label: "Mana Left",
        data: result.manaLeft,
        fill: false,
        borderColor: "#10B981",
        tension: 0.1,
      },
    ],
  };

  const renderInputs = <T extends object>(
    group: T,
    groupKey: keyof CombinedSettings
  ) => (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={6}>
      <Heading as="h3" size="md" mb={4} textTransform="capitalize">
        {String(groupKey)} Settings
      </Heading>
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
        {Object.entries(group).map(([key, val]) => (
          <Box key={key} mb={3}>
            <Text fontSize="sm" mb={1} fontWeight="semibold">
              {key.replace(/([A-Z])/g, " $1")}
            </Text>
            <Input
              type="number"
              value={val}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  [groupKey]: {
                    ...prev[groupKey],
                    [key]: parseFloat(e.target.value),
                  },
                }))
              }
            />
            {key === "extraCostPercent" && groupKey === "skill" && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Extra cost (% of max mana), e.g., Archmage support
              </Text>
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Provider>
      <Container maxW="12xl" py={8}>
        <Center mb={10}>
          <Heading as="h1" size="2xl">
            Indigon Spell Simulator
          </Heading>
        </Center>
        <HStack align="start" justify="center" flexWrap="wrap">
          <VStack align="stretch" flex="1" minW="400px" gap={4}>
            {renderInputs(config.server, "server")}
            {renderInputs(config.player, "player")}
            {renderInputs(config.skill, "skill")}
            {renderInputs(config.indigon, "indigon")}
          </VStack>

          <VStack align="stretch" flex="2" minW="800px" gap={15} marginLeft="8">
            <Box>
              <Line
                data={chartData}
                width={800}
                height={600}
                options={{ maintainAspectRatio: false }}
              />
            </Box>
            <Box maxH="300px" overflowY="auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 1,
                      }}
                    >
                      Time (s)
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 1,
                      }}
                    >
                      Spell Dmg %
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 1,
                      }}
                    >
                      Mana Left
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 1,
                      }}
                    >
                      Cost
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {result.time.map((t, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{t.toFixed(2)}</Table.Cell>
                      <Table.Cell>{result.spellDmg[idx]}</Table.Cell>
                      <Table.Cell>{result.manaLeft[idx]}</Table.Cell>
                      <Table.Cell>{result.manaCost[idx]}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </VStack>
        </HStack>
      </Container>
    </Provider>
  );
};

export default IndigonSimulator;
