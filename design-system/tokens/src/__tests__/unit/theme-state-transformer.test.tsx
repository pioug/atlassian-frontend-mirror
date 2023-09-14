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

  it('should convert theme state object to a formatted string if custom theme options provided', () => {
    const themeState: ThemeState = {
      colorMode: 'auto',
      dark: 'dark',
      light: 'legacy-light',
      spacing: 'spacing',
      UNSAFE_themeOptions: { brandColor: '#ff0000' },
    };

    const expected =
      'colorMode:auto dark:dark light:legacy-light spacing:spacing UNSAFE_themeOptions:{"brandColor":"#ff0000"}';

    expect(themeObjectToString(themeState)).toBe(expected);
  });

  it('should convert theme state object to a formatted string which can be encoded with encodeURIComponent, and then decoded with decodeURIComponent', () => {
    const themeState: ThemeState = {
      colorMode: 'auto',
      dark: 'dark',
      light: 'light',
      spacing: 'spacing',
      UNSAFE_themeOptions: { brandColor: '#ff0000' },
    };
    const themeStateString = themeObjectToString(themeState);

    const expectedEncodedURI =
      'colorMode%3Aauto%20dark%3Adark%20light%3Alight%20spacing%3Aspacing%20UNSAFE_themeOptions%3A%7B%22brandColor%22%3A%22%23ff0000%22%7D';

    expect(encodeURIComponent(themeStateString)).toBe(expectedEncodedURI);
    expect(decodeURIComponent(expectedEncodedURI)).toBe(themeStateString);
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

  it('should convert theme state string that contains custom theme options to an object', () => {
    const themeState = 'dark:dark UNSAFE_themeOptions:{"brandColor":"#ff0000"}';

    const expected = {
      dark: 'dark',
      UNSAFE_themeOptions: { brandColor: '#ff0000' },
    };

    expect(themeStringToObject(themeState)).toEqual(expected);
  });

  it('should not contain custom theme options in the converted object if provided an invalid custom theme options string', () => {
    const themeState = 'UNSAFE_themeOptions:{"brandColor":"#ff0000"';

    const expected = {};

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
