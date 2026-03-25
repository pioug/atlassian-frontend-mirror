import {
	placementToPositionArea,
	placementToTryFallbacks,
} from '../../src/internal/use-anchor-positioning';
import type { TPlacementOptions } from '../../src/popup/types';

describe('placementToPositionArea()', () => {
	describe('single-axis (centered) placements', () => {
		it.each([
			[{ axis: 'block', edge: 'start' }, 'block-start'],
			[{ axis: 'block', edge: 'end' }, 'block-end'],
			[{ axis: 'inline', edge: 'start' }, 'inline-start'],
			[{ axis: 'inline', edge: 'end' }, 'inline-end'],
			// Explicit center align should also produce single-axis
			[{ axis: 'block', edge: 'end', align: 'center' }, 'block-end'],
		] as [TPlacementOptions, string][])('maps %o to "%s"', (placement, expected) => {
			expect(placementToPositionArea({ placement })).toBe(expected);
		});
	});

	describe('defaults: empty object resolves to block-end', () => {
		it('maps {} to "block-end"', () => {
			expect(placementToPositionArea({ placement: {} })).toBe('block-end');
		});
	});

	describe('aligned placements add inverted span- prefix', () => {
		it.each([
			// align: 'start' → visual start-aligned → CSS span toward end
			[{ axis: 'block', edge: 'start', align: 'start' }, 'block-start span-inline-end'],
			[{ axis: 'block', edge: 'end', align: 'start' }, 'block-end span-inline-end'],
			// align: 'end' → visual end-aligned → CSS span toward start
			[{ axis: 'block', edge: 'start', align: 'end' }, 'block-start span-inline-start'],
			[{ axis: 'block', edge: 'end', align: 'end' }, 'block-end span-inline-start'],
			// Inline axis
			[{ axis: 'inline', edge: 'start', align: 'start' }, 'inline-start span-block-end'],
			[{ axis: 'inline', edge: 'start', align: 'end' }, 'inline-start span-block-start'],
			[{ axis: 'inline', edge: 'end', align: 'start' }, 'inline-end span-block-end'],
			[{ axis: 'inline', edge: 'end', align: 'end' }, 'inline-end span-block-start'],
		] as [TPlacementOptions, string][])('maps %o to "%s"', (placement, expected) => {
			expect(placementToPositionArea({ placement })).toBe(expected);
		});
	});
});

describe('placementToTryFallbacks()', () => {
	describe('centered block placements include cross-axis shifts and flip-block', () => {
		it.each([
			[
				{ axis: 'block', edge: 'start' },
				'block-start span-inline-end, block-start span-inline-start, flip-block, block-end span-inline-end, block-end span-inline-start',
			],
			[
				{ axis: 'block', edge: 'end' },
				'block-end span-inline-end, block-end span-inline-start, flip-block, block-start span-inline-end, block-start span-inline-start',
			],
		] as [TPlacementOptions, string][])('returns cross-axis fallbacks for %o', (placement, expected) => {
			expect(placementToTryFallbacks({ placement })).toBe(expected);
		});
	});

	describe('centered inline placements include cross-axis shifts and flip-inline', () => {
		it.each([
			[
				{ axis: 'inline', edge: 'start' },
				'inline-start span-block-end, inline-start span-block-start, flip-inline, inline-end span-block-end, inline-end span-block-start',
			],
			[
				{ axis: 'inline', edge: 'end' },
				'inline-end span-block-end, inline-end span-block-start, flip-inline, inline-start span-block-end, inline-start span-block-start',
			],
		] as [TPlacementOptions, string][])('returns cross-axis fallbacks for %o', (placement, expected) => {
			expect(placementToTryFallbacks({ placement })).toBe(expected);
		});
	});

	describe('aligned placements include same-edge centered fallback and flip', () => {
		it.each([
			[
				{ axis: 'block', edge: 'start', align: 'start' },
				'block-start span-inline-end, block-start, block-start span-inline-start, flip-block, block-end span-inline-end, block-end, block-end span-inline-start',
			],
			[
				{ axis: 'block', edge: 'end', align: 'start' },
				'block-end span-inline-end, block-end, block-end span-inline-start, flip-block, block-start span-inline-end, block-start, block-start span-inline-start',
			],
			[
				{ axis: 'block', edge: 'end', align: 'end' },
				'block-end span-inline-start, block-end, block-end span-inline-end, flip-block, block-start span-inline-start, block-start, block-start span-inline-end',
			],
			[
				{ axis: 'inline', edge: 'start', align: 'end' },
				'inline-start span-block-start, inline-start, inline-start span-block-end, flip-inline, inline-end span-block-start, inline-end, inline-end span-block-end',
			],
			[
				{ axis: 'inline', edge: 'end', align: 'start' },
				'inline-end span-block-end, inline-end, inline-end span-block-start, flip-inline, inline-start span-block-end, inline-start, inline-start span-block-start',
			],
		] as [TPlacementOptions, string][])('returns position-area fallbacks including center for %o', (placement, expected) => {
			expect(placementToTryFallbacks({ placement })).toBe(expected);
		});
	});
});
