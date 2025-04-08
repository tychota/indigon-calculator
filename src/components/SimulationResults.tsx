import { useState, useEffect } from "react";
import { SegmentedControl, Box } from "@mantine/core";

import { ResultsChart } from "./ResultsChart";
import { ResultsTable } from "./ResultsTable";

import SimulationWorker from "../workers/simulationWorker?worker";

import { CombinedSettings } from "../config/formConfig";

import type { SimulationResult } from "../logic/simulate";
import { analyzeSimulation, SimulationAnalysis } from "../logic/analyze";
import { Recommendations } from "./Recommendations";

export function SimulationResults({ config }: { config: CombinedSettings }) {
  const [view, setView] = useState("chart");
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [analysis, setAnalysis] = useState<SimulationAnalysis | null>(null);

  useEffect(() => {
    const worker = new SimulationWorker();
    worker.postMessage(config);
    worker.onmessage = (event: MessageEvent<SimulationResult>) => {
      const simResult = event.data;
      setResults(simResult);
      setAnalysis(analyzeSimulation(simResult));
    };
    return () => worker.terminate();
  }, [config]);

  if (!results || !analysis) {
    return (
      <Box
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>Waiting for data...</div>
      </Box>
    );
  }

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
      <Recommendations analysis={analysis} />
    </Box>
  );
}
