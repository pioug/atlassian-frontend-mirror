import {
	tableBackgroundColorNameByHex,
	tableBackgroundColorNames,
	tableBackgroundColorPalette,
	tableBackgroundColorPaletteNew,
} from '../../../../schema/nodes/tableNodes';

/**
 * `tableBackgroundColorPalette` (original) and `tableBackgroundColorPaletteNew` (expanded) are
 * the source of truth for table cell background colours. Both populate two derived maps:
 *
 * - `tableBackgroundColorNameByHex` (hex -> name) drives the `colorname` DOM attribute.
 * - `tableBackgroundColorNames` (name -> hex) drives the table cell background CSS custom
 *   properties built in `@atlaskit/editor-common`.
 *
 * In HOT-305120 a palette change stopped populating `tableBackgroundColorNames` for the seven
 * colours unique to the original palette. The `colorname` attribute and the CSS selectors keyed
 * on it were unaffected, so the rules still matched but resolved to an undefined custom
 * property - and because those rules are `!important` they also beat the inline background, so
 * the cells rendered transparent. These tests assert the derived maps stay in lockstep with the
 * palettes, so that kind of desync fails here, in the package that owns it.
 */
describe('table background colour maps', () => {
	const paletteEntries: Array<[string, string]> = [
		...Array.from(tableBackgroundColorPalette.entries()),
		...Array.from(tableBackgroundColorPaletteNew.entries()),
	];

	// The two palettes deliberately share colours, so identical entries collapse. A genuine
	// conflict (one key with two different values) survives as an extra entry and still fails.
	const uniqueSorted = (values: string[]) => Array.from(new Set(values)).sort();

	it('maps every palette hex to its colour name in tableBackgroundColorNameByHex', () => {
		const actual = Array.from(tableBackgroundColorNameByHex.entries()).map(
			([hex, colorName]) => `${hex} -> ${colorName}`,
		);
		const expected = paletteEntries.map(([hex, colorName]) => `${hex} -> ${colorName}`);

		expect(uniqueSorted(actual)).toEqual(uniqueSorted(expected));
	});

	it('maps every colour name back to its palette hex in tableBackgroundColorNames', () => {
		const actual = Array.from(tableBackgroundColorNames.entries()).map(
			([colorName, hex]) => `${colorName} -> ${hex}`,
		);
		const expected = paletteEntries.map(
			([hex, colorName]) => `${colorName.toLowerCase()} -> ${hex}`,
		);

		expect(uniqueSorted(actual)).toEqual(uniqueSorted(expected));
	});

	it('gives every colour name exactly one hex across both palettes', () => {
		// `tableBackgroundColorNames` is keyed by name, so a name reused for a different hex
		// would silently overwrite the earlier entry and change that colour everywhere.
		const hexesByName = new Map<string, Set<string>>();
		paletteEntries.forEach(([hex, colorName]) => {
			const key = colorName.toLowerCase();
			const hexes = hexesByName.get(key) ?? new Set<string>();
			hexes.add(hex);
			hexesByName.set(key, hexes);
		});

		const namesWithMultipleHexes = Array.from(hexesByName.entries())
			.filter(([, hexes]) => hexes.size > 1)
			.map(([colorName, hexes]) => `${colorName}: ${Array.from(hexes).sort().join(', ')}`);

		expect(namesWithMultipleHexes).toEqual([]);
	});
});
