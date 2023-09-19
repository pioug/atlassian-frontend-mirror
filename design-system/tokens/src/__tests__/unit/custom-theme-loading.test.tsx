import { CUSTOM_THEME_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../../constants';
import * as customThemeUtils from '../../custom-theme';
import UNSAFE_loadCustomThemeStyles from '../../load-custom-theme-styles';
import { ThemeOptionsSchema } from '../../theme-config';
import { findMissingCustomStyleElements } from '../../utils/custom-theme-loading-utils';
import { hash } from '../../utils/hash';

const UNSAFE_themeOptions: ThemeOptionsSchema = { brandColor: '#ff0000' };
const hashedId = hash(JSON.stringify(UNSAFE_themeOptions));

describe('UNSAFE_loadCustomThemeStyles', () => {
  beforeEach(() => {
    // Clear the DOM after each test
    document.getElementsByTagName('html')[0].innerHTML = '';
    document
      .getElementsByTagName('html')[0]
      .removeAttribute(CUSTOM_THEME_ATTRIBUTE);
    document
      .querySelectorAll('style')
      .forEach((el) => el.parentNode?.removeChild(el));
  });

  it('should not load custom theme if provided brand color is invalid', async () => {
    UNSAFE_loadCustomThemeStyles({
      colorMode: 'light',
      UNSAFE_themeOptions: {
        brandColor: '#ff00',
      },
    });

    UNSAFE_loadCustomThemeStyles({
      colorMode: 'light',
      UNSAFE_themeOptions: {
        // @ts-ignore
        brandColor: '',
      },
    });

    UNSAFE_loadCustomThemeStyles({
      colorMode: 'light',
      // @ts-ignore
      UNSAFE_themeOptions: {},
    });

    const customStyleElements = document.querySelectorAll(
      `style[${CUSTOM_THEME_ATTRIBUTE}]`,
    );
    expect(customStyleElements).toHaveLength(0);
  });

  it('should load custom themes (but not configure root) if provided brand color is valid', async () => {
    UNSAFE_loadCustomThemeStyles({
      colorMode: 'light',
      UNSAFE_themeOptions: {
        brandColor: '#ff0000',
      },
    });

    const customStyleElements = document.querySelectorAll(
      `style[${CUSTOM_THEME_ATTRIBUTE}]`,
    );
    expect(customStyleElements).toHaveLength(1);
  });

  it('should not configure root when called with valid values', async () => {
    UNSAFE_loadCustomThemeStyles({
      colorMode: 'light',
      UNSAFE_themeOptions: {
        brandColor: '#ff0000',
      },
    });

    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).not.toHaveAttribute(CUSTOM_THEME_ATTRIBUTE);
  });

  it('should load only necessary color modes on repeat calls', async () => {
    const themeOptions = {
      brandColor: '#ff0000',
    } as const;

    // Call once with light mode
    UNSAFE_loadCustomThemeStyles({
      colorMode: 'dark',
      UNSAFE_themeOptions: themeOptions,
    });

    var customStyleElements = document.querySelectorAll(
      `style[${CUSTOM_THEME_ATTRIBUTE}]`,
    );
    expect(customStyleElements).toHaveLength(1);
    expect(customStyleElements[0]).toHaveAttribute(
      THEME_DATA_ATTRIBUTE,
      'dark',
    );

    // Mock theme loader
    const customThemeSpy = jest.spyOn(
      customThemeUtils,
      'loadAndAppendCustomThemeCss',
    );

    // Second "auto" call should only load "dark" theme.
    UNSAFE_loadCustomThemeStyles({
      colorMode: 'auto',
      UNSAFE_themeOptions: themeOptions,
    });

    expect(customThemeSpy).toHaveBeenCalledWith({
      colorMode: 'light',
      UNSAFE_themeOptions: themeOptions,
    });
    customThemeSpy.mockRestore();
  });
});

