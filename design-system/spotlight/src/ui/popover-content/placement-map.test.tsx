import { getPlacementWithOffset } from './get-placement-with-offset';
import { placementMap } from './placement-map';

describe('placementMap', () => {
	const blockAxisPlacements = ['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const;
	const inlineAxisPlacements = ['left-start', 'left-end', 'right-start', 'right-end'] as const;

	it('uses anchor-size(width) dynamic cross-axis shift for block-axis start/end placements', () => {
		for (const key of blockAxisPlacements) {
			expect(placementMap[key].offset?.crossAxisShift?.value).toContain('anchor-size(width)');
			expect(placementMap[key].offset?.crossAxisShift?.direction).toBe(
				key.endsWith('-start') ? 'backwards' : 'forwards',
			);
		}
	});

	it('uses anchor-size(height) dynamic cross-axis shift for inline-axis start/end placements', () => {
		for (const key of inlineAxisPlacements) {
			expect(placementMap[key].offset?.crossAxisShift?.value).toContain('anchor-size(height)');
			expect(placementMap[key].offset?.crossAxisShift?.direction).toBe(
				key.endsWith('-start') ? 'backwards' : 'forwards',
			);
		}
	});

	it('does not set crossAxisShift on center placements', () => {
		expect(placementMap['top-center'].offset?.crossAxisShift).toBeUndefined();
		expect(placementMap['bottom-center'].offset?.crossAxisShift).toBeUndefined();
	});

	describe('getPlacementWithOffset', () => {
		it('returns the base placement when offset is not provided', () => {
			expect(getPlacementWithOffset({ placement: 'bottom-start', offset: undefined })).toBe(
				placementMap['bottom-start'],
			);
		});

		it('returns the base placement when both offset values are nullish', () => {
			expect(
				getPlacementWithOffset({
					placement: 'bottom-start',
					offset: [null, undefined],
				}),
			).toBe(placementMap['bottom-start']);
		});

		it('adds away to the existing gap', () => {
			expect(
				getPlacementWithOffset({
					placement: 'bottom-start',
					offset: [0, -8],
				}).offset?.gap,
			).toBe(`calc(${placementMap['bottom-start'].offset?.gap} - 8px)`);
		});

		it('creates a cross-axis shift for center placements when along is non-zero', () => {
			expect(
				getPlacementWithOffset({
					placement: 'top-center',
					offset: [-12, 0],
				}).offset?.crossAxisShift,
			).toEqual({
				value: -12,
				direction: 'forwards',
			});
		});

		it('preserves the base start/end shift and adds the consumer along offset', () => {
			expect(
				getPlacementWithOffset({
					placement: 'bottom-end',
					offset: [6, 0],
				}).offset?.crossAxisShift,
			).toEqual({
				value: `calc(${placementMap['bottom-end'].offset?.crossAxisShift?.value} + 6px)`,
				direction: 'forwards',
			});
		});

		it('preserves the existing asymmetric inline shift adjustments', () => {
			const crossAxisShift = getPlacementWithOffset({
				placement: 'right-end',
				offset: [6, 0],
			}).offset?.crossAxisShift;

			expect(crossAxisShift?.direction).toBe('forwards');
			expect(crossAxisShift?.value).toContain('- 4px');
			expect(crossAxisShift?.value).toContain('+ 6px');
		});
	});
});
