import type { ThemeModes } from '@atlaskit/theme/types';

// These are duplicates of colors imports -
// Not bringing in colors to reduce dependency on theme
// These values are enforced via unit tests
const DN30 = '#1B2638';
const N0 = '#FFFFFF';

const themedBackground = { light: N0, dark: DN30 } as const;
export const getBackground = (mode: ThemeModes = 'light') =>
  themedBackground[mode];
