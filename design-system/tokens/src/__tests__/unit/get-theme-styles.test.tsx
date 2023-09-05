import __noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import getThemeStyles, { ThemeStyles } from '../../get-theme-styles';
import { ThemeOptionsSchema } from '../../theme-config';
import { hash } from '../../utils/hash';

const UNSAFE_themeOptions: ThemeOptionsSchema = {
  brandColor: '#ff0000',
};

const customStyleHashId = hash(JSON.stringify(UNSAFE_themeOptions));

jest.mock('@atlaskit/platform-feature-flags', () => ({
  getBooleanFF: jest.fn().mockImplementation(() => false),
}));

afterEach(() => {
  (getBooleanFF as jest.Mock).mockReset();
});

function getThemeData(themes: ThemeStyles[]) {
  return themes.reduce((acc: Omit<ThemeStyles, 'css'>[], { css, ...rest }) => {
    acc.push({ ...rest });
    return acc;
  }, []);
}

describe('getThemeStyles', () => {
  it('returns an array of ThemeStyles when given non-default theme state', async () => {
    let results = await getThemeStyles({
      light: 'legacy-light',
      spacing: 'spacing',
      typography: 'typography',
    });

    // Check that CSS is defined for each result
    results.forEach((result) => {
      expect(result.css).toBeDefined();
    });

    expect(getThemeData(results)).toEqual([
      { id: 'legacy-light', attrs: { 'data-theme': 'legacy-light' } },
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
      { id: 'typography', attrs: { 'data-theme': 'typography' } },
    ]);
  });

  it('returns an array of the default ThemeStyles when a theme state argument is not provided', async () => {
    let results = await getThemeStyles();

    // Check that CSS is defined for each result
    results.forEach((result) => {
      expect(result.css).toBeDefined();
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
    ]);
  });
  it('returns an array of ThemeStyles that includes custom themes when theme options provided', async () => {
    let results = await getThemeStyles({
      colorMode: 'auto',
      dark: 'dark',
      light: 'light',
      UNSAFE_themeOptions,
      spacing: 'spacing',
      typography: 'typography',
    });
    // Check that CSS is defined for each result
    results.forEach((result) => {
      expect(result.css).toBeDefined();
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
      { id: 'typography', attrs: { 'data-theme': 'typography' } },
      {
        id: 'light',
        attrs: {
          'data-theme': 'light',
          'data-custom-theme': customStyleHashId,
        },
      },
      {
        id: 'dark',
        attrs: { 'data-theme': 'dark', 'data-custom-theme': customStyleHashId },
      },
    ]);
  });

  it('returns an array of ThemeStyles that does not include custom themes when brand color is invalid', async () => {
    let results = await getThemeStyles({
      colorMode: 'auto',
      UNSAFE_themeOptions: {
        brandColor: '#ff00',
      },
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
    ]);
  });

  it('returns an array of ThemeStyles that includes `new-input-border` when the feature flag is enabled', async () => {
    (getBooleanFF as jest.Mock).mockImplementation(
      (name) => name === 'platform.design-system-team.border-checkbox_nyoiu',
    );

    let results = await getThemeStyles({
      colorMode: 'auto',
      dark: 'dark',
      light: 'light',
      spacing: 'spacing',
      typography: 'typography',
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
      { id: 'typography', attrs: { 'data-theme': 'typography' } },
      {
        id: 'dark-new-input-border',
        attrs: { 'data-theme': 'dark-new-input-border' },
      },
    ]);
  });

  it('returns a minimal set of ThemeStyles when auto switching is disabled', async () => {
    let results = await getThemeStyles({
      colorMode: 'light',
      dark: 'dark',
      light: 'light',
      spacing: 'spacing',
      typography: 'typography',
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
      { id: 'typography', attrs: { 'data-theme': 'typography' } },
    ]);
  });

  it('returns an array of ThemeStyles without duplicates', async () => {
    // prompt a duplication
    const results = await getThemeStyles({
      light: 'dark',
      dark: 'dark',
      spacing: 'spacing',
      typography: 'typography',
    });

    expect(getThemeData(results)).toEqual([
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
      { id: 'typography', attrs: { 'data-theme': 'typography' } },
    ]);
  });

  it('skips invalid themes when given invalid theme state', async () => {
    const results = await getThemeStyles({
      //@ts-ignore
      dark: 'invalid',
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
    ]);
  });

  it('returns all theme styles when provided "all" as an argument', async () => {
    const results = await getThemeStyles('all');

    // Check that CSS is defined for each result
    results.forEach((result) => {
      expect(result.css).toBeDefined();
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'legacy-light', attrs: { 'data-theme': 'legacy-light' } },
      { id: 'legacy-dark', attrs: { 'data-theme': 'legacy-dark' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
      { id: 'typography', attrs: { 'data-theme': 'typography' } },
      { id: 'shape', attrs: { 'data-theme': 'shape' } },
      { id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
      { id: 'typography-minor3', attrs: { 'data-theme': 'typography-minor3' } },
      {
        id: 'light-new-input-border',
        attrs: { 'data-theme': 'light-new-input-border' },
      },
      {
        id: 'dark-new-input-border',
        attrs: { 'data-theme': 'dark-new-input-border' },
      },
    ]);
  });
});
