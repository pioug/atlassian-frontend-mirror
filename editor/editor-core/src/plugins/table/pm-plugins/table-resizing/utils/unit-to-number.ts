export const unitToNumber = (unit: string | null): number =>
  unit ? parseInt(unit, 10) : 0;
