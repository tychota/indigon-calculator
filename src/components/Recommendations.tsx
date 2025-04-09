import { Alert, Text, Flex, Divider, Tooltip } from "@mantine/core";
import type { SimulationAnalysis } from "../logic/analyze";

export function Recommendations({ analysis }: { analysis: SimulationAnalysis }) {
  const colorMap = {
    red: "red",
    warning: "yellow",
    perfect: "green",
    other: "blue",
  } as const;

  const { rampTime, maxSpellDmg, missRate, adjustedCastRate, estimatedSustainedDmg, additionalNote } = analysis.details;

  return (
    <Alert color={colorMap[analysis.status] || "blue"} title="Advices">
      {/* A short overall message */}
      <Text size="sm">{analysis.message}</Text>

      {/* An optional note about cast speeds, etc. */}
      <Text size="xs" mt="xs" color="dimmed">
        {additionalNote}
      </Text>

      <Divider my="sm" />

      <Flex gap="md" direction="column">
        <Flex justify="space-between" wrap="wrap">
          <Tooltip label="Time needed to reach the maximum Indigon bonus" withArrow>
            <Text size="sm">
              <b>Ramp Time:</b> {rampTime.toFixed(2)}s
            </Text>
          </Tooltip>
          <Tooltip
            label="The percentage of expected casts missed after reaching maximum ramp (lower is better)"
            withArrow
          >
            <Text size="sm">
              <b>Miss Rate:</b> {missRate.toFixed(2)}%
            </Text>
          </Tooltip>
        </Flex>

        <Flex justify="space-between" wrap="wrap" mt="xs">
          <Tooltip label="Highest bonus achieved during the simulation" withArrow>
            <Text size="sm">
              <b>Max Indigon Bonus:</b> {maxSpellDmg}%
            </Text>
          </Tooltip>
          <Tooltip label="Effective cast rate, calculated as 100 - Miss Rate" withArrow>
            <Text size="sm">
              <b>Effective Cast Rate:</b> {adjustedCastRate.toFixed(2)}%
            </Text>
          </Tooltip>
        </Flex>

        {/* A note about the estimated sustained bonus */}
        <Flex justify="space-between" wrap="wrap" mt="xs">
          <Text size="sm" mt="xs"></Text>
          <Tooltip
            label="Estimated sustained bonus computed as Max Bonus multiplied by Effective Cast Rate divided by 100"
            withArrow
          >
            <Text size="sm">
              <b>Estimated Sustained Bonus:</b> {estimatedSustainedDmg}%
            </Text>
          </Tooltip>
        </Flex>

        <Divider my="sm" />
      </Flex>
    </Alert>
  );
}
