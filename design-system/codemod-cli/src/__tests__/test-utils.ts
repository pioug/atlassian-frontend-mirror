/* eslint-disable no-console */
export async function withMockedConsoleWarn(fn: any) {
  const originalWarn = console.warn;
  const warn = jest.fn();
  console.warn = warn;

  await fn(warn);

  console.warn = originalWarn;
}
/* eslint-enable no-console */
