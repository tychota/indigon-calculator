import { Alert, Text, Flex, Divider } from "@mantine/core";
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

      {/* Then a structured layout for the key stats */}
      <Flex gap="md" justify="space-between" wrap="wrap">
        {/* Ramp time & Max bonus */}
        <Text size="sm">
          <b>Ramp Time:</b> {rampTime.toFixed(2)}s
        </Text>
        <Text size="sm">
          <b>Miss Rate:</b> {missRate.toFixed(2)}%
        </Text>
      </Flex>

      <Flex gap="md" justify="space-between" wrap="wrap" mt="xs">
        {/* Miss Rate & Adjusted Cast Rate */}
        <Text size="sm">
          <b>Max Indigon Bonus:</b> {maxSpellDmg}%
        </Text>
        <Text size="sm">
          <b>Effective Cast Rate:</b> {adjustedCastRate.toFixed(2)}%
        </Text>
      </Flex>

      <Flex gap="md" justify="space-between" wrap="wrap" mt="xs">
        <Text size="sm"> </Text>
        <Text size="sm">
          <b>Estimated Sustained Bonus:</b> {estimatedSustainedDmg}%
        </Text>
      </Flex>
    </Alert>
  );
}
