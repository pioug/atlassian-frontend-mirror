import {
	flexGapRectangles,
	gridGapRectangles,
	uncoveredRectangles,
} from '../../examples/shared/spacing-inspector/measure-gaps';
import {
	indexGapStyles,
	resolveGapToken,
} from '../../examples/shared/spacing-inspector/resolve-gap-token';

describe('spacing inspector token identity', () => {
	let sheet: HTMLStyleElement;
	let element: HTMLDivElement;
	beforeEach(() => {
		sheet = document.createElement('style');
		document.head.append(sheet);
		element = document.createElement('div');
		element.className = 'sample';
		document.body.append(element);
	});
	afterEach(() => {
		sheet.remove();
		element.remove();
		jest.restoreAllMocks();
	});
	const resolve = (axis: 'row-gap' | 'column-gap' = 'row-gap') =>
		resolveGapToken(element, axis, indexGapStyles(document));

	it('distinguishes token references with equal fallback values', () => {
		sheet.textContent =
			'.sample { row-gap: var(--ds-space-gap-large, 8px); column-gap: var(--ds-space-gap-medium, 8px); }';
		expect(resolve('row-gap')).toBe('space.gap.large');
		expect(resolve('column-gap')).toBe('space.gap.medium');
	});
	it('keeps semantic identity when its inherited variable uses a numeric token', () => {
		element.style.setProperty('--ds-space-gap-large', 'calc(var(--ds-space-150) * 2)');
		sheet.textContent = '.sample { row-gap: var(--ds-space-gap-large, 12px); }';
		expect(resolve()).toBe('space.gap.large');
	});
	it('uses specificity, source order, and important declarations', () => {
		sheet.textContent =
			'.sample.sample { row-gap: var(--ds-space-gap-large); } .sample { row-gap: var(--ds-space-gap-small); }';
		expect(resolve()).toBe('space.gap.large');
		sheet.textContent += '.sample.sample { row-gap: var(--ds-space-gap-xlarge); }';
		expect(resolve()).toBe('space.gap.xlarge');
		sheet.textContent += '.sample { row-gap: var(--ds-space-gap-medium) !important; }';
		expect(resolve()).toBe('space.gap.medium');
		element.style.setProperty('row-gap', 'var(--ds-space-gap-small)');
		expect(resolve()).toBe('space.gap.medium');
		element.style.setProperty('row-gap', 'var(--ds-space-gap-small)', 'important');
		expect(resolve()).toBe('space.gap.small');
	});
	it('reads separate row and column references from a gap shorthand', () => {
		sheet.textContent =
			'.sample { gap: var(--ds-space-gap-small, 6px) var(--ds-space-gap-large, 12px); }';
		expect(resolve('row-gap')).toBe('space.gap.small');
		expect(resolve('column-gap')).toBe('space.gap.large');
	});
	it('keeps nested fallback expressions together when parsing gap shorthands', () => {
		sheet.textContent =
			'.sample { gap: var(--ds-space-gap-small, calc(var(--fallback, 3px) * 2)) var(--ds-space-gap-large, 12px); }';
		expect(resolve('row-gap')).toBe('space.gap.small');
		expect(resolve('column-gap')).toBe('space.gap.large');
	});
	it('respects an inline numeric override without assigning a matching token', () => {
		sheet.textContent = '.sample { row-gap: var(--ds-space-gap-medium, 8px); }';
		element.style.setProperty('row-gap', '8px');
		expect(resolve()).toBeNull();
	});
	it('honors shorthand and longhand order within the same declaration block', () => {
		sheet.textContent =
			'.sample { row-gap: var(--ds-space-gap-small); gap: var(--ds-space-gap-large) !important; }';
		expect(resolve()).toBe('space.gap.large');
		sheet.textContent =
			'.sample { gap: var(--ds-space-gap-large); row-gap: var(--ds-space-gap-small); }';
		expect(resolve()).toBe('space.gap.small');
		expect(resolve('column-gap')).toBe('space.gap.large');
	});
	it('does not label a token overridden by an all reset', () => {
		sheet.textContent = '.sample { row-gap: var(--ds-space-gap-small); all: inherit; }';
		expect(resolve()).toBeNull();
	});
	it.each(['var(--custom-gap)', 'calc(var(--ds-space-gap-small) + var(--ds-space-gap-medium))'])(
		'does not guess the identity of %s',
		(value) => {
			sheet.textContent = `.sample { row-gap: ${value}; }`;
			expect(resolve()).toBeNull();
		},
	);
	it('only treats matching unsupported selectors as uncertain', () => {
		sheet.textContent =
			'.sample { row-gap: var(--ds-space-gap-small); } .other > .sample { row-gap: var(--ds-space-gap-large); }';
		expect(resolve()).toBe('space.gap.small');
		sheet.textContent += 'body > .sample { row-gap: var(--ds-space-gap-large); }';
		expect(resolve()).toBeNull();
	});
	it('uses only active media rules', () => {
		jest
			.spyOn(window, 'matchMedia')
			.mockImplementation(
				(query) => ({ matches: query === '(min-width: 800px)' }) as MediaQueryList,
			);
		sheet.textContent =
			'.sample { row-gap: var(--ds-space-gap-small); } @media (min-width: 800px) { .sample { row-gap: var(--ds-space-gap-large); } } @media (max-width: 400px) { .sample { row-gap: var(--ds-space-gap-xxlarge); } }';
		expect(resolve()).toBe('space.gap.large');
	});
	it('returns unknown when a stylesheet cannot be inspected', () => {
		sheet.textContent = '.sample { row-gap: var(--ds-space-gap-small); }';
		Object.defineProperty(sheet.sheet, 'cssRules', {
			configurable: true,
			get: () => {
				throw new DOMException('Not accessible', 'SecurityError');
			},
		});
		expect(resolve()).toBeNull();
	});
});

