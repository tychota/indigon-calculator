import { Paper, Text, Box } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useElementSize } from "@mantine/hooks";
import type { SimulationResult } from "../logic/simulation";

interface ResultsChartProps {
  results: SimulationResult;
}

export function ResultsChart({ results }: ResultsChartProps) {
  const { ref, height } = useElementSize();

  const chartData = results.time.map((t, idx) => ({
    time: t.toFixed(2),
    mana: results.manaLeft[idx],
    damage: results.spellDmg[idx],
  }));

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="lg"
      h="100%"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Text size="lg" fw={600} mb="md">
        Simulation Results
      </Text>

      <Box ref={ref} style={{ flexGrow: 1 }}>
        {height > 0 && results && (
          <LineChart
            h={height}
            data={chartData}
            dataKey="time"
            series={[
              { name: "mana", color: "green" },
              { name: "damage", color: "indigo" },
            ]}
            curveType="natural"
          />
        )}
      </Box>
    </Paper>
  );
}
