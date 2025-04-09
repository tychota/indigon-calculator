import { Container, Grid, Title, Paper, Flex, Anchor, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { IndigonForm } from "./components/IndigonForm";
import { SimulationResults } from "./components/SimulationResults";

import { formGroups, CombinedSettings } from "./config/formConfig";
import { useEffect } from "react";

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);

function Header() {
  return (
    <Group gap="xs" style={{ position: "absolute", top: 10, right: 10 }}>
      <Anchor
        href="https://github.com/tychota/indigon-calculator"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", gap: 5 }}
      >
        <GithubIcon />
        <Text size="xs">by TychoTa</Text>
      </Anchor>
    </Group>
  );
}

function App() {
  const initialValues = {
    server: { tickInterval: 0.033, duration: 40 },
    player: { manaMax: 6000, manaRegen: 3400 },
    skill: {
      baseCost: 72,
      costMultiplier: 1.3799,
      extraCostPercent: 0,
      incCostPercent: 10,
      moreLessCost: 0.7,
      castPerSecond: 5,
    },
    indigon: { dmgPer200: 33, costIncPer200: 42 },
  };

  const form = useForm<CombinedSettings>({
    initialValues,
    validate: Object.fromEntries(
      formGroups.flatMap((group) =>
        group.fields.map((field) => [
          field.key,
          (val: number) => {
            const { min, max, label } = field;
            if (min !== undefined && val < min) return `${label} must be ≥ ${min}`;
            if (max !== undefined && val > max) return `${label} must be ≤ ${max}`;
            return null;
          },
        ]),
      ),
    ),
    onValuesChange: (values) => {
      window.localStorage.setItem("form", JSON.stringify(values));
    },
  });

  useEffect(() => {
    const storedValue = window.localStorage.getItem("form");
    if (storedValue) {
      try {
        form.setValues(JSON.parse(window.localStorage.getItem("form")!));
      } catch {
        console.log("Failed to parse stored value");
      }
    }
  }, []);

  return (
    <Container fluid py="md">
      <Header />
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
            <Paper shadow="xs" radius="md" p="md" style={{ flexGrow: 1, overflow: "hidden" }}>
              <SimulationResults config={form.values} />
            </Paper>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
