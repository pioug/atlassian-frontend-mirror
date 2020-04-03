export function getCSSUnitValue(value: number | string): string {
  return typeof value === 'string' ? value : `${value}px`;
}
