import { placementToTryFallbacks } from '../../src/internal/placement-to-try-fallbacks';

describe('placementToTryFallbacks()', () => {
	describe('centered placements', () => {
		it('emits same-edge shifts, flip, then opposite-edge shifts for block-end', () => {
			const result = placementToTryFallbacks({
				placement: { axis: 'block', edge: 'end', align: 'center' },
			});
			expect(result).toBe(
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
			const result = placementToTryFallbacks({
				placement: { axis: 'inline', edge: 'end', align: 'center' },
			});
			expect(result).toBe(
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
			const result = placementToTryFallbacks({
				placement: { axis: 'block', edge: 'end', align: 'start' },
			});
			const parts = result.split(', ');
			const flipIndex = parts.indexOf('flip-block');
			const diagonalIndex = parts.indexOf('flip-block flip-inline');
			expect(flipIndex).toBeGreaterThan(-1);
			expect(diagonalIndex).toBe(flipIndex + 1);
		});

		it('includes the diagonal flip keyword for aligned placements', () => {
			const result = placementToTryFallbacks({
				placement: { axis: 'inline', edge: 'end', align: 'start' },
			});
			expect(result).toContain('flip-inline flip-block');
		});
	});

	describe('start-edge placements', () => {
		it('flips toward block-end when the primary edge is block-start (centered)', () => {
			const result = placementToTryFallbacks({
				placement: { axis: 'block', edge: 'start', align: 'center' },
			});
			expect(result).toBe(
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
			const result = placementToTryFallbacks({
				placement: { axis: 'inline', edge: 'start', align: 'center' },
			});
			expect(result).toBe(
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

	describe('end-aligned placements', () => {
		it('emits the mirrored near/far spans for align: end (block-end)', () => {
			const result = placementToTryFallbacks({
				placement: { axis: 'block', edge: 'end', align: 'end' },
			});
			expect(result).toBe(
				[
					'block-end span-inline-start',
					'block-end',
					'block-end span-inline-end',
					'flip-block',
					'flip-block flip-inline',
					'block-start span-inline-start',
					'block-start',
					'block-start span-inline-end',
				].join(', '),
			);
		});
	});

	describe('centered placements never diagonal-flip', () => {
		it('omits the diagonal flip keyword for every centered placement', () => {
			const centered = [
				{ axis: 'block', edge: 'start', align: 'center' },
				{ axis: 'block', edge: 'end', align: 'center' },
				{ axis: 'inline', edge: 'start', align: 'center' },
				{ axis: 'inline', edge: 'end', align: 'center' },
			] as const;
			centered.forEach((placement) => {
				const result = placementToTryFallbacks({ placement });
				expect(result).not.toContain('flip-block flip-inline');
				expect(result).not.toContain('flip-inline flip-block');
			});
		});
	});

	describe('no viewport-edge clamp', () => {
		it('never emits the removed --ds-tl-shift-* named rules', () => {
			const placements = [
				{ axis: 'block', edge: 'start', align: 'center' },
				{ axis: 'block', edge: 'end', align: 'start' },
				{ axis: 'inline', edge: 'start', align: 'center' },
				{ axis: 'inline', edge: 'end', align: 'end' },
			] as const;
			placements.forEach((placement) => {
				expect(placementToTryFallbacks({ placement })).not.toContain('--ds-tl-shift');
			});
		});
	});
});
