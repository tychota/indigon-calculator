import { Table, ScrollArea, Paper, Text } from "@mantine/core";
import type { SimulationResult } from "../logic/simulation";

interface ResultsTableProps {
  results?: SimulationResult | null;
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results) {
    return <Text>Waiting for data...</Text>;
  }

  const rows = results.time.map((time, idx) => (
    <Table.Tr key={time}>
      <Table.Td>{time.toFixed(3)}</Table.Td>
      <Table.Td>{results.spellDmg[idx]}</Table.Td>
      <Table.Td>{results.manaLeft[idx]}</Table.Td>
      <Table.Td>{results.manaCost[idx]}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="xs" radius="md" withBorder h="100%">
      <ScrollArea h="100%">
        <Table stickyHeader striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Time (s)</Table.Th>
              <Table.Th>Spell Dmg %</Table.Th>
              <Table.Th>Mana Left</Table.Th>
              <Table.Th>Mana Cost</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
