import { Paper, Text, Box } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useElementSize } from "@mantine/hooks";

export function ResultsChart() {
  const mockData = [
    { time: "0", mana: 6000, damage: 0 },
    { time: "1", mana: 5800, damage: 35 },
    { time: "2", mana: 5600, damage: 70 },
    // More mock data if desired...
  ];

  const { ref, height } = useElementSize();

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="lg"
      h="100%"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Text size="lg" fw={600} mb="md">
        Simulation Results (Mock)
      </Text>

      <Box ref={ref} style={{ flexGrow: 1 }}>
        {height > 0 && (
          <LineChart
            h={height}
            data={mockData}
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
