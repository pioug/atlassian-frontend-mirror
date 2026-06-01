import {
	fromLegacyPlacement,
	type TLegacyPlacement,
	type TPlacementOptions,
} from '../../src/placement-map';
import { placementMapping } from '../../src/placement-map/placement-mapping';

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

	describe('fromLegacyPlacement with legacy offset tuple', () => {
		it('includes offset in the returned placement when offset is provided', () => {
			const result = fromLegacyPlacement({ legacy: 'bottom', offset: [0, 8] });
			expect(result.offset).toEqual({
				gap: 8,
				crossAxisShift: { value: 0, direction: 'forwards' },
			});
		});

		it('maps positive shift offset to forwards direction', () => {
			const result = fromLegacyPlacement({ legacy: 'bottom', offset: [4, 8] });
			expect(result.offset?.crossAxisShift).toEqual({ value: 4, direction: 'forwards' });
		});

		it('maps negative shift offset to backwards direction with absolute value', () => {
			const result = fromLegacyPlacement({ legacy: 'bottom', offset: [-4, 8] });
			expect(result.offset?.crossAxisShift).toEqual({ value: 4, direction: 'backwards' });
		});

		it('handles zero gap offset', () => {
			const result = fromLegacyPlacement({ legacy: 'bottom', offset: [4, 0] });
			expect(result.offset?.gap).toBe(0);
		});

		it('omits offset field when offset is not provided', () => {
			const result = fromLegacyPlacement({ legacy: 'bottom' });
			expect(result.offset).toBeUndefined();
		});

		it('applies offset tuple to different placements', () => {
			const offsetTuple: [number, number] = [2, 16];

			const blockStartResult = fromLegacyPlacement({ legacy: 'top', offset: offsetTuple });
			expect(blockStartResult).toEqual({
				axis: 'block',
				edge: 'start',
				align: 'center',
				offset: { gap: 16, crossAxisShift: { value: 2, direction: 'forwards' } },
			});

			const inlineStartResult = fromLegacyPlacement({ legacy: 'left', offset: offsetTuple });
			expect(inlineStartResult).toEqual({
				axis: 'inline',
				edge: 'start',
				align: 'center',
				offset: { gap: 16, crossAxisShift: { value: 2, direction: 'forwards' } },
			});
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
