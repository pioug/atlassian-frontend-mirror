import { placementToPositionArea } from '../../src/internal/anchor-positioning/placement-to-position-area';
import { placementToTryFallbacks } from '../../src/internal/anchor-positioning/placement-to-try-fallbacks';
import { resolvePlacement, type TPlacementOptions } from '../../src/internal/resolve-placement';

function tryFallbacksFor(placement: TPlacementOptions): string {
	return placementToTryFallbacks({ placement: resolvePlacement({ placement }) });
}

const ALL_PLACEMENTS: TPlacementOptions[] = (['block', 'inline'] as const).flatMap((axis) =>
	(['start', 'end'] as const).flatMap((edge) =>
		(['start', 'center', 'end'] as const).map((align) => ({ axis, edge, align })),
	),
);

describe('placementToTryFallbacks()', () => {
	describe('centered placements', () => {
		it('emits same-edge shifts, flip, then opposite-edge shifts for block-end', () => {
			expect(tryFallbacksFor({ axis: 'block', edge: 'end', align: 'center' })).toBe(
				[
					'block-end span-inline-end',
					'block-end span-inline-start',
					'flip-block',
					'block-start span-inline-end',
					'block-start span-inline-start',
				].join(', '),
			);
		});

		it('emits inline-axis spans and flip-inline for inline-end', () => {
			expect(tryFallbacksFor({ axis: 'inline', edge: 'end', align: 'center' })).toBe(
				[
					'inline-end span-block-end',
					'inline-end span-block-start',
					'flip-inline',
					'inline-start span-block-end',
					'inline-start span-block-start',
				].join(', '),
			);
		});
	});

	describe('aligned placements', () => {
		it('places the diagonal flip immediately after the primary flip for bottom-start', () => {
			const parts = tryFallbacksFor({ axis: 'block', edge: 'end', align: 'start' }).split(', ');
			const flipIndex = parts.indexOf('flip-block');
			const diagonalIndex = parts.indexOf('flip-block flip-inline');
			expect(flipIndex).toBeGreaterThan(-1);
			expect(diagonalIndex).toBe(flipIndex + 1);
		});

		it('includes the diagonal flip keyword for aligned placements', () => {
			expect(tryFallbacksFor({ axis: 'inline', edge: 'end', align: 'start' })).toContain(
				'flip-inline flip-block',
			);
		});

		it('re-centres then slides to the far span on the requested edge, and only re-centres on the opposite edge', () => {
			expect(tryFallbacksFor({ axis: 'block', edge: 'end', align: 'start' })).toBe(
				[
					'block-end',
					'block-end span-inline-start',
					'flip-block',
					'flip-block flip-inline',
					'block-start',
				].join(', '),
			);
		});

		it('mirrors the far span for align: end', () => {
			expect(tryFallbacksFor({ axis: 'block', edge: 'end', align: 'end' })).toBe(
				[
					'block-end',
					'block-end span-inline-end',
					'flip-block',
					'flip-block flip-inline',
					'block-start',
				].join(', '),
			);
		});
	});

	describe('start-edge placements', () => {
		it('flips toward block-end when the primary edge is block-start (centered)', () => {
			expect(tryFallbacksFor({ axis: 'block', edge: 'start', align: 'center' })).toBe(
				[
					'block-start span-inline-end',
					'block-start span-inline-start',
					'flip-block',
					'block-end span-inline-end',
					'block-end span-inline-start',
				].join(', '),
			);
		});

		it('flips toward inline-end when the primary edge is inline-start (centered)', () => {
			expect(tryFallbacksFor({ axis: 'inline', edge: 'start', align: 'center' })).toBe(
				[
					'inline-start span-block-end',
					'inline-start span-block-start',
					'flip-inline',
					'inline-end span-block-end',
					'inline-end span-block-start',
				].join(', '),
			);
		});
	});

	describe('every option can be chosen', () => {
		// A position-area option keeps the base margins, so one over the cell the
		// base already sits in has the same margin box and the same fit result: it
		// is dead. The near span of an aligned placement WAS the base, which put a
		// candidate that could never fit first in every aligned list.
		it.each(ALL_PLACEMENTS)('never repeats the base position-area for %o', (placement) => {
			const resolved = resolvePlacement({ placement });
			const base = placementToPositionArea({ placement: resolved });
			const options = placementToTryFallbacks({ placement: resolved }).split(', ');

			expect(options).not.toContain(base);
		});

		it.each(ALL_PLACEMENTS)('never lists the same option twice for %o', (placement) => {
			const options = tryFallbacksFor(placement).split(', ');

			expect(new Set(options).size).toBe(options.length);
		});
	});

	describe('centered placements never diagonal-flip', () => {
		it('omits the diagonal flip keyword for every centered placement', () => {
			const centered = ALL_PLACEMENTS.filter((placement) => placement.align === 'center');

			for (const placement of centered) {
				expect(tryFallbacksFor(placement)).not.toMatch(/flip-\w+ flip-\w+/);
			}
		});
	});
});
