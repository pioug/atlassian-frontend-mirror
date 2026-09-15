import { resolveCssLengthToPixels } from '../../src/internal/javascript-fallback/resolve-css-length-to-pixels';

describe('resolveCssLengthToPixels', () => {
	it('returns numbers as-is', () => {
		const container = document.createElement('div');
		document.body.appendChild(container);

		expect(resolveCssLengthToPixels({ value: 0, container })).toBe(0);
		expect(resolveCssLengthToPixels({ value: 12, container })).toBe(12);
		expect(resolveCssLengthToPixels({ value: -8, container })).toBe(-8);

		document.body.removeChild(container);
	});

	it('parses bare px strings without touching the DOM', () => {
		const container = document.createElement('div');
		document.body.appendChild(container);
		const before = container.children.length;

		expect(resolveCssLengthToPixels({ value: '16px', container })).toBe(16);
		expect(resolveCssLengthToPixels({ value: '0.5px', container })).toBe(0.5);
		expect(resolveCssLengthToPixels({ value: '-4px', container })).toBe(-4);

		// Probe should never have been mounted for the px fast-path.
		expect(container.children.length).toBe(before);
		document.body.removeChild(container);
	});

	it('returns 0 for an unresolvable value', () => {
		const container = document.createElement('div');
		document.body.appendChild(container);

		// jsdom resolves invalid lengths to '' which parseFloat returns NaN for;
		// the resolver should clamp NaN to 0 to keep callers safe.
		expect(resolveCssLengthToPixels({ value: 'not-a-length', container })).toBe(0);

		document.body.removeChild(container);
	});

	it('does not leave the probe element in the container', () => {
		const container = document.createElement('div');
		document.body.appendChild(container);
		const before = container.children.length;

		resolveCssLengthToPixels({ value: '12rem', container });

		expect(container.children.length).toBe(before);
		document.body.removeChild(container);
	});

	describe('zero fast path', () => {
		it.each(['0', '-0'])(
			'returns 0 for the unitless string [%s] without mounting a probe',
			(value) => {
				const container = document.createElement('div');
				document.body.appendChild(container);
				const appendSpy = jest.spyOn(container, 'appendChild');

				expect(resolveCssLengthToPixels({ value, container })).toBe(0);
				expect(appendSpy).not.toHaveBeenCalled();

				document.body.removeChild(container);
			},
		);
	});

	describe('probe attributes', () => {
		it('marks the temporary probe as aria-hidden and inert before measuring', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			const appendSpy = jest.spyOn(container, 'appendChild');

			// `1rem` does not match any fast path → probe path runs.
			resolveCssLengthToPixels({ value: '1rem', container });

			expect(appendSpy).toHaveBeenCalledTimes(1);
			const probe = appendSpy.mock.calls[0][0] as HTMLElement;
			expect(probe).toHaveAttribute('aria-hidden', 'true');
			expect(probe).toHaveAttribute('inert');

			document.body.removeChild(container);
		});
	});
});
