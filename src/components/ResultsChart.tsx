import { Paper, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";

export default function ResultsChart() {
  const mockData = [
    { time: "0", mana: 6000, damage: 0 },
    { time: "1", mana: 5800, damage: 35 },
    { time: "2", mana: 5600, damage: 70 },
    // Mock more data as desired...
  ];

  return (
    <Paper shadow="sm" radius="md" p="lg">
      <Text size="lg" fw={600} mb="md">
        Simulation Results (Mock)
      </Text>
      <LineChart
        h={400}
        data={mockData}
        dataKey="time"
        series={[
          { name: "mana", color: "green" },
          { name: "damage", color: "indigo" },
        ]}
        curveType="natural"
      />
    </Paper>
  );
}
