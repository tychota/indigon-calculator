import { Paper, Text, Box } from "@mantine/core";
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from "recharts";
import { useElementSize } from "@mantine/hooks";
import type { SimulationResult, CastDelay } from "../logic/simulate"; // adjust import if needed

interface ChartDataPoint {
  time: number;
  mana: number;
  damage: number;
  missed: boolean;
  delayArea?: number | null; // new field: value only if tick is within a delay region.
}

interface ResultsChartProps {
  results: SimulationResult;
}

/**
 * Given a list of delay regions (each with x1, x2) and a time value,
 * returns true if time is within any delay region.
 */
const isInDelayRegion = (t: number, delayRegions: { x1: number; x2: number }[]): boolean => {
  return delayRegions.some((region) => t >= region.x1 && t <= region.x2);
};

/**
 * Compute delay regions from castDelays.
 * Each region is defined by: x1 = ideal cast time, x2 = actual cast time.
 */
const computeDelayRegions = (delays: CastDelay[]) =>
  delays.filter((d) => d.actual > d.ideal).map((d) => ({ x1: d.ideal, x2: d.actual }));

export function ResultsChart({ results }: ResultsChartProps) {
  const { ref, height } = useElementSize();

  // Prepare per-tick chart data
  const baseData: ChartDataPoint[] = results.time.map((t, idx) => ({
    time: t,
    mana: results.manaLeft[idx],
    damage: results.spellDmg[idx],
    missed: results.missedCast[idx],
  }));

  // Compute delay regions from castDelays.
  const delayRegions = computeDelayRegions(results.castDelays);

  // Extend each data point: if its time is within any delay region then set delayArea to a value,
  // e.g. the damage value (so the area overlays the damage curve). Otherwise, leave it null.
  const chartData: ChartDataPoint[] = baseData.map((d) => ({
    ...d,
    delayArea: isInDelayRegion(d.time, delayRegions) ? d.damage : null,
  }));

  // For vertical lines: use castEvents actual times.
  const verticalLines = results.castEvents.map((ce) => ce.actual);

  return (
    <Paper shadow="sm" radius="md" p="lg" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Text size="lg" fw={600} mb="md">
        Simulation Results
      </Text>
      <Box ref={ref} style={{ flexGrow: 1, minHeight: "330px" }}>
        {height > 0 && (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={chartData}>
              <XAxis dataKey="time" type="number" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mana" stroke="#1E71A7" dot={false} name="Mana" />
              <Line type="monotone" dataKey="damage" stroke="#337128" dot={false} name="Damage" />

              {/* Render delay area as an Area chart. This series will appear in the legend. */}
              <Area
                type="monotone"
                dataKey="delayArea"
                name="Delayed Cast"
                stroke="red"
                fill="red"
                fillOpacity={0.1}
                dot={false}
                activeDot={false}
              />

              {/* Faint vertical reference lines at each actual cast time */}
              {verticalLines.map((xVal, index) => (
                <ReferenceLine key={index} x={xVal} stroke="#000" strokeOpacity={0.1} strokeDasharray="3 3" />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
}
