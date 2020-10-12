/**
 * Creates a function that "collects" and returns values !== undefined,
 * falls back to default value for subsequent calls after first value === undefined
 */
export function createCollector() {
  let keepCollecting = true;

  return <T, D extends T>(nextResult: T | undefined, defaultValue: D): T => {
    if (keepCollecting && nextResult !== undefined) {
      return nextResult;
    }
    keepCollecting = false;
    return defaultValue;
  };
}
