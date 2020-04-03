export const percentile = (
  input: number[],
  fraction: number,
): number | undefined => {
  const sorted = input.sort((a, b) => a - b);
  const position = sorted.length * fraction;
  const base = Math.floor(position);
  const rest = position - base;

  if (rest > 0) {
    return sorted[base];
  }

  const item = sorted[base - 1];
  const next = sorted[base];

  if (typeof item !== 'undefined' && typeof next !== 'undefined') {
    return (item + next) / 2;
  }
};
