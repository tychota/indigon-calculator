import {
  Paper,
  NumberInput,
  Tooltip,
  Stack,
  Title,
  SimpleGrid,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

import { CombinedSettings, formGroups } from "../config/formConfig";

type Form = UseFormReturnType<CombinedSettings>;

export function IndigonForm({ form }: { form: Form }) {
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
