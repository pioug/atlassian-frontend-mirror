export const TESTS_MODE = process?.env?.NODE_ENV === 'test' ?? false;

const DEBUG_MODE = !TESTS_MODE && process?.env?.NODE_ENV !== 'production';

export const debug = (...args: unknown[]) => {
  if (!DEBUG_MODE) {
    return;
  }

  // eslint-disable-next-line no-console
  console.debug(...args);
};
