import { placementMap } from './placement-map';

describe('placementMap', () => {
	const blockAxisPlacements = [
		'top-start',
		'top-end',
		'bottom-start',
		'bottom-end',
	] as const;
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
});
