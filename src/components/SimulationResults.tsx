import { useState } from "react";
import { SegmentedControl, Box } from "@mantine/core";

import { ResultsChart } from "./ResultsChart";
import { ResultsTable } from "./ResultsTable";

export function SimulationResults() {
  const [view, setView] = useState("chart");

  return (
    <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <SegmentedControl
        value={view}
        onChange={setView}
        data={[
          { label: "Chart", value: "chart" },
          { label: "Table", value: "table" },
        ]}
        mb="sm"
      />
      <Box style={{ flexGrow: 1, overflow: "hidden" }}>
        {view === "chart" ? <ResultsChart /> : <ResultsTable />}
      </Box>
    </Box>
  );
}
