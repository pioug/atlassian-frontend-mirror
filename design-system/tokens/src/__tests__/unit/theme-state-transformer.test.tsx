import { ThemeState } from '../../theme-config';
import {
  themeObjectToString,
  themeStringToObject,
} from '../../theme-state-transformer';

describe('themeObjectToString', () => {
  it('should convert theme state object to a formatted string', () => {
    const themeState: ThemeState = {
      colorMode: 'auto',
      dark: 'dark',
      light: 'legacy-light',
      spacing: 'spacing',
      typography: 'typography',
    };

    const expected =
      'colorMode:auto dark:dark light:legacy-light spacing:spacing typography:typography';

    expect(themeObjectToString(themeState)).toBe(expected);
  });

  it('should convert partial theme state object to a formatted string', () => {
    const themeState: Partial<ThemeState> = {
      dark: 'legacy-dark',
    };

    const expected = 'dark:legacy-dark';

    expect(themeObjectToString(themeState)).toBe(expected);
  });

  it('should convert theme state object to a formatted string omitting any invalid theme states', () => {
    const themeState: Partial<ThemeState> = {
      dark: 'dark',
      colorMode: 'auto',
      // @ts-expect-error
      invalid: 'invalid',
    };

    const expected = 'dark:dark colorMode:auto';

    expect(themeObjectToString(themeState)).toBe(expected);
  });

  it('should return an empty string when theme state object is empty', () => {
    const themeState = {};
    const expected = '';

    expect(themeObjectToString(themeState)).toBe(expected);
  });
});

describe('themeStringToObject', () => {
  it('should convert theme state string to an object', () => {
    const themeState =
      'dark:dark light:legacy-light colorMode:light spacing:spacing typography:typography';

    const expected = {
      dark: 'dark',
      light: 'legacy-light',
      colorMode: 'light',
      spacing: 'spacing',
      typography: 'typography',
    };

    expect(themeStringToObject(themeState)).toEqual(expected);
  });

  it('should convert partial theme state string to an object', () => {
    const themeState = 'dark:legacy-dark light:light';

    const expected = {
      dark: 'legacy-dark',
      light: 'light',
    };

    expect(themeStringToObject(themeState)).toEqual(expected);
  });

  it('should return an empty object when theme state string is empty', () => {
    const themeState = '';
    const expected = {};

    expect(themeStringToObject(themeState)).toEqual(expected);
  });
});
