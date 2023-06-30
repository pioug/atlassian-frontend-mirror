import { waitFor } from '@testing-library/dom';

import __noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../../constants';
// This import is just to get types
import * as setGlobalThemeTypes from '../../set-global-theme';

type ThemeStyles = setGlobalThemeTypes.ThemeStyles;

// Mock window.matchMedia before importing setGlobalTheme
const matchMediaObject = {
  matches: false,
  media: '',
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((_) => {
    return matchMediaObject;
  }),
});

jest.mock('@atlaskit/platform-feature-flags', () => ({
  getBooleanFF: jest.fn().mockImplementation(() => false),
}));

afterEach(() => {
  (getBooleanFF as jest.Mock).mockReset();
});

// Import these using `require` to allow them to
const {
  default: setGlobalTheme,
  getSSRAutoScript,
  getThemeHtmlAttrs,
  getThemeStyles,
}: typeof setGlobalThemeTypes = require('../../set-global-theme');

/**
 * Set the result of a dark mode media query
 */
function setMatchMedia(matchesDark: boolean) {
  matchMediaObject.matches = matchesDark;
}

/**
 * Cleans the DOM by clearing the html tag and re-setting the media query
 */
const cleanDOM = () => {
  // Clear the DOM after each test
  document.getElementsByTagName('html')[0].innerHTML = '';
  setMatchMedia(false);
};

function getThemeData(themes: ThemeStyles[]) {
  return themes.reduce((acc: Omit<ThemeStyles, 'css'>[], { css, ...rest }) => {
    acc.push({ ...rest });
    return acc;
  }, []);
}

