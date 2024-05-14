import { waitFor } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
  COLOR_MODE_ATTRIBUTE,
  CONTRAST_MODE_ATTRIBUTE,
  CUSTOM_THEME_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
} from '../../constants';
import * as customThemeUtils from '../../custom-theme';
// This import is just to get types
import * as enableGlobalThemeTypes from '../../enable-global-theme';
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
  default: enableGlobalTheme,
}: typeof enableGlobalThemeTypes = require('../../enable-global-theme');
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

const UNSAFE_themeOptions: ThemeOptionsSchema = {
  brandColor: '#ff0000',
};
const customStyleHashId = hash(JSON.stringify(UNSAFE_themeOptions));

/**
 * Cleans the DOM by clearing the html tag and re-setting the media query
 */
const cleanDOM = () => {
  // Clear the DOM after each test
  const html = document.documentElement;

  // Remove attributes on html
  [...html.attributes].forEach((attr) => html.removeAttribute(attr.name));

  html.innerHTML = '';
  setMatchMedia(false);
};

describe('setGlobalTheme style loading', () => {
  beforeEach(cleanDOM);

  describe('should load theme CSS on the page when specified', () => {
    ffTest(
      'platform.design-system-team.increased-contrast-themes',
      async () => {
        await setGlobalTheme({
          dark: 'dark',
          light: 'light',
          shape: 'shape',
          spacing: 'spacing',
          typography: 'typography-adg3',
        });

        // Wait for styles to be added to the page
        await waitFor(() => {
          const styleElements = document.querySelectorAll(
            `style[${THEME_DATA_ATTRIBUTE}]`,
          );
          expect(styleElements).toHaveLength(7);
        });

        // Validate that the data-theme attributes match the expected values
        const styleElements = document.querySelectorAll('style');
        const dataThemes = Array.from(styleElements).map((el) =>
          el.getAttribute('data-theme'),
        );

        expect(dataThemes.sort()).toEqual([
          'dark',
          'dark-increased-contrast',
          'light',
          'light-increased-contrast',
          'shape',
          'spacing',
          'typography-adg3',
        ]);
      },
      async () => {
        await setGlobalTheme({
          dark: 'dark',
          light: 'light',
          shape: 'shape',
          spacing: 'spacing',
          typography: 'typography-adg3',
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
          'typography-adg3',
        ]);
      },
    );
  });

  describe('should load custom theme CSS on the page when specified', () => {
    ffTest(
      'platform.design-system-team.increased-contrast-themes',
      async () => {
        // prompt a duplication of styles
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
          expect(styleElements).toHaveLength(7);

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
          'custom-light',
          'custom-dark',
          'light',
          'dark',
          'light-increased-contrast',
          'dark-increased-contrast',
          'spacing',
        ]);
      },
      async () => {
        // prompt a duplication of styles
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
          expect(styleElements).toHaveLength(5);

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
          'custom-light',
          'custom-dark',
          'light',
          'dark',
          'spacing',
        ]);
      },
    );
  });

  it('should gracefully omit themes when falsy values are passed in', async () => {
    await setGlobalTheme({
      colorMode: 'light',
      dark: 'dark',
      // @ts-expect-error
      light: '',
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(1);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual(['spacing']);
  });

  it('should gracefully omit themes when falsy values are passed in with auto color mode', async () => {
    await setGlobalTheme({
      colorMode: 'auto',
      dark: 'dark',
      // @ts-expect-error
      light: null,
    });

    // Wait for styles to be added to the page
    await waitFor(() => {
      const styleElements = document.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}]`,
      );
      expect(styleElements).toHaveLength(2);
    });

    // Validate that the data-theme attributes match the expected values
    const styleElements = document.querySelectorAll('style');
    const dataThemes = Array.from(styleElements).map((el) =>
      el.getAttribute('data-theme'),
    );

    expect(dataThemes.sort()).toEqual(['dark', 'spacing']);
  });

  it('should load a minimal set of themes when auto switching is disabled', async () => {
    await setGlobalTheme({
      colorMode: 'light',
      contrastMode: 'no-preference',
      dark: 'dark',
      light: 'light',
      shape: 'shape',
      spacing: 'spacing',
      typography: 'typography-adg3',
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
      'typography-adg3',
    ]);
  });

  describe('should load theme CSS on the page without duplicates', () => {
    ffTest(
      'platform.design-system-team.increased-contrast-themes',
      async () => {
        // prompt a duplication of styles
        await setGlobalTheme({
          light: 'dark',
          dark: 'dark',
          spacing: 'spacing',
          typography: 'typography-adg3',
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
          'dark-increased-contrast',
          'spacing',
          'typography-adg3',
        ]);
      },
      async () => {
        // prompt a duplication of styles
        await setGlobalTheme({
          light: 'dark',
          dark: 'dark',
          spacing: 'spacing',
          typography: 'typography-adg3',
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

        expect(dataThemes.sort()).toEqual([
          'dark',
          'spacing',
          'typography-adg3',
        ]);
      },
    );
  });

  it('should load all feature flagged themes in the expected order', async () => {
    await setGlobalTheme({
      dark: 'dark',
      light: 'light',
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

    expect(dataThemes).toEqual(['light', 'dark', 'spacing']);
  });

  it('should load all feature flagged themes in the expected order when switching color modes', async () => {
    await setGlobalTheme({
      colorMode: 'light',
    });

    await setGlobalTheme({
      colorMode: 'dark',
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

    expect(dataThemes).toEqual(['light', 'spacing', 'dark']);
  });

  it('should load all feature flagged themes in the expected order when switching feature flags', async () => {
    // (getBooleanFF as jest.Mock).mockImplementation((name) =>
    //   ['NOTE-include-future-feature-flags-here'].includes(name),
    // );

    await setGlobalTheme({});

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

    expect(dataThemes).toEqual(['light', 'dark', 'spacing']);
  });

  describe('should set the correct themes, contrast mode, and color mode when a theme loader is provided', () => {
    ffTest(
      'platform.design-system-team.increased-contrast-themes',
      async () => {
        await setGlobalTheme(
          {
            light: 'legacy-light',
            dark: 'legacy-dark',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
            contrastMode: 'more',
          },
          __noop,
        );

        const htmlElement = document.getElementsByTagName('html')[0];

        expect(htmlElement).toHaveAttribute(
          THEME_DATA_ATTRIBUTE,
          'dark:legacy-dark light:legacy-light spacing:spacing typography:typography-adg3',
        );

        expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
        expect(htmlElement).toHaveAttribute(CONTRAST_MODE_ATTRIBUTE, 'more');
      },
      async () => {
        await setGlobalTheme(
          {
            light: 'legacy-light',
            dark: 'legacy-dark',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
            contrastMode: 'more',
          },
          __noop,
        );

        const htmlElement = document.getElementsByTagName('html')[0];

        expect(htmlElement).toHaveAttribute(
          THEME_DATA_ATTRIBUTE,
          'dark:legacy-dark light:legacy-light spacing:spacing typography:typography-adg3',
        );

        expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
        expect(htmlElement).not.toHaveAttribute(
          CONTRAST_MODE_ATTRIBUTE,
          'more',
        );
      },
    );
  });

  it('should NOT add style elements by default when a theme loader is provided', async () => {
    await setGlobalTheme(
      {
        light: 'legacy-light',
        dark: 'legacy-dark',
        spacing: 'spacing',
        typography: 'typography-adg3',
        colorMode: 'light',
        contrastMode: 'more',
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

  describe('should use the provided theme loader to load styles', () => {
    ffTest(
      'platform.design-system-team.increased-contrast-themes',
      async () => {
        const themeLoaderMock = jest.fn();

        await setGlobalTheme(
          {
            light: 'light',
            dark: 'dark',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
          },
          themeLoaderMock,
        );

        // Should be called for each theme it injects (light, increased contrast, spacing, typography)
        expect(themeLoaderMock).toBeCalledTimes(4);

        await waitFor(() => {
          // There should be no style elements since the default theme loader should not be called
          const styleElements = document.getElementsByTagName('style');
          expect(styleElements.length).toBe(0);
        });
      },
      async () => {
        const themeLoaderMock = jest.fn();

        await setGlobalTheme(
          {
            light: 'light',
            dark: 'dark',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
          },
          themeLoaderMock,
        );

        // Should be called for each theme it injects (light,  spacing, typography)
        expect(themeLoaderMock).toBeCalledTimes(3);

        await waitFor(() => {
          // There should be no style elements since the default theme loader should not be called
          const styleElements = document.getElementsByTagName('style');
          expect(styleElements.length).toBe(0);
        });
      },
    );
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

it('should load only necessary color modes on repeat calls', async () => {
  const themeOptions = {
    brandColor: '#ff0000',
  } as const;

  // Call once with light mode
  await setGlobalTheme({
    colorMode: 'dark',
    UNSAFE_themeOptions: themeOptions,
  });

  var customStyleElements = document.querySelectorAll(
    `style[${CUSTOM_THEME_ATTRIBUTE}]`,
  );
  expect(customStyleElements).toHaveLength(1);
  expect(customStyleElements[0]).toHaveAttribute(THEME_DATA_ATTRIBUTE, 'dark');

  // Mock theme loader
  const customThemeSpy = jest.spyOn(
    customThemeUtils,
    'loadAndAppendCustomThemeCss',
  );

  // Second "auto" call should only load "dark" theme.
  await setGlobalTheme({
    colorMode: 'auto',
    UNSAFE_themeOptions: themeOptions,
  });

  expect(customThemeSpy).toHaveBeenCalledWith({
    colorMode: 'light',
    UNSAFE_themeOptions: themeOptions,
  });
  customThemeSpy.mockRestore();
});

(
  [
    [setGlobalTheme, 'setGlobalTheme'],
    [enableGlobalTheme, 'enableGlobalTheme'],
  ] as const
).forEach(([themeSetter, name]) => {
  describe(name, () => {
    beforeEach(cleanDOM);
    describe('should set the correct themes, color mode, and contrast mode', () => {
      ffTest(
        'platform.design-system-team.increased-contrast-themes',
        async () => {
          await themeSetter({
            light: 'legacy-light',
            dark: 'legacy-dark',
            shape: 'shape',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
            contrastMode: 'more',
          });
          const htmlElement = document.getElementsByTagName('html')[0];
          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:legacy-dark light:legacy-light shape:shape spacing:spacing typography:typography-adg3',
          );
          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).toHaveAttribute(CONTRAST_MODE_ATTRIBUTE, 'more');
        },
        async () => {
          await themeSetter({
            light: 'legacy-light',
            dark: 'legacy-dark',
            shape: 'shape',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
            contrastMode: 'more',
          });
          const htmlElement = document.getElementsByTagName('html')[0];
          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:legacy-dark light:legacy-light shape:shape spacing:spacing typography:typography-adg3',
          );
          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).not.toHaveAttribute(
            CONTRAST_MODE_ATTRIBUTE,
            'more',
          );
        },
      );
    });

    describe('should set the correct custom theme attribute, contrast mode, and color mode when customTheme specified', () => {
      ffTest(
        'platform.design-system-team.increased-contrast-themes',
        async () => {
          await themeSetter({
            light: 'legacy-light',
            dark: 'legacy-dark',
            shape: 'shape',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
            contrastMode: 'more',
            UNSAFE_themeOptions,
          });
          const htmlElement = document.getElementsByTagName('html')[0];
          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:legacy-dark light:legacy-light shape:shape spacing:spacing typography:typography-adg3',
          );
          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).toHaveAttribute(CONTRAST_MODE_ATTRIBUTE, 'more');
          expect(htmlElement).toHaveAttribute(
            CUSTOM_THEME_ATTRIBUTE,
            customStyleHashId,
          );
        },
        async () => {
          await themeSetter({
            light: 'legacy-light',
            dark: 'legacy-dark',
            shape: 'shape',
            spacing: 'spacing',
            typography: 'typography-adg3',
            colorMode: 'light',
            contrastMode: 'more',
            UNSAFE_themeOptions,
          });
          const htmlElement = document.getElementsByTagName('html')[0];
          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:legacy-dark light:legacy-light shape:shape spacing:spacing typography:typography-adg3',
          );
          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).not.toHaveAttribute(
            CONTRAST_MODE_ATTRIBUTE,
            'more',
          );
          expect(htmlElement).toHaveAttribute(
            CUSTOM_THEME_ATTRIBUTE,
            customStyleHashId,
          );
        },
      );
    });

    describe('should set the default themes, color mode, and contrast mode when they are not specified', () => {
      ffTest(
        'platform.design-system-team.increased-contrast-themes',
        async () => {
          await themeSetter();
          const htmlElement = document.getElementsByTagName('html')[0];
          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:dark light:light spacing:spacing',
          );
          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).toHaveAttribute(
            CONTRAST_MODE_ATTRIBUTE,
            'no-preference',
          );
        },
        async () => {
          await themeSetter();
          const htmlElement = document.getElementsByTagName('html')[0];
          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:dark light:light spacing:spacing',
          );
          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).not.toHaveAttribute(
            CONTRAST_MODE_ATTRIBUTE,
            'no-preference',
          );
        },
      );
    });

    describe('color mode', () => {
      it('should automatically switch theme by default', async () => {
        setMatchMedia(true);

        await themeSetter({ light: 'light' });
        const htmlElement = document.getElementsByTagName('html')[0];
        await waitFor(() => {
          return expect(htmlElement).toHaveAttribute(
            COLOR_MODE_ATTRIBUTE,
            'dark',
          );
        });
      });

      it('should switch theme correctly when colorMode set to "auto" (light mode)', async () => {
        await themeSetter({ colorMode: 'auto' });
        const htmlElement = document.getElementsByTagName('html')[0];
        await waitFor(() => {
          return expect(htmlElement).toHaveAttribute(
            COLOR_MODE_ATTRIBUTE,
            'light',
          );
        });
      });

      it('should switch theme correctly when colorMode set to "auto" (dark mode)', async () => {
        setMatchMedia(true);

        await themeSetter({ colorMode: 'auto' });
        const htmlElement = document.getElementsByTagName('html')[0];
        await waitFor(() => {
          return expect(htmlElement).toHaveAttribute(
            COLOR_MODE_ATTRIBUTE,
            'dark',
          );
        });
      });
    });

    describe('contrast mode', () => {
      describe('should automatically switch theme by default', () => {
        ffTest(
          'platform.design-system-team.increased-contrast-themes',
          async () => {
            setMatchMedia(true);

            await themeSetter({ light: 'light' });
            const htmlElement = document.getElementsByTagName('html')[0];
            await waitFor(() => {
              return expect(htmlElement).toHaveAttribute(
                CONTRAST_MODE_ATTRIBUTE,
                'more',
              );
            });
          },
          async () => {
            setMatchMedia(true);

            await themeSetter({ light: 'light' });
            const htmlElement = document.getElementsByTagName('html')[0];
            await waitFor(() => {
              return expect(htmlElement).not.toHaveAttribute(
                CONTRAST_MODE_ATTRIBUTE,
                'more',
              );
            });
          },
        );
      });

      describe('should switch theme correctly when contrastMode set to "auto" (no preference)', () => {
        ffTest(
          'platform.design-system-team.increased-contrast-themes',
          async () => {
            await themeSetter({ contrastMode: 'auto' });
            const htmlElement = document.getElementsByTagName('html')[0];
            await waitFor(() => {
              return expect(htmlElement).toHaveAttribute(
                CONTRAST_MODE_ATTRIBUTE,
                'no-preference',
              );
            });
          },
          async () => {
            await themeSetter({ contrastMode: 'auto' });
            const htmlElement = document.getElementsByTagName('html')[0];
            await waitFor(() => {
              return expect(htmlElement).not.toHaveAttribute(
                CONTRAST_MODE_ATTRIBUTE,
                'no-preference',
              );
            });
          },
        );
      });

      describe('should switch theme correctly when contrastMode set to "auto" (prefers more contrast)', () => {
        ffTest(
          'platform.design-system-team.increased-contrast-themes',
          async () => {
            setMatchMedia(true);

            await themeSetter({ contrastMode: 'auto' });
            const htmlElement = document.getElementsByTagName('html')[0];
            await waitFor(() => {
              return expect(htmlElement).toHaveAttribute(
                CONTRAST_MODE_ATTRIBUTE,
                'more',
              );
            });
          },
          async () => {
            setMatchMedia(true);

            await themeSetter({ contrastMode: 'auto' });
            const htmlElement = document.getElementsByTagName('html')[0];
            await waitFor(() => {
              return expect(htmlElement).not.toHaveAttribute(
                CONTRAST_MODE_ATTRIBUTE,
                'more',
              );
            });
          },
        );
      });
    });

    describe('should set the correct themes, contrast mode, and color mode when a theme loader is provided', () => {
      ffTest(
        'platform.design-system-team.increased-contrast-themes',
        async () => {
          await themeSetter(
            {
              light: 'legacy-light',
              dark: 'legacy-dark',
              spacing: 'spacing',
              typography: 'typography-adg3',
              colorMode: 'light',
              contrastMode: 'more',
            },
            __noop,
          );

          const htmlElement = document.getElementsByTagName('html')[0];

          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:legacy-dark light:legacy-light spacing:spacing typography:typography-adg3',
          );

          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).toHaveAttribute(CONTRAST_MODE_ATTRIBUTE, 'more');
        },
        async () => {
          await themeSetter(
            {
              light: 'legacy-light',
              dark: 'legacy-dark',
              spacing: 'spacing',
              typography: 'typography-adg3',
              colorMode: 'light',
              contrastMode: 'more',
            },
            __noop,
          );

          const htmlElement = document.getElementsByTagName('html')[0];

          expect(htmlElement).toHaveAttribute(
            THEME_DATA_ATTRIBUTE,
            'dark:legacy-dark light:legacy-light spacing:spacing typography:typography-adg3',
          );

          expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
          expect(htmlElement).not.toHaveAttribute(
            CONTRAST_MODE_ATTRIBUTE,
            'more',
          );
        },
      );
    });

    describe('should use the provided theme loader to load styles', () => {
      ffTest(
        'platform.design-system-team.increased-contrast-themes',
        async () => {
          const themeLoaderMock = jest.fn();

          await themeSetter(
            {
              light: 'light',
              dark: 'dark',
              spacing: 'spacing',
              typography: 'typography-adg3',
              colorMode: 'light',
            },
            themeLoaderMock,
          );

          // Should be called for each theme it injects (light, increased contrast, spacing, typography)
          expect(themeLoaderMock).toBeCalledTimes(4);

          await waitFor(() => {
            // There should be no style elements since the default theme loader should not be called
            const styleElements = document.getElementsByTagName('style');
            expect(styleElements.length).toBe(0);
          });
        },
        async () => {
          const themeLoaderMock = jest.fn();

          await themeSetter(
            {
              light: 'light',
              dark: 'dark',
              spacing: 'spacing',
              typography: 'typography-adg3',
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
        },
      );
    });
  });
});
