import { Container, Grid, Title, Paper, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IndigonForm } from "./components/IndigonForm";
import { SimulationResults } from "./components/SimulationResults";

import { formGroups, CombinedSettings } from "./config/formConfig";

function App() {
  const initialValues = {
    server: { tickInterval: 0.033, duration: 20 },
    player: { manaMax: 6000, manaRegen: 3400 },
    skill: {
      baseCost: 72,
      costMultiplier: 1.3799,
      extraCostPercent: 0,
      incCostPercent: 10,
      moreLessCost: 0.7,
      castPerSecond: 5,
    },
    indigon: { dmgPer200: 35, costIncPer200: 35 },
  };

  const form = useForm<CombinedSettings>({
    initialValues,
    validate: Object.fromEntries(
      formGroups.flatMap((group) =>
        group.fields.map((field) => [
          field.key,
          (val: number) => {
            const { min, max, label } = field;
            if (min !== undefined && val < min)
              return `${label} must be ≥ ${min}`;
            if (max !== undefined && val > max)
              return `${label} must be ≤ ${max}`;
            return null;
          },
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
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper shadow="xs" radius="md" p="md" h="100%">
            <IndigonForm form={form} />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Flex direction="column" gap="md" h="100%">
            <Paper
              shadow="xs"
              radius="md"
              p="md"
              style={{ flexGrow: 1, overflow: "hidden" }}
            >
              <SimulationResults config={form.values} />
            </Paper>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
