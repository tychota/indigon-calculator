import { Paper, TextInput, Grid, Tooltip } from "@mantine/core";

export default function SimulationInput() {
  const fields = [
    {
      label: "Tick Interval",
      placeholder: "0.033",
      tooltip: "Server tick rate",
    },
    {
      label: "Duration",
      placeholder: "20",
      tooltip: "Total simulation duration",
    },
    { label: "Mana Max", placeholder: "6000", tooltip: "Maximum player mana" },
    {
      label: "Mana Regen",
      placeholder: "3400",
      tooltip: "Mana regenerated per second",
    },
  ];

  return (
    <Paper shadow="sm" radius="md" p="lg">
      <Grid>
        {fields.map((field) => (
          <Grid.Col span={{ base: 12, md: 6 }} key={field.label}>
            <Tooltip label={field.tooltip}>
              <TextInput label={field.label} placeholder={field.placeholder} />
            </Tooltip>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
}
