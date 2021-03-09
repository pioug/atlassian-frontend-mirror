export const handleError = function (
  name: string,
  description?: string,
  rawError?: Error,
): void {
  const stackTrace = (rawError && rawError.stack) || '';
  const descr = description || '';
  const errorMessage = `${name}: ${descr} \n ${stackTrace}`;

  // eslint-disable-next-line no-console
  console.error(errorMessage);
};
