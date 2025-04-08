import { Table, ScrollArea, Paper } from "@mantine/core";

interface SimulationResult {
  time: number[];
  spellDmg: number[];
  manaLeft: number[];
  manaCost: number[];
}

interface ResultsTableProps {
  results?: SimulationResult;
}

export function ResultsTable({ results }: ResultsTableProps) {
  // Mock results if none provided
  const mockResults: SimulationResult = {
    time: [0, 0.033, 0.066, 0.099],
    spellDmg: [0, 35, 70, 105],
    manaLeft: [6000, 5900, 5800, 5700],
    manaCost: [100, 100, 100, 100],
  };

  const data = results || mockResults;

  const rows = data.time.map((time, idx) => (
    <Table.Tr key={time}>
      <Table.Td>{time.toFixed(3)}</Table.Td>
      <Table.Td>{data.spellDmg[idx]}</Table.Td>
      <Table.Td>{data.manaLeft[idx]}</Table.Td>
      <Table.Td>{data.manaCost[idx]}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="xs" radius="md" withBorder>
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
