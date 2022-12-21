import { hexToEditorBackgroundPaletteColor } from './index';

describe('hexToEditorBackgroundPaletteColor', () => {
  test.each([
    ['#DEEBFF', 'var(--ds-background-accent-blue-subtlest, #DEEBFF)'],
    ['#B3D4FF', 'var(--ds-background-accent-blue-subtler, #B3D4FF)'],
    ['#4C9AFF', 'var(--ds-background-accent-blue-subtle, #4C9AFF)'],
    ['#E6FCFF', 'var(--ds-background-accent-teal-subtlest, #E6FCFF)'],
    ['#B3F5FF', 'var(--ds-background-accent-teal-subtler, #B3F5FF)'],
    ['#79E2F2', 'var(--ds-background-accent-teal-subtle, #79E2F2)'],
    ['#E3FCEF', 'var(--ds-background-accent-green-subtlest, #E3FCEF)'],
    ['#ABF5D1', 'var(--ds-background-accent-green-subtler, #ABF5D1)'],
    ['#57D9A3', 'var(--ds-background-accent-green-subtle, #57D9A3)'],
    ['#FFFAE6', 'var(--ds-background-accent-yellow-subtlest, #FFFAE6)'],
    ['#FFF0B3', 'var(--ds-background-accent-yellow-subtler, #FFF0B3)'],
    ['#FFC400', 'var(--ds-background-accent-orange-subtle, #FFC400)'],
    ['#FFEBE6', 'var(--ds-background-accent-red-subtlest, #FFEBE6)'],
    ['#FFBDAD', 'var(--ds-background-accent-red-subtler, #FFBDAD)'],
    ['#FF8F73', 'var(--ds-background-accent-red-subtle, #FF8F73)'],
    ['#EAE6FF', 'var(--ds-background-accent-purple-subtlest, #EAE6FF)'],
    ['#C0B6F2', 'var(--ds-background-accent-purple-subtler, #C0B6F2)'],
    ['#998DD9', 'var(--ds-background-accent-purple-subtle, #998DD9)'],
    ['#FFFFFF', 'var(--ds-surface, #FFFFFF)'],
    ['#F4F5F7', 'var(--ds-background-accent-gray-subtlest, #F4F5F7)'],
    ['#B3BAC5', 'var(--ds-background-accent-gray-subtle, #B3BAC5)'],
  ])(
    'hexToEditorBackgroundPaletteColor(%s)',
    (inputHexCode, expectedCssValue) => {
      expect(hexToEditorBackgroundPaletteColor(inputHexCode)).toBe(
        expectedCssValue,
      );
    },
  );
  test('supports loading via a lowercase value', () => {
    expect(hexToEditorBackgroundPaletteColor('#deebff')).toBe(
      'var(--ds-background-accent-blue-subtlest, #DEEBFF)',
    );
  });
});