describe('loadAndAppendCustomThemeCss', () => {
  beforeEach(() => {
    // Clear the DOM after each test
    document.getElementsByTagName('html')[0].innerHTML = '';
    document
      .querySelectorAll('style')
      .forEach((el) => el.parentNode?.removeChild(el));
  });

  it('should add custom themes to the page when requested', async () => {
    await customThemeUtils.loadAndAppendCustomThemeCss({
      colorMode: 'light',
      UNSAFE_themeOptions,
    });

    const lightStyleElement = document.head.querySelector(
      `style[${THEME_DATA_ATTRIBUTE}="${'light'}"][${CUSTOM_THEME_ATTRIBUTE}="${hashedId}"]`,
    );
    expect(lightStyleElement).not.toBeNull();

    await customThemeUtils.loadAndAppendCustomThemeCss({
      colorMode: 'dark',
      UNSAFE_themeOptions,
    });
    const darkStyleElement = document.head.querySelector(
      `style[${THEME_DATA_ATTRIBUTE}="dark"][${CUSTOM_THEME_ATTRIBUTE}="${hashedId}"]`,
    );
    expect(darkStyleElement).not.toBeNull();
  });

  it('should not generate and add a custom theme based on the same brand color a second time if one is already present on the page', async () => {
    await customThemeUtils.loadAndAppendCustomThemeCss({
      colorMode: 'dark',
      UNSAFE_themeOptions,
    });

    const attrOfMissingStyles = findMissingCustomStyleElements(
      UNSAFE_themeOptions,
      'dark',
    );
    expect(attrOfMissingStyles).toHaveLength(0);

    const styleElements = document.head.querySelectorAll(
      `style[${THEME_DATA_ATTRIBUTE}="dark"][${CUSTOM_THEME_ATTRIBUTE}="${hashedId}"]`,
    );
    expect(styleElements).toHaveLength(1);
  });

  it('should return one missing custom style attr when colorMode set to auto and there is an existing custom theme style', async () => {
    await customThemeUtils.loadAndAppendCustomThemeCss({
      colorMode: 'light',
      UNSAFE_themeOptions,
    });

    const attrOfMissingStyles = findMissingCustomStyleElements(
      UNSAFE_themeOptions,
      'auto',
    );

    expect(attrOfMissingStyles).toEqual(['dark']);
  });

  it('should only store the latest 10 style elements', async () => {
    // 11 colors
    const colors = [
      '#65D26E',
      '#FFEBE6',
      '#FFFAE6',
      '#36B37E',
      '#0052CC',
      '#B3BAC5',
      '#455166',
      '#008DA6',
      '#4C9AFF',
      '#403294',
      '#ABF5D1',
    ];

    await colors.forEach(async (color) => {
      const options = { brandColor: color } as ThemeOptionsSchema;
      await customThemeUtils.loadAndAppendCustomThemeCss({
        colorMode: 'light',
        UNSAFE_themeOptions: options,
      });
    });

    const styleElements = document.head.querySelectorAll(
      `style[${THEME_DATA_ATTRIBUTE}="light"][${CUSTOM_THEME_ATTRIBUTE}]`,
    );
    expect(styleElements).toHaveLength(
      customThemeUtils.CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD,
    );
  });

  it('should append the existing custom styles to the end of list to take precedence over others', async () => {
    const colors = ['#65D26E', '#FFEBE6', '#FFFAE6', '#36B37E'];

    await colors.forEach(async (color) => {
      const options = { brandColor: color } as ThemeOptionsSchema;
      await customThemeUtils.loadAndAppendCustomThemeCss({
        colorMode: 'light',
        UNSAFE_themeOptions: options,
      });
    });

    const existingThemeOptions = {
      brandColor: colors[0],
    } as ThemeOptionsSchema;
    // attempt to load the first custom theme twice
    await customThemeUtils.loadAndAppendCustomThemeCss({
      colorMode: 'light',
      UNSAFE_themeOptions: existingThemeOptions,
    });

    const existingHashedId = hash(JSON.stringify(existingThemeOptions));
    const newStyleElements = [
      ...document.head.querySelectorAll(
        `style[${THEME_DATA_ATTRIBUTE}="light"][${CUSTOM_THEME_ATTRIBUTE}]`,
      ),
    ];
    const lastElementAttribute = (
      newStyleElements[newStyleElements.length - 1] as HTMLStyleElement
    ).dataset.customTheme;

    expect(lastElementAttribute).toEqual(existingHashedId);
  });
});
