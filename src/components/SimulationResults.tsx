import { useState, useEffect } from "react";
import { SegmentedControl, Box } from "@mantine/core";
import { ResultsChart } from "./ResultsChart";
import { ResultsTable } from "./ResultsTable";
import SimulationWorker from "../workers/simulationWorker?worker";
import type { SimulationResult } from "../logic/simulation";

interface Config {
  tickInterval: number;
  duration: number;
  manaMax: number;
  manaRegen: number;
  baseCost: number;
  costMultiplier: number;
  extraCostPercent: number;
  incCostPercent: number;
  moreLessCost: number;
  castPerSecond: number;
  dmgPer200: number;
  costIncPer200: number;
}

export function SimulationResults({ config }: { config: Config }) {
  const [view, setView] = useState("chart");
  const [results, setResults] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const worker = new SimulationWorker();
    worker.postMessage(config);
    worker.onmessage = (event: MessageEvent<SimulationResult>) => {
      setResults(event.data);
    };
    return () => worker.terminate();
  }, [config]);

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
        {view === "chart" ? (
          <ResultsChart results={results} />
        ) : (
          <ResultsTable results={results} />
        )}
      </Box>
    </Box>
  );
}
