import {
  hexToEditorTableChartsPaletteColor,
  hexToEditorTableChartsPaletteRawValue,
} from './index';

describe('hexToEditorTableChartsPaletteColor', () => {
  test.each([
    ['#7AB2FF', 'var(--ds-background-accent-blue-subtle, #7AB2FF)'],
    ['#60C6D2', 'var(--ds-background-accent-teal-subtle, #60C6D2)'],
    ['#6BE1B0', 'var(--ds-background-accent-green-subtle, #6BE1B0)'],
    ['#FFDB57', 'var(--ds-background-accent-yellow-subtle, #FFDB57)'],
    ['#FAA53D', 'var(--ds-background-accent-orange-subtle, #FAA53D)'],
    ['#FF8F73', 'var(--ds-background-accent-red-subtle, #FF8F73)'],
    ['#E774BB', 'var(--ds-background-accent-magenta-subtle, #E774BB)'],
    ['#B5A7FB', 'var(--ds-background-accent-purple-subtle, #B5A7FB)'],
    ['#8993A5', 'var(--ds-background-accent-gray-subtler, #8993A5)'],
    ['#247FFF', 'var(--ds-chart-blue-bold, #247FFF)'],
    ['#1D9AAA', 'var(--ds-chart-teal-bold, #1D9AAA)'],
    ['#23A971', 'var(--ds-chart-green-bold, #23A971)'],
    ['#FFBE33', 'var(--ds-chart-yellow-bold, #FFBE33)'],
    ['#D97008', 'var(--ds-chart-orange-bold, #D97008)'],
    ['#FC552C', 'var(--ds-chart-red-bold, #FC552C)'],
    ['#DA62AC', 'var(--ds-chart-magenta-bold, #DA62AC)'],
    ['#8B77EE', 'var(--ds-chart-purple-bold, #8B77EE)'],
    ['#8590A2', 'var(--ds-chart-gray-bold, #8590A2)'],
    ['#0055CC', 'var(--ds-chart-blue-bolder, #0055CC)'],
    ['#1D7F8C', 'var(--ds-chart-teal-bolder, #1D7F8C)'],
    ['#177D52', 'var(--ds-chart-green-bolder, #177D52)'],
    ['#FF9D00', 'var(--ds-chart-yellow-bolder, #FF9D00)'],
    ['#B65C02', 'var(--ds-chart-orange-bolder, #B65C02)'],
    ['#D32D03', 'var(--ds-chart-red-bolder, #D32D03)'],
    ['#CD519D', 'var(--ds-chart-magenta-bolder, #CD519D)'],
    ['#5A43D0', 'var(--ds-chart-purple-bolder, #5A43D0)'],
    ['#758195', 'var(--ds-chart-gray-bolder, #758195)'],
    ['#003884', 'var(--ds-chart-blue-boldest, #003884)'],
    ['#206B74', 'var(--ds-chart-teal-boldest, #206B74)'],
    ['#055C3F', 'var(--ds-chart-green-boldest, #055C3F)'],
    ['#946104', 'var(--ds-chart-yellow-boldest, #946104)'],
    ['#974F0C', 'var(--ds-chart-orange-boldest, #974F0C)'],
    ['#A32000', 'var(--ds-chart-red-boldest, #A32000)'],
    ['#943D73', 'var(--ds-chart-magenta-boldest, #943D73)'],
    ['#44368B', 'var(--ds-chart-purple-boldest, #44368B)'],
    ['#44546F', 'var(--ds-chart-gray-boldest, #44546F)'],
  ])(`mapHexToDstChartsPalette(%s)`, (hex, expected) => {
    expect(hexToEditorTableChartsPaletteColor(hex)).toBe(expected);
  });
});

describe('hexToEditorTableChartsPaletteRawValue', () => {
  test('Returns input hex when tokens are on the page', () => {
    expect(hexToEditorTableChartsPaletteRawValue('#7AB2FF')).toBe('#7AB2FF');
  });

  test('Returns undefined when unmapped input is provided', () => {
    expect(hexToEditorTableChartsPaletteRawValue('invalid')).toBe(undefined);
  });
});
