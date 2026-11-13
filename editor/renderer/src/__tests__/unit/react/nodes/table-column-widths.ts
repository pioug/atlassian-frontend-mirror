import { normalizeTableColumnWidths } from '@atlaskit/editor-common/table/normalize-column-widths';

it.each([
	{ tableWidth: 1000, columnWidths: [250, 250, 250, 250], isNumberColumnEnabled: true },
	{ tableWidth: 700, columnWidths: [600, 200], isNumberColumnEnabled: false },
	{ tableWidth: 1000, columnWidths: [100, 200], isNumberColumnEnabled: true },
	{ tableWidth: 700, columnWidths: [1000, 0], isNumberColumnEnabled: false },
	{ tableWidth: 700, columnWidths: [0, 0], isNumberColumnEnabled: true },
])('fits saved table dimensions: %j', (options) => {
	const widths = normalizeTableColumnWidths(options);
	const expected = options.tableWidth - 1 - (options.isNumberColumnEnabled ? 42 : 0);
	expect(widths.reduce((sum, width) => sum + width, 0)).toBeCloseTo(expected);
	expect(widths.every((width) => width >= 48)).toBe(true);
});

it('redistributes space when one column reaches its minimum', () => {
	const widths = normalizeTableColumnWidths({
		tableWidth: 300,
		columnWidths: [50, 1000],
		isNumberColumnEnabled: false,
	});
	expect(widths).toEqual([48, 251]);
});

it('allows necessary overflow rather than reducing columns below their minimum', () => {
	expect(
		normalizeTableColumnWidths({
			tableWidth: 60,
			columnWidths: [100, 100],
			isNumberColumnEnabled: false,
		}),
	).toEqual([48, 48]);
});
