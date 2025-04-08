import { Alert, Text } from "@mantine/core";

export function Recommendations() {
  // Mock condition; replace with your simulation result logic later.
  const indigonIsWorking = false;

  return (
    <>
      {!indigonIsWorking ? (
        <Alert color="red" title="Indigon is not ramping" h="100%">
          <Text size="sm">
            Your mana spending is too low to trigger Indigon’s increased damage
            effect. Consider raising your mana cost, cast rate, or mana
            regeneration.
          </Text>
        </Alert>
      ) : (
        <Alert color="green" title="Indigon is working great!" h="100%">
          <Text size="sm">
            Your current mana spending efficiently triggers Indigon’s increased
            damage bonus.
          </Text>
        </Alert>
      )}
    </>
  );
}
