import { resolvePlacement, type TPlacementOptions } from '../../src/internal/resolve-placement';

describe('resolvePlacement()', () => {
	describe('defaults', () => {
		it('applies all defaults when given an empty placement object', () => {
			const result = resolvePlacement({ placement: {} });
			expect(result).toEqual({
				axis: 'block',
				edge: 'end',
				align: 'center',
				offset: {
					// Default gap resolves to the design token for space.100.
					gap: 'var(--ds-space-100, 8px)',
					crossAxisShift: { value: '0px', direction: 'forwards' },
				},
			});
		});
	});

	describe('gap offset overrides', () => {
		it('normalizes a number gap offset to a px string', () => {
			const result = resolvePlacement({ placement: { offset: { gap: 12 } } });
			expect(result.offset.gap).toBe('12px');
			expect(result.offset.crossAxisShift).toEqual({ value: '0px', direction: 'forwards' });
		});

		it('overrides gap offset with a string (CSS length)', () => {
			const result = resolvePlacement({
				placement: { offset: { gap: 'var(--ds-space-100, 8px)' } },
			});
			expect(result.offset.gap).toBe('var(--ds-space-100, 8px)');
			expect(result.offset.crossAxisShift).toEqual({ value: '0px', direction: 'forwards' });
		});
	});

	describe('shift offset overrides', () => {
		it('normalizes shift.value number to a px string, defaulting direction to forwards', () => {
			const result = resolvePlacement({ placement: { offset: { crossAxisShift: { value: 6 } } } });
			expect(result.offset.crossAxisShift).toEqual({ value: '6px', direction: 'forwards' });
		});

		it('passes shift.value string through unchanged', () => {
			const result = resolvePlacement({
				placement: { offset: { crossAxisShift: { value: '4px' } } },
			});
			expect(result.offset.crossAxisShift).toEqual({ value: '4px', direction: 'forwards' });
		});

		it('overrides shift.direction only, defaulting value to 0px', () => {
			const result = resolvePlacement({
				placement: { offset: { crossAxisShift: { direction: 'backwards' } } },
			});
			expect(result.offset.crossAxisShift).toEqual({ value: '0px', direction: 'backwards' });
		});

		it('overrides both shift.value and shift.direction', () => {
			const result = resolvePlacement({
				placement: { offset: { crossAxisShift: { value: 8, direction: 'backwards' } } },
			});
			expect(result.offset.crossAxisShift).toEqual({ value: '8px', direction: 'backwards' });
		});
	});

	describe('combined overrides', () => {
		it('overrides every field at once', () => {
			const result = resolvePlacement({
				placement: {
					axis: 'inline',
					edge: 'start',
					align: 'end',
					offset: {
						gap: 16,
						crossAxisShift: { value: 4, direction: 'backwards' },
					},
				},
			});
			expect(result).toEqual({
				axis: 'inline',
				edge: 'start',
				align: 'end',
				offset: {
					gap: '16px',
					crossAxisShift: { value: '4px', direction: 'backwards' },
				},
			});
		});

		it('overrides axis while keeping default offset', () => {
			const result = resolvePlacement({ placement: { axis: 'inline' } });
			expect(result).toEqual({
				axis: 'inline',
				edge: 'end',
				align: 'center',
				offset: {
					gap: 'var(--ds-space-100, 8px)',
					crossAxisShift: { value: '0px', direction: 'forwards' },
				},
			});
		});

		it('overrides offset fields while keeping default axis, edge, align', () => {
			const result = resolvePlacement({
				placement: {
					offset: {
						gap: 20,
						crossAxisShift: { value: 12, direction: 'backwards' },
					},
				},
			});
			expect(result).toEqual({
				axis: 'block',
				edge: 'end',
				align: 'center',
				offset: {
					gap: '20px',
					crossAxisShift: { value: '12px', direction: 'backwards' },
				},
			});
		});
	});

	describe('purity', () => {
		it('returns deeply equal output for the same input (called twice)', () => {
			const placement: TPlacementOptions = {
				axis: 'block',
				edge: 'start',
				offset: { gap: 10, crossAxisShift: { value: 2 } },
			};

			const result1 = resolvePlacement({ placement });
			const result2 = resolvePlacement({ placement });

			expect(result1).toEqual(result2);
		});

		it('returns distinct object references on separate calls', () => {
			const placement: TPlacementOptions = { axis: 'inline' };

			const result1 = resolvePlacement({ placement });
			const result2 = resolvePlacement({ placement });

			expect(result1).not.toBe(result2);
			expect(result1.offset).not.toBe(result2.offset);
			expect(result1.offset.crossAxisShift).not.toBe(result2.offset.crossAxisShift);
		});
	});
});
