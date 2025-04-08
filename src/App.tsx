import { Container, Grid, Title, Paper, Flex } from "@mantine/core";
import { IndigonForm } from "./components/IndigonForm";
import { SimulationResults } from "./components/SimulationResults";
import { Recommendations } from "./components/Recommendations";

function App() {
  return (
    <Container fluid py="md">
      <Title ta="center" mb="lg">
        Indigon Spell Simulator
      </Title>
      <Title order={3} ta="center" mb="xl">
        Simulate your Indigon ramping in Poe2.
      </Title>

      <Grid gutter="lg" align="stretch">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="xs" radius="md" p="md" h="100%">
            <IndigonForm />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Flex direction="column" gap="md" h="100%">
            <Paper
              shadow="xs"
              radius="md"
              p="md"
              style={{ flexGrow: 1, overflow: "hidden" }}
            >
              <SimulationResults />
            </Paper>
            <Paper shadow="xs" radius="md" p="md" style={{ height: 150 }}>
              <Recommendations />
            </Paper>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
