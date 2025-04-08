import { Paper, Text, Box } from "@mantine/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useElementSize } from "@mantine/hooks";
import type { SimulationResult, CastDelay } from "../logic/simulate";

interface ChartDataPoint {
  time: number;
  mana: number;
  damage: number;
  // We can also mark ticks with delayed cast if desired.
  missed: boolean;
}

interface ResultsChartProps {
  results: SimulationResult;
}

// Helper: using castDelays to compute delay regions.
// Each region: x1 = ideal cast time, x2 = actual cast time.
const computeDelayRegions = (delays: CastDelay[]) =>
  delays
    .filter((d) => d.actual > d.ideal)
    .map((d) => ({ x1: d.ideal, x2: d.actual }));

export function ResultsChart({ results }: ResultsChartProps) {
  const { ref, height } = useElementSize();

  // Prepare per-tick chart data
  const chartData: ChartDataPoint[] = results.time.map((t, idx) => ({
    time: t,
    mana: results.manaLeft[idx],
    damage: results.spellDmg[idx],
    missed: results.missedCast[idx],
  }));

  // Compute delay regions from castDelays.
  const delayRegions = computeDelayRegions(results.castDelays);

  // For faint vertical lines, we use the actual cast times from results.castEvents
  const verticalLines = results.castEvents.map((ce) => ce.actual);

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="lg"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Text size="lg" fw={600} mb="md">
        Simulation Results
      </Text>
      <Box ref={ref} style={{ flexGrow: 1 }}>
        {height > 0 && (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" type="number" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="mana"
                stroke="#00a000"
                dot={false}
                name="Mana"
              />
              <Line
                type="monotone"
                dataKey="damage"
                stroke="#4b0082"
                dot={false}
                name="Damage"
              />

              {verticalLines.map((xVal, index) => (
                <ReferenceLine
                  key={index}
                  x={xVal}
                  stroke="#000"
                  strokeOpacity={0.1}
                  // e.g. make them dashed
                  strokeDasharray="3 3"
                />
              ))}

              {/* Render a ReferenceArea for every delayed cast */}
              {delayRegions.map((region, index) => (
                <ReferenceArea
                  key={index}
                  x1={region.x1}
                  x2={region.x2}
                  stroke="red"
                  strokeOpacity={0.1}
                  fill="red"
                  fillOpacity={0.1}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
}
