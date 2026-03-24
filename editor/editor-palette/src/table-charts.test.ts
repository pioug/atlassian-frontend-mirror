import { hexToEditorTableChartsPaletteColor, hexToEditorTableChartsPaletteRawValue } from './index';

describe('hexToEditorTableChartsPaletteColor', () => {
	test.each([
		['#7AB2FF', 'var(--ds-background-accent-blue-subtle)'],
		['#60C6D2', 'var(--ds-background-accent-teal-subtle)'],
		['#6BE1B0', 'var(--ds-background-accent-green-subtle)'],
		['#FFDB57', 'var(--ds-background-accent-yellow-subtle)'],
		['#FAA53D', 'var(--ds-background-accent-orange-subtle)'],
		['#FF8F73', 'var(--ds-background-accent-red-subtle)'],
		['#E774BB', 'var(--ds-background-accent-magenta-subtle)'],
		['#B5A7FB', 'var(--ds-background-accent-purple-subtle)'],
		['#8993A5', 'var(--ds-background-accent-gray-subtler)'],
		['#247FFF', 'var(--ds-chart-blue-bold)'],
		['#1D9AAA', 'var(--ds-chart-teal-bold)'],
		['#23A971', 'var(--ds-chart-green-bold)'],
		['#FFBE33', 'var(--ds-chart-yellow-bold)'],
		['#D97008', 'var(--ds-chart-orange-bold)'],
		['#FC552C', 'var(--ds-chart-red-bold)'],
		['#DA62AC', 'var(--ds-chart-magenta-bold)'],
		['#8B77EE', 'var(--ds-chart-purple-bold)'],
		['#8590A2', 'var(--ds-chart-gray-bold)'],
		['#0055CC', 'var(--ds-chart-blue-bolder)'],
		['#1D7F8C', 'var(--ds-chart-teal-bolder)'],
		['#177D52', 'var(--ds-chart-green-bolder)'],
		['#FF9D00', 'var(--ds-chart-yellow-bolder)'],
		['#B65C02', 'var(--ds-chart-orange-bolder)'],
		['#D32D03', 'var(--ds-chart-red-bolder)'],
		['#CD519D', 'var(--ds-chart-magenta-bolder)'],
		['#5A43D0', 'var(--ds-chart-purple-bolder)'],
		['#758195', 'var(--ds-chart-gray-bolder)'],
		['#003884', 'var(--ds-chart-blue-boldest)'],
		['#206B74', 'var(--ds-chart-teal-boldest)'],
		['#055C3F', 'var(--ds-chart-green-boldest)'],
		['#946104', 'var(--ds-chart-yellow-boldest)'],
		['#974F0C', 'var(--ds-chart-orange-boldest)'],
		['#A32000', 'var(--ds-chart-red-boldest)'],
		['#943D73', 'var(--ds-chart-magenta-boldest)'],
		['#44368B', 'var(--ds-chart-purple-boldest)'],
		['#44546F', 'var(--ds-chart-gray-boldest)'],
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
