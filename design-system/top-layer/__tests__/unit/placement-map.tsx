import {
	fromLegacyPlacement,
	placementMapping,
	type TLegacyPlacement,
	type TPlacementOptions,
} from '../../src/placement-map';

describe('placement-map', () => {
	describe('fromLegacyPlacement', () => {
		const expectedMappings: [TLegacyPlacement, TPlacementOptions][] = [
			['top', { axis: 'block', edge: 'start', align: 'center' }],
			['top-start', { axis: 'block', edge: 'start', align: 'start' }],
			['top-center', { axis: 'block', edge: 'start', align: 'center' }],
			['top-end', { axis: 'block', edge: 'start', align: 'end' }],
			['bottom', { axis: 'block', edge: 'end', align: 'center' }],
			['bottom-start', { axis: 'block', edge: 'end', align: 'start' }],
			['bottom-center', { axis: 'block', edge: 'end', align: 'center' }],
			['bottom-end', { axis: 'block', edge: 'end', align: 'end' }],
			['right', { axis: 'inline', edge: 'end', align: 'center' }],
			['right-start', { axis: 'inline', edge: 'end', align: 'start' }],
			['right-end', { axis: 'inline', edge: 'end', align: 'end' }],
			['left', { axis: 'inline', edge: 'start', align: 'center' }],
			['left-start', { axis: 'inline', edge: 'start', align: 'start' }],
			['left-end', { axis: 'inline', edge: 'start', align: 'end' }],
			['auto', { axis: 'block', edge: 'end', align: 'center' }],
			['auto-start', { axis: 'block', edge: 'end', align: 'start' }],
			['auto-end', { axis: 'block', edge: 'end', align: 'end' }],
		];

		it.each(expectedMappings)('maps "%s" to %o', (legacy, expected) => {
			expect(fromLegacyPlacement({ legacy })).toEqual(expected);
		});
	});

	describe('placementMapping', () => {
		it('contains all 17 legacy placements (including top-center, bottom-center for spotlight)', () => {
			expect(Object.keys(placementMapping)).toHaveLength(17);
		});

		it('maps non-auto placements to TPlacementOptions (top-center and bottom-center map like top/bottom)', () => {
			const nonAutoEntries = Object.entries(placementMapping).filter(
				([key]) => !key.startsWith('auto'),
			);
			expect(nonAutoEntries.length).toBe(14);
			// top-center and bottom-center duplicate block-start and block-end respectively (with explicit align: 'center')
			expect(fromLegacyPlacement({ legacy: 'top-center' })).toEqual({
				axis: 'block',
				edge: 'start',
				align: 'center',
			});
			expect(fromLegacyPlacement({ legacy: 'bottom-center' })).toEqual({
				axis: 'block',
				edge: 'end',
				align: 'center',
			});
		});
	});
});
