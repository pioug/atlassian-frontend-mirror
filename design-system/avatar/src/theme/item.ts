import { createTheme } from '@atlaskit/theme/components';

export interface ThemeItemTokens {
  backgroundColor: string;
}

export const ThemeItem = createTheme<ThemeItemTokens, {}>(() => {
  return {
    backgroundColor: '',
  };
});