describe('setGlobalTheme', () => {
  beforeEach(cleanDOM);
  it('should set the correct themes and color mode', async () => {
    await setGlobalTheme({
      light: 'legacy-light',
      dark: 'legacy-dark',
      shape: 'shape',
      spacing: 'spacing',
      typography: 'typography',
      colorMode: 'light',
    });
    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).toHaveAttribute(
      THEME_DATA_ATTRIBUTE,
      'dark:legacy-dark light:legacy-light shape:shape spacing:spacing typography:typography',
    );
    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
  });

  it('should set the default themes and color mode when they are not specified', async () => {
    await setGlobalTheme();
    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).toHaveAttribute(
      THEME_DATA_ATTRIBUTE,
      'dark:dark light:light',
    );
    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
  });

  it('should automatically switch theme by default', async () => {
    setMatchMedia(true);

    await setGlobalTheme({ light: 'light' });
    const htmlElement = document.getElementsByTagName('html')[0];
    await waitFor(() => {
      return expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'dark');
    });
  });

  it('should switch theme correctly when colorMode set to "auto" (light mode)', async () => {
    await setGlobalTheme({ colorMode: 'auto' });
    const htmlElement = document.getElementsByTagName('html')[0];
    await waitFor(() => {
      return expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
    });
  });

  it('should switch theme correctly when colorMode set to "auto" (dark mode)', async () => {
    setMatchMedia(true);

    await setGlobalTheme({ colorMode: 'auto' });
    const htmlElement = document.getElementsByTagName('html')[0];
    await waitFor(() => {
      return expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'dark');
    });
  });

  it('should load theme CSS on the page when specified', async () => {
    // prompt a duplication of
    await setGlobalTheme({
      dark: 'dark',
      light: 'light',
      shape: 'shape',
      spacing: 'spacing',
      typography: 'typography',
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(5);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual([
      'dark',
      'light',
      'shape',
      'spacing',
      'typography',
    ]);
  });

  it('should load a minimal set of themes when auto switching is disabled', async () => {
    await setGlobalTheme({
      colorMode: 'light',
      dark: 'dark',
      light: 'light',
      shape: 'shape',
      spacing: 'spacing',
      typography: 'typography',
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(4);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual([
      'light',
      'shape',
      'spacing',
      'typography',
    ]);
  });

  it('should load theme CSS on the page without duplicates', async () => {
    // prompt a duplication of
    await setGlobalTheme({
      light: 'dark',
      dark: 'dark',
      spacing: 'spacing',
      typography: 'typography',
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(3);
      expect(styleElements).not.toHaveLength(4);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual(['dark', 'spacing', 'typography']);
  });

  it('should load the border theme override CSS on the page when the feature flag is enabled', async () => {
    (getBooleanFF as jest.Mock).mockImplementation(
      (name) => name === 'platform.design-system-team.border-checkbox_nyoiu',
    );

    await setGlobalTheme({
      dark: 'dark',
      light: 'light',
      spacing: 'spacing',
      typography: 'typography',
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(5);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual([
      'dark',
      'dark-new-input-border',
      'light',
      'spacing',
      'typography',
    ]);
  });

  it('should not load the spacing and shape themes on the page by default when the feature flag is not enabled', async () => {
    (getBooleanFF as jest.Mock).mockImplementation(
      (name) => name === 'platform.design-system-team.something-else',
    );

    await setGlobalTheme({
      dark: 'dark',
      light: 'light',
      typography: 'typography',
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(3);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual(['dark', 'light', 'typography']);
  });

  it('should set the correct themes and color mode when a theme loader is provided', async () => {
    await setGlobalTheme(
      {
        light: 'legacy-light',
        dark: 'legacy-dark',
        spacing: 'spacing',
        typography: 'typography',
        colorMode: 'light',
      },
      __noop,
    );

    const htmlElement = document.getElementsByTagName('html')[0];

    expect(htmlElement).toHaveAttribute(
      THEME_DATA_ATTRIBUTE,
      'dark:legacy-dark light:legacy-light spacing:spacing typography:typography',
    );

    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
  });

  it('should NOT add style elements by default when a theme loader is provided', async () => {
    await setGlobalTheme(
      {
        light: 'legacy-light',
        dark: 'legacy-dark',
        spacing: 'spacing',
        typography: 'typography',
        colorMode: 'light',
      },
      __noop,
    );

    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(0);
    });
  });

  it('should load the spacing and shape themes on the page when the feature flag is enabled', async () => {
    (getBooleanFF as jest.Mock).mockImplementation(
      (name) =>
        name === 'platform.design-system-team.space-and-shape-tokens_q5me6',
    );

    await setGlobalTheme({
      dark: 'dark',
      light: 'light',
      typography: 'typography',
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(5);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual([
      'dark',
      'light',
      'shape',
      'spacing',
      'typography',
    ]);
  });

  it('should use the provided theme loader to load styles', async () => {
    const themeLoaderMock = jest.fn();

    await setGlobalTheme(
      {
        light: 'light',
        dark: 'dark',
        spacing: 'spacing',
        typography: 'typography',
        colorMode: 'light',
      },
      themeLoaderMock,
    );

    // Should be called for each theme it injects (light, spacing, typography)
    expect(themeLoaderMock).toBeCalledTimes(3);

    await waitFor(() => {
      // There should be no style elements since the default theme loader should not be called
      const styleElements = document.getElementsByTagName('style');
      expect(styleElements.length).toBe(0);
    });
  });
});

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

  it('returns an array of ThemeStyles that includes `shape` and `spacing` when the feature flag is enabled', async () => {
    (getBooleanFF as jest.Mock).mockImplementation(
      (name) =>
        name === 'platform.design-system-team.space-and-shape-tokens_q5me6',
    );

    let results = await getThemeStyles({
      colorMode: 'auto',
      dark: 'dark',
      light: 'light',
      typography: 'typography',
    });

    expect(getThemeData(results)).toEqual([
      { id: 'light', attrs: { 'data-theme': 'light' } },
      { id: 'dark', attrs: { 'data-theme': 'dark' } },
      { id: 'typography', attrs: { 'data-theme': 'typography' } },
      { id: 'shape', attrs: { 'data-theme': 'shape' } },
      { id: 'spacing', attrs: { 'data-theme': 'spacing' } },
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

describe('getThemeHtmlAttrs', () => {
  beforeAll(cleanDOM);
  it('returns a Record of html attributes when given valid theme state', () => {
    setMatchMedia(true);
    const result = getThemeHtmlAttrs({
      colorMode: 'auto',
      dark: 'dark',
      light: 'light',
      spacing: 'spacing',
      typography: 'typography',
    });

    expect(result).toHaveProperty(
      THEME_DATA_ATTRIBUTE,
      'dark:dark light:light spacing:spacing typography:typography',
    );

    // SSR doesn't check the media query
    expect(result).toHaveProperty(COLOR_MODE_ATTRIBUTE, 'light');
  });
});

describe('getSSRAutoScript', () => {
  beforeAll(cleanDOM);
  it('returns undefined when colorMode is not automatically set', async () => {
    const result = getSSRAutoScript('light');
    expect(result).toBeUndefined();
  });

  it('returns a script that correctly sets the data-color-mode attribute based on the system theme', async () => {
    // Get the SSR auto script
    const result = getSSRAutoScript('auto');
    expect(result).toBeDefined();

    // Execute the returned script
    const script = document.createElement('script');
    script.innerHTML = result || '';
    document.head.appendChild(script);

    // Check that the data-color-mode attribute has been set as expected to "light"
    const el = document.querySelector(`[${COLOR_MODE_ATTRIBUTE}]`);
    expect(el?.getAttribute(COLOR_MODE_ATTRIBUTE)).toBe('light');
  });
});
