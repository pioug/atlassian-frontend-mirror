import { percentile } from './percentile';

export const outlier = (
  input: number[],
  factor: number,
): number | undefined => {
  const q1 = percentile(input, 0.25);
  const q3 = percentile(input, 0.75);

  if (typeof q1 === 'undefined' || typeof q3 === 'undefined') {
    return;
  }

  const iqr = q3 - q1;
  return q3 + iqr * factor;
};
