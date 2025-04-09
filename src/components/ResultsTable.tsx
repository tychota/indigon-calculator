import { useMemo } from "react";
import { type MRT_ColumnDef, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Paper, Text, Box } from "@mantine/core";

import type { SimulationResult } from "../logic/simulate";

interface TableRow {
  time: number;
  spellDmg: number;
  manaLeft: number;
  manaCost: number;
}

interface ResultsTableProps {
  results: SimulationResult;
}

export function ResultsTable({ results }: ResultsTableProps) {
  // 📦 Transform SimulationResult into row-based data
  const tableData: TableRow[] = useMemo(() => {
    return results.time.map((time, idx) => ({
      time,
      spellDmg: results.spellDmg[idx],
      manaLeft: results.manaLeft[idx],
      manaCost: results.manaCost[idx],
    }));
  }, [results]);

  // 📏 Define columns
  const columns = useMemo<MRT_ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "time",
        header: "Time (s)",
        Cell: ({ cell }) => cell.getValue<number>().toFixed(3),
      },
      {
        accessorKey: "spellDmg",
        header: "Spell Dmg %",
      },
      {
        accessorKey: "manaLeft",
        header: "Mana Left",
      },
      {
        accessorKey: "manaCost",
        header: "Mana Cost",
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: tableData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableRowNumbers: false,
    enableDensityToggle: false,
    enableRowVirtualization: true, // ⚡ virtualized rows
    layoutMode: "grid",
    mantineTableContainerProps: { style: { maxHeight: 410 } },
    mantineTableProps: {
      striped: "odd",
      withRowBorders: true,
      withColumnBorders: true,
      withTableBorder: false,
    },
  });

  return (
    <Paper shadow="sm" radius="md" p="lg" h="100%" style={{ display: "flex", flexDirection: "column" }}>
      <Text size="lg" fw={600} mb="md">
        Simulation Results
      </Text>
      <Box style={{ flexGrow: 1 }}>
        <MantineReactTable table={table} />
      </Box>
    </Paper>
  );
}
