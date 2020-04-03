export function hasValue(str?: string): boolean {
  return !!str && str.length > 0;
}

export function determineMode(input: unknown): 'dark' | 'light' {
  switch (input) {
    case 'dark':
    case 'light':
      return input;
    case null:
      return 'light';
    default:
      throw new Error(
        `Could not determine mode for input ${JSON.stringify(input)}`,
      );
  }
}

export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';
export const IS_DUMMY = !window.webkit && !window.promiseBridge;
export const IS_ATLASKIT = typeof WEBSITE_ENV === 'string';
