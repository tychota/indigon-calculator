import { Paper, NumberInput, Tooltip, Stack, Title, SimpleGrid, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

import { CombinedSettings, formGroups } from "../config/formConfig";

type Form = UseFormReturnType<CombinedSettings>;

export function IndigonForm({ form }: { form: Form }) {
  return (
    <Stack>
      {formGroups.map((group) => {
        // Check if this is the Indigon Settings group.
        const isIndigonGroup = group.title === "Indigon Settings";
        // For the indigon group, retrieve the current values.
        const dmgValue = isIndigonGroup ? form.values.indigon.dmgPer200 : undefined;
        const costValue = isIndigonGroup ? form.values.indigon.costIncPer200 : undefined;
        // Determine if the current value is outside the normal range (35 to 50)
        const requiresCorruption =
          isIndigonGroup &&
          ((dmgValue !== undefined && (dmgValue < 35 || dmgValue > 50)) ||
            (costValue !== undefined && (costValue < 35 || costValue > 50)));

        return (
          <Paper
            key={group.title}
            shadow="xs"
            radius="md"
            p="md"
            // Use orange tint if values are outside the normal range.
            style={{
              backgroundColor: requiresCorruption ? "#fff3e0" : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 30,
                marginBottom: "0",
              }}
            >
              <Title order={4} mb="lg">
                {group.title}
              </Title>
              {requiresCorruption && (
                <Text c="orange" size="xs" mb="lg">
                  Such values require corrupted indigon.
                </Text>
              )}
            </div>
            <SimpleGrid cols={2} spacing="md">
              {group.fields.map((field) => (
                <Tooltip key={field.key} label={field.tooltip || ""} disabled={!field.tooltip}>
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
        );
      })}
    </Stack>
  );
}
