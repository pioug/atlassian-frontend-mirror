import { waitFor } from '@testing-library/dom';

import __noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  COLOR_MODE_ATTRIBUTE,
  CUSTOM_THEME_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
} from '../../constants';
// This import is just to get types
import * as setGlobalThemeTypes from '../../set-global-theme';
import { ThemeOptionsSchema } from '../../theme-config';
import { hash } from '../../utils/hash';

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

// Imported using `require` to allow us to mock matchMedia before importing
const {
  default: setGlobalTheme,
}: typeof setGlobalThemeTypes = require('../../set-global-theme');

/**
 * Set the result of a dark mode media query
 */
function setMatchMedia(matchesDark: boolean) {
  matchMediaObject.matches = matchesDark;
}

// Mock Feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
  getBooleanFF: jest.fn().mockImplementation(() => false),
}));

afterEach(() => {
  (getBooleanFF as jest.Mock).mockReset();
});

const UNSAFE_themeOptions: ThemeOptionsSchema = {
  brandColor: '#ff0000',
};
const customStyleHashId = hash(JSON.stringify(UNSAFE_themeOptions));

/**
 * Cleans the DOM by clearing the html tag and re-setting the media query
 */
const cleanDOM = () => {
  // Clear the DOM after each test
  document.getElementsByTagName('html')[0].innerHTML = '';
  setMatchMedia(false);
};

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

  it('should set the correct custom theme attribute and color mode when customTheme specified', async () => {
    await setGlobalTheme({
      light: 'legacy-light',
      dark: 'legacy-dark',
      shape: 'shape',
      spacing: 'spacing',
      typography: 'typography',
      colorMode: 'light',
      UNSAFE_themeOptions,
    });
    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).toHaveAttribute(
      THEME_DATA_ATTRIBUTE,
      'dark:legacy-dark light:legacy-light shape:shape spacing:spacing typography:typography',
    );
    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
    expect(htmlElement).toHaveAttribute(
      CUSTOM_THEME_ATTRIBUTE,
      customStyleHashId,
    );
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

  it('should load custom theme CSS on the page when specified', async () => {
    // prompt a duplication of
    await setGlobalTheme({
      dark: 'dark',
      light: 'light',
      UNSAFE_themeOptions,
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(4);

      const customStyleElements = document.querySelectorAll(
        `style[${CUSTOM_THEME_ATTRIBUTE}]`,
      );
      expect(customStyleElements).toHaveLength(2);
    });

    const styleElements = document.querySelectorAll('style');

    const dataThemes = Array.from(styleElements).map((el) => {
      return (
        (el.hasAttribute(CUSTOM_THEME_ATTRIBUTE) ? 'custom-' : '') +
        el.getAttribute(THEME_DATA_ATTRIBUTE)
      );
    });

    // Validate that the custom style elements come after other style element
    expect(dataThemes).toEqual([
      'light',
      'dark',
      'custom-light',
      'custom-dark',
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

  it('should not load the spacing theme on the page by default when the feature flag is not enabled', async () => {
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

  it('should load the spacing theme on the page when the feature flag is enabled', async () => {
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
      expect(styleElements).toHaveLength(4);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual([
      'dark',
      'light',
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

  it('should not load custom theme if provided brand color is invalid', async () => {
    document
      .getElementsByTagName('html')[0]
      .removeAttribute(CUSTOM_THEME_ATTRIBUTE);

    await setGlobalTheme({
      colorMode: 'light',
      UNSAFE_themeOptions: {
        brandColor: '#ff00',
      },
    });

    await setGlobalTheme({
      colorMode: 'light',
      UNSAFE_themeOptions: {
        // @ts-ignore
        brandColor: '',
      },
    });

    await setGlobalTheme({
      colorMode: 'light',
      // @ts-ignore
      UNSAFE_themeOptions: {},
    });

    const customStyleElements = document.querySelectorAll(
      `style[${CUSTOM_THEME_ATTRIBUTE}]`,
    );
    expect(customStyleElements).toHaveLength(0);

    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).not.toHaveAttribute(CUSTOM_THEME_ATTRIBUTE);
  });

  it('should not load custom styles if a theme loader is provided', async () => {
    const beforeHtmlElement = document.getElementsByTagName('html')[0];
    beforeHtmlElement.removeAttribute(CUSTOM_THEME_ATTRIBUTE);
    const themeLoaderMock = jest.fn();

    await setGlobalTheme(
      {
        colorMode: 'light',
        UNSAFE_themeOptions,
      },
      themeLoaderMock,
    );
    const customStyleElements = document.querySelectorAll(
      `style[${CUSTOM_THEME_ATTRIBUTE}]`,
    );
    expect(customStyleElements).toHaveLength(0);

    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).not.toHaveAttribute(CUSTOM_THEME_ATTRIBUTE);
  });
});
