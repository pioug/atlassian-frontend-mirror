import { CUSTOM_THEME_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../../constants';
import {
  CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD,
  CustomBrandSchema,
  loadAndAppendCustomThemeCss,
} from '../../custom-theme';
import { findMissingCustomStyleElements } from '../../utils/custom-theme-loading-utils';
import { hash } from '../../utils/hash';

const UNSAFE_themeOptions: CustomBrandSchema = { brandColor: '#ff0000' };
const hashedId = hash(JSON.stringify(UNSAFE_themeOptions));

describe('loadAndAppendCustomThemeCss', () => {
  beforeEach(() => {
    // Clear the DOM after each test
    document.getElementsByTagName('html')[0].innerHTML = '';
    document
      .querySelectorAll('style')
      .forEach((el) => el.parentNode?.removeChild(el));
  });

  it('should add custom themes to the page when requested', async () => {
    await loadAndAppendCustomThemeCss({
      colorMode: 'light',
      UNSAFE_themeOptions,
    });

    const lightStyleElement = document.head.querySelector(
      `style[${THEME_DATA_ATTRIBUTE}="${'light'}"][${CUSTOM_THEME_ATTRIBUTE}="${hashedId}"]`,
    );
    expect(lightStyleElement).not.toBeNull();

    await loadAndAppendCustomThemeCss({
      colorMode: 'dark',
      UNSAFE_themeOptions,
    });
    const darkStyleElement = document.head.querySelector(
      `style[${THEME_DATA_ATTRIBUTE}="dark"][${CUSTOM_THEME_ATTRIBUTE}="${hashedId}"]`,
    );
    expect(darkStyleElement).not.toBeNull();
  });

  it('should not generate and add a custom theme based on the same brand color a second time if one is already present on the page', async () => {
    await loadAndAppendCustomThemeCss({
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
    await loadAndAppendCustomThemeCss({
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
      const options = { brandColor: color } as CustomBrandSchema;
      await loadAndAppendCustomThemeCss({
        colorMode: 'light',
        UNSAFE_themeOptions: options,
      });
    });

    const styleElements = document.head.querySelectorAll(
      `style[${THEME_DATA_ATTRIBUTE}="light"][${CUSTOM_THEME_ATTRIBUTE}]`,
    );
    expect(styleElements).toHaveLength(CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD);
  });

  it('should append the existing custom styles to the end of list to take precedence over others', async () => {
    const colors = ['#65D26E', '#FFEBE6', '#FFFAE6', '#36B37E'];

    await colors.forEach(async (color) => {
      const options = { brandColor: color } as CustomBrandSchema;
      await loadAndAppendCustomThemeCss({
        colorMode: 'light',
        UNSAFE_themeOptions: options,
      });
    });

    const existingThemeOptions = { brandColor: colors[0] } as CustomBrandSchema;
    // attempt to load the first custom theme twice
    await loadAndAppendCustomThemeCss({
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
