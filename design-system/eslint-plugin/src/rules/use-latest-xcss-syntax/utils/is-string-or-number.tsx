export const isStringOrNumber = (
  value: string | number | bigint | true | RegExp | undefined,
): value is string | number => {
  return typeof value === 'string' || typeof value === 'number';
};
