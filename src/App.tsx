import { Container, Grid, Title, Paper, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IndigonForm } from "./components/IndigonForm";
import { SimulationResults } from "./components/SimulationResults";
import { Recommendations } from "./components/Recommendations";

import { formGroups } from "./config/formConfig";

function App() {
  const initialValues = {
    tickInterval: 0.033,
    duration: 20,
    manaMax: 6000,
    manaRegen: 3400,
    baseCost: 72,
    costMultiplier: 1.3799,
    extraCostPercent: 0,
    incCostPercent: 10,
    moreLessCost: 0.7,
    castPerSecond: 5,
    dmgPer200: 35,
    costIncPer200: 35,
  };

  const form = useForm({
    initialValues,
    validate: Object.fromEntries(
      formGroups.flatMap((group) =>
        group.fields.map((field) => [
          field.key,
          (val: number) =>
            (field.min !== undefined && val < field.min) ||
            (field.max !== undefined && val > field.max)
              ? `${field.label} must be between ${field.min} and ${field.max}`
              : null,
        ])
      )
    ),
  });

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
            <IndigonForm form={form} />
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
              <SimulationResults config={form.values} />
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