describe('spacing inspector geometry', () => {
	it('removes gutters covered by a spanning grid item', () => {
		expect(
			uncoveredRectangles({ x: 100, y: 0, width: 8, height: 92 }, [
				{ x: 0, y: 0, width: 208, height: 40 },
			]),
		).toEqual([{ x: 100, y: 40, width: 8, height: 52 }]);
	});
	it('measures vertical stacks without including child height', () => {
		expect(
			flexGapRectangles(
				[
					{ x: 10, y: 20, width: 100, height: 30 },
					{ x: 10, y: 62, width: 100, height: 50 },
				],
				'y',
				12,
				12,
			),
		).toEqual([{ x: 10, y: 50, width: 100, height: 12, axis: 'y', size: 12, extra: 0 }]);
	});
	it('separates a declared gap from distributed alignment space', () => {
		expect(
			flexGapRectangles(
				[
					{ x: 0, y: 0, width: 20, height: 30 },
					{ x: 100, y: 0, width: 20, height: 30 },
				],
				'x',
				8,
				8,
			),
		).toEqual([{ x: 56, y: 0, width: 8, height: 30, axis: 'x', size: 8, extra: 72 }]);
	});
	it('handles wrapped rows with unequal item heights', () => {
		const bands = flexGapRectangles(
			[
				{ x: 0, y: 0, width: 20, height: 30 },
				{ x: 28, y: 5, width: 20, height: 20 },
				{ x: 0, y: 42, width: 20, height: 30 },
			],
			'x',
			8,
			12,
		);
		expect(bands).toEqual([
			{ x: 20, y: 0, width: 8, height: 30, axis: 'x', size: 8, extra: 0 },
			{ x: 0, y: 30, width: 48, height: 12, axis: 'y', size: 12, extra: 0 },
		]);
	});
	it('does not paint zero gaps or gaps hidden by overlapping items', () => {
		expect(
			flexGapRectangles(
				[
					{ x: 0, y: 0, width: 20, height: 30 },
					{ x: 10, y: 0, width: 20, height: 30 },
				],
				'x',
				8,
				0,
			),
		).toEqual([]);
		expect(
			flexGapRectangles(
				[
					{ x: 0, y: 0, width: 20, height: 30 },
					{ x: 20, y: 0, width: 20, height: 30 },
				],
				'x',
				0,
				0,
			),
		).toEqual([]);
	});
	it('uses resolved grid tracks for row and column gutters', () => {
		expect(
			gridGapRectangles({ x: 10, y: 20, width: 208, height: 92 }, [100, 100], [40, 40], 8, 12),
		).toEqual([
			{ x: 110, y: 20, width: 8, height: 92, axis: 'x', size: 8, extra: 0 },
			{ x: 10, y: 60, width: 208, height: 12, axis: 'y', size: 12, extra: 0 },
		]);
	});
});
