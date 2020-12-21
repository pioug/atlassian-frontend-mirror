import { ThemeModes } from '@atlaskit/theme/types';

import { useMediaQueryMatcher } from './useMediaQueryMatcher';

export function useSystemTheme() {
  const result = useMediaQueryMatcher<ThemeModes>([
    { query: '(prefers-color-scheme: light)', value: 'light' },
    { query: '(prefers-color-scheme: dark)', value: 'dark' },
  ]);
  return result ? result : 'light';
}
