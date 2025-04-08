import {
  Paper,
  NumberInput,
  Tooltip,
  Stack,
  Title,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { formGroups } from "../config/formConfig";

export function IndigonForm() {
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
    <Stack>
      {formGroups.map((group) => (
        <Paper key={group.title} shadow="xs" radius="md" p="md">
          <Title order={4} mb="lg">
            {group.title}
          </Title>
          <SimpleGrid cols={2} spacing="md">
            {group.fields.map((field) => (
              <Tooltip
                key={field.key}
                label={field.tooltip || ""}
                disabled={!field.tooltip}
              >
                <NumberInput
                  size="sm"
                  label={field.label}
                  {...form.getInputProps(field.key)}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  decimalScale={field.precision}
                  error={form.errors[field.key]}
                />
              </Tooltip>
            ))}
          </SimpleGrid>
        </Paper>
      ))}
    </Stack>
  );
}
