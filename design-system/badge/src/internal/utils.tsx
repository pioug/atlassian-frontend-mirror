function getSafeValue(value: string | number = 0) {
  if (value < 0) {
    return 0;
  }

  return value;
}

export function formatValue(value?: string | number, max?: string | number) {
  const safeValue = getSafeValue(value);
  const safeMax = getSafeValue(max);

  if (safeMax && safeMax < safeValue) {
    return `${safeMax}+`;
  }

  if (safeValue === Infinity) {
    return '∞';
  }

  return safeValue.toString();
}
