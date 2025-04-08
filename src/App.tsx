import { Container, Title, Stack } from "@mantine/core";
import SimulationInput from "./components/SimulationInput";
import ResultsChart from "./components/ResultsChart";

export default function App() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg" ta="center">
        Indigon Spell Simulator
      </Title>

      <Stack>
        <SimulationInput />
        <ResultsChart />
      </Stack>
    </Container>
  );
}
