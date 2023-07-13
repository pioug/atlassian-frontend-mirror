import { hexToEditorBorderPaletteColor } from './index';

describe('hexToEditorBorderPaletteColor', () => {
  test.each([
    ['#091E4224', 'var(--ds-border, #091E4224)'],
    ['#758195', 'var(--ds-border-bold, #758195)'],
    ['#172B4D', 'var(--ds-text, #172B4D)'],
  ])(
    'hexToEditorBorderPaletteColor(%s)',
    (inputHexCode, expectedDesignToken) => {
      expect(hexToEditorBorderPaletteColor(inputHexCode)).toBe(
        expectedDesignToken,
      );
    },
  );

  test('supports loading via a lowercase value', () => {
    expect(hexToEditorBorderPaletteColor('#091e4224')).toBe(
      'var(--ds-border, #091E4224)',
    );
  });
});
